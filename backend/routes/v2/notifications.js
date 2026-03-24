if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

import { Router } from 'express';
import { QueryCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import docClient from '../../db/dynamodb.js';

export const notificationsV2Router = Router({ mergeParams: true });

const TABLE = 'gympt';

const NOTIF_TEMPLATES = {
  SESSION_REMINDER: (d) => `${d.date} ${d.time} PT 수업이 있습니다. 잊지 마세요!`,
  RESERVATION_CONFIRMED: (d) => `${d.date} ${d.time} PT 예약이 확정되었습니다.`,
  LOW_SESSIONS: (d) => `잔여 세션이 ${d.remaining}회 남았습니다. 재구매를 고려해보세요.`,
  REPURCHASE_PROMO: () => `회원권 세션이 모두 소진되었습니다. 지금 재구매하시면 특별 혜택을 드립니다!`,
  INACTIVITY_ALERT: (d) => `${d.name}님, 오랜만이에요. 다시 시작해볼까요?`,
  MANUAL: (d) => d.message || '새로운 알림이 있습니다.',
};

function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

/**
 * 알림 레코드 생성 헬퍼 (다른 라우터에서 import 가능)
 */
export async function createNotification({ userId, storeId, type, message, data = {} }) {
  const notifId = randomUUID();
  const now = new Date().toISOString();
  const template = NOTIF_TEMPLATES[type];
  const resolvedMessage = message || (template ? template(data) : '알림이 있습니다.');

  const item = {
    PK: `USER#${userId}`,
    SK: `NOTIF#${notifId}`,
    notifId,
    userId,
    storeId: storeId || 'store_default',
    type,
    message: resolvedMessage,
    isRead: false,
    createdAt: now,
    notifType: type,
    readStatus: 'UNREAD',
  };

  await docClient.send(new PutCommand({ TableName: TABLE, Item: item }));
  return item;
}

/**
 * GET /api/v2/users/:userId/notifications?isRead=false&limit=20
 */
notificationsV2Router.get('/', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const isReadParam = req.query.isRead;

    const result = await docClient.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':prefix': 'NOTIF#',
      },
    }));

    let notifications = (result.Items || []).sort(
      (a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')
    );

    if (isReadParam !== undefined) {
      const filterVal = isReadParam === 'true';
      notifications = notifications.filter((n) => n.isRead === filterVal);
    }

    const unreadCount = (result.Items || []).filter((n) => !n.isRead).length;
    const sliced = notifications.slice(0, limit);

    res.json({ notifications: sliced, unreadCount, total: notifications.length });
  } catch (e) {
    console.error('GET /notifications error:', e);
    return sendError(res, 500, e.message || '알림 조회에 실패했습니다.');
  }
});

/**
 * PATCH /api/v2/users/:userId/notifications/:notifId
 * notifId = 'all' 이면 전체 읽음 처리
 */
notificationsV2Router.patch('/:notifId', async (req, res) => {
  try {
    const { userId, notifId } = req.params;
    const now = new Date().toISOString();

    if (notifId === 'all') {
      const result = await docClient.send(new QueryCommand({
        TableName: TABLE,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
        FilterExpression: 'isRead = :false',
        ExpressionAttributeValues: {
          ':pk': `USER#${userId}`,
          ':prefix': 'NOTIF#',
          ':false': false,
        },
      }));

      const items = result.Items || [];
      await Promise.all(
        items.map((item) =>
          docClient.send(new UpdateCommand({
            TableName: TABLE,
            Key: { PK: item.PK, SK: item.SK },
            UpdateExpression: 'SET isRead = :true, readStatus = :read, updatedAt = :now',
            ExpressionAttributeValues: { ':true': true, ':read': 'READ', ':now': now },
          }))
        )
      );
      return res.json({ updated: items.length });
    }

    await docClient.send(new UpdateCommand({
      TableName: TABLE,
      Key: { PK: `USER#${userId}`, SK: `NOTIF#${notifId}` },
      UpdateExpression: 'SET isRead = :true, readStatus = :read, updatedAt = :now',
      ExpressionAttributeValues: { ':true': true, ':read': 'READ', ':now': now },
    }));

    res.json({ notifId, isRead: true });
  } catch (e) {
    console.error('PATCH /notifications error:', e);
    return sendError(res, 500, e.message || '알림 업데이트에 실패했습니다.');
  }
});

/**
 * POST /api/v2/stores/:storeId/notifications/send
 * 관리자 수동 알림 발송
 */
notificationsV2Router.post('/send', async (req, res) => {
  try {
    const { storeId } = req.params;
    const { userId, type, message } = req.body;

    if (!userId || !type) {
      return sendError(res, 400, 'userId, type은 필수입니다.');
    }

    const VALID_TYPES = ['SESSION_REMINDER', 'RESERVATION_CONFIRMED', 'LOW_SESSIONS', 'REPURCHASE_PROMO', 'INACTIVITY_ALERT', 'MANUAL'];
    if (!VALID_TYPES.includes(type)) {
      return sendError(res, 400, `type은 ${VALID_TYPES.join(', ')} 중 하나여야 합니다.`);
    }
    if (type === 'MANUAL' && !message) {
      return sendError(res, 400, 'MANUAL 타입은 message가 필요합니다.');
    }

    const notif = await createNotification({ userId, storeId, type, message, data: { message } });
    res.status(201).json(notif);
  } catch (e) {
    console.error('POST /notifications/send error:', e);
    return sendError(res, 500, e.message || '알림 발송에 실패했습니다.');
  }
});
