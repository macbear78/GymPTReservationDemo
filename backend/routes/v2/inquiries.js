if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

import { Router } from 'express';
import { randomUUID } from 'crypto';
import { QueryCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import docClient from '../../db/dynamodb.js';
import { requireAdmin } from '../../middleware/authMiddleware.js';

export const inquiriesV2Router = Router({ mergeParams: true });

const TABLE = 'gympt';

function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

/**
 * POST /api/v2/stores/:storeId/inquiries
 * 무료 상담 문의 등록 (공개)
 */
inquiriesV2Router.post('/', async (req, res) => {
  try {
    const { storeId } = req.params;
    const { name, phone, message } = req.body;

    if (!name?.trim())    return sendError(res, 400, '이름을 입력해주세요.');
    if (!message?.trim()) return sendError(res, 400, '문의 내용을 입력해주세요.');

    const now        = new Date().toISOString();
    const inquiryId  = randomUUID();

    const item = {
      PK:        `STORE#${storeId}`,
      SK:        `INQUIRY#${now}#${inquiryId}`,
      inquiryId,
      storeId,
      name:      name.trim(),
      phone:     phone?.trim() || '',
      message:   message.trim(),
      status:    'UNREAD',
      createdAt: now,
    };

    await docClient.send(new PutCommand({ TableName: TABLE, Item: item }));

    res.status(201).json({ ok: true, inquiryId });
  } catch (e) {
    console.error('POST /inquiries error:', e);
    return sendError(res, 500, e.message || '문의 등록에 실패했습니다.');
  }
});

/**
 * GET /api/v2/stores/:storeId/inquiries
 * 문의 목록 조회 (관리자)
 * query: status=UNREAD|READ|ALL (default ALL)
 */
inquiriesV2Router.get('/', requireAdmin, async (req, res) => {
  try {
    const { storeId } = req.params;
    const statusFilter = req.query.status || 'ALL';

    const result = await docClient.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
      ExpressionAttributeValues: {
        ':pk':     `STORE#${storeId}`,
        ':prefix': 'INQUIRY#',
      },
      ScanIndexForward: false, // 최신순
    }));

    let items = result.Items || [];
    if (statusFilter !== 'ALL') {
      items = items.filter(i => i.status === statusFilter);
    }

    res.json({ items, total: items.length });
  } catch (e) {
    console.error('GET /inquiries error:', e);
    return sendError(res, 500, e.message || '문의 목록 조회에 실패했습니다.');
  }
});

/**
 * PATCH /api/v2/stores/:storeId/inquiries/:inquiryId
 * 문의 상태 변경: READ | UNREAD (관리자)
 */
inquiriesV2Router.patch('/:inquiryId', requireAdmin, async (req, res) => {
  try {
    const { storeId, inquiryId } = req.params;
    const { status } = req.body;

    if (!['READ', 'UNREAD'].includes(status)) {
      return sendError(res, 400, 'status 는 READ 또는 UNREAD 여야 합니다.');
    }

    // SK 에 타임스탬프가 포함되므로 query 로 찾아야 함
    const found = await docClient.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
      FilterExpression: 'inquiryId = :id',
      ExpressionAttributeValues: {
        ':pk':     `STORE#${storeId}`,
        ':prefix': 'INQUIRY#',
        ':id':     inquiryId,
      },
    }));

    if (!found.Items?.length) return sendError(res, 404, '문의를 찾을 수 없습니다.');

    const sk  = found.Items[0].SK;
    const now = new Date().toISOString();

    await docClient.send(new UpdateCommand({
      TableName: TABLE,
      Key: { PK: `STORE#${storeId}`, SK: sk },
      UpdateExpression: 'SET #s = :status, readAt = :readAt',
      ExpressionAttributeNames:  { '#s': 'status' },
      ExpressionAttributeValues: { ':status': status, ':readAt': status === 'READ' ? now : null },
    }));

    res.json({ ok: true, inquiryId, status });
  } catch (e) {
    console.error('PATCH /inquiries/:id error:', e);
    return sendError(res, 500, e.message || '문의 상태 변경에 실패했습니다.');
  }
});
