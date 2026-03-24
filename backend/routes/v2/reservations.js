if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

import { Router } from 'express';
import {
  QueryCommand,
  GetCommand,
  ScanCommand,
  TransactWriteCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import docClient from '../../db/dynamodb.js';
import { createNotification } from './notifications.js';
import { createAuditLog } from './audit.js';

export const reservationsV2Router = Router({ mergeParams: true });

const TABLE = 'gympt';
const TRAINERS_TABLE = process.env.TRAINERS_TABLE || 'trainers';
const TIME_SLOTS = ['06:00', '07:00', '08:00', '09:00', '18:00', '19:00', '20:00'];
const VALID_STATUSES = ['PENDING', 'BOOKED', 'COMPLETED', 'CAD', 'NO_SHOW'];

function mapV2StatusToV1(s) {
  switch (s) {
    case 'PENDING':
      return 'Pending';
    case 'BOOKED':
      return 'Confirmed';
    case 'COMPLETED':
      return 'Completed';
    case 'CAD':
      return 'Cancelled';
    case 'NO_SHOW':
      return 'No-show';
    default:
      return 'Pending';
  }
}

async function loadTrainerIdToName() {
  const items = [];
  let lastKey;
  do {
    const result = await docClient.send(new ScanCommand({
      TableName: TRAINERS_TABLE,
      ExclusiveStartKey: lastKey,
    }));
    items.push(...(result.Items || []));
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);
  const map = {};
  for (const t of items) {
    if (t.id) map[t.id] = t.name || t.id;
  }
  return map;
}

/** 관리자 테이블용: 회원 이름·전화, 트레이너명, v1과 동일한 status 문자열 */
async function enrichReservationsForAdmin(items) {
  const trainerMap = await loadTrainerIdToName();
  const userIds = [...new Set(items.map((i) => i.userId).filter(Boolean))];
  const profileMap = {};
  await Promise.all(
    userIds.map(async (uid) => {
      const r = await docClient.send(new GetCommand({
        TableName: TABLE,
        Key: { PK: `USER#${uid}`, SK: 'PROFILE' },
      }));
      if (r.Item) {
        profileMap[uid] = { name: r.Item.name, phone: r.Item.phone };
      }
    }),
  );

  return items.map((item) => {
    const prof = profileMap[item.userId] || {};
    const trainerKey = item.trainerId || 'any';
    const trainerName = item.trainerId
      ? (trainerMap[item.trainerId] || item.trainerId)
      : '—';
    const pt = item.ptType || '60min';
    const pt_type = pt === '30min' || pt === '60min' ? pt : '60min';
    return {
      id: item.reservationId,
      reservationId: item.reservationId,
      userId: item.userId,
      name: prof.name || '—',
      phone: prof.phone || '—',
      trainer: trainerName,
      trainerKey,
      date: item.date,
      time: item.time,
      pt_type,
      status: mapV2StatusToV1(item.status),
      source: 'v2',
      _v2: true,
    };
  });
}

function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

/**
 * GET /api/v2/stores/:storeId/reservations/available?date=&trainerId=
 * 예약 가능 시간 슬롯 조회. trainerId 없으면 스토어 전체 기준.
 */
reservationsV2Router.get('/available', async (req, res) => {
  try {
    const { storeId } = req.params;
    const { date, trainerId } = req.query;

    if (!date) return sendError(res, 400, 'date 파라미터가 필요합니다.');

    const result = await docClient.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
      FilterExpression: '#st IN (:booked, :pending)',
      ExpressionAttributeNames: { '#st': 'status' },
      ExpressionAttributeValues: {
        ':pk': `STORE#${storeId}`,
        ':prefix': `RESERVATION#${date}#`,
        ':booked': 'BOOKED',
        ':pending': 'PENDING',
      },
    }));

    const items = result.Items || [];

    let bookedSlots;
    if (trainerId) {
      // 특정 트레이너 기준 예약된 슬롯
      bookedSlots = items
        .filter((r) => r.trainerId === trainerId)
        .map((r) => r.time);
    } else {
      // 스튜디오 전체 기준 (트레이너 미선택)
      bookedSlots = items.map((r) => r.time);
    }

    const availableSlots = TIME_SLOTS.filter((t) => !bookedSlots.includes(t));

    res.json({ date, availableSlots, bookedSlots });
  } catch (e) {
    console.error('GET /available error:', e);
    return sendError(res, 500, e.message || '가능 시간 조회에 실패했습니다.');
  }
});

/**
 * GET /api/v2/stores/:storeId/reservations?date=&status=
 * 관리자용 예약 목록 조회
 */
reservationsV2Router.get('/', async (req, res) => {
  try {
    const { storeId } = req.params;
    const { date, status } = req.query;

    const skPrefix = date ? `RESERVATION#${date}#` : 'RESERVATION#';

    const params = {
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `STORE#${storeId}`,
        ':prefix': skPrefix,
      },
    };

    if (status) {
      params.FilterExpression = '#st = :status';
      params.ExpressionAttributeNames = { '#st': 'status' };
      params.ExpressionAttributeValues[':status'] = status;
    }

    // 페이지네이션 처리
    const items = [];
    let lastKey;
    do {
      if (lastKey) params.ExclusiveStartKey = lastKey;
      const result = await docClient.send(new QueryCommand(params));
      items.push(...(result.Items || []));
      lastKey = result.LastEvaluatedKey;
    } while (lastKey);

    items.sort((a, b) => (a.datetime > b.datetime ? -1 : 1));

    const enriched = await enrichReservationsForAdmin(items);
    res.json({ reservations: enriched, total: enriched.length });
  } catch (e) {
    console.error('GET /reservations error:', e);
    return sendError(res, 500, e.message || '예약 목록 조회에 실패했습니다.');
  }
});

/**
 * POST /api/v2/stores/:storeId/reservations
 * 예약 생성. trainerId optional. TransactWrite로 STORE + USER 레코드 원자적 저장.
 */
reservationsV2Router.post('/', async (req, res) => {
  try {
    const { storeId } = req.params;
    const { userId, date, time, trainerId, ptType, passId } = req.body;

    if (!userId || !date || !time) {
      return sendError(res, 400, 'userId, date, time은 필수입니다.');
    }
    if (!TIME_SLOTS.includes(time)) {
      return sendError(res, 400, '유효하지 않은 시간 슬롯입니다.');
    }

    // 중복 예약 확인 (PENDING·BOOKED 상태 모두 점유로 처리)
    const conflict = await docClient.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND SK = :sk',
      FilterExpression: '#st IN (:booked, :pending)',
      ExpressionAttributeNames: { '#st': 'status' },
      ExpressionAttributeValues: {
        ':pk': `STORE#${storeId}`,
        ':sk': `RESERVATION#${date}#${time}#${trainerId || 'any'}`,
        ':booked': 'BOOKED',
        ':pending': 'PENDING',
      },
    }));

    if (conflict.Items && conflict.Items.length > 0) {
      return sendError(res, 409, '이미 예약된 시간입니다.');
    }

    const reservationId = randomUUID();
    const datetime = `${date}T${time}:00`;
    const now = new Date().toISOString();

    // STORE 레코드 — 날짜별 조회용
    const storeRecord = {
      PK: `STORE#${storeId}`,
      SK: `RESERVATION#${date}#${time}#${trainerId || 'any'}`,
      reservationId,
      storeId,
      userId,
      datetime,
      date,
      time,
      status: 'PENDING',
      statusDate: `PENDING#${date}`,  // GSI-2용
      ...(trainerId && { trainerId }),
      ...(ptType && { ptType }),
      ...(passId && { passId }),
      createdAt: now,
      updatedAt: now,
    };

    // USER 레코드 — 사용자 이력 조회용
    const userRecord = {
      PK: `USER#${userId}`,
      SK: `RESERVATION#${datetime}`,
      reservationId,
      storeId,
      datetime,
      date,
      time,
      status: 'PENDING',
      ...(trainerId && { trainerId }),
      ...(ptType && { ptType }),
      createdAt: now,
      updatedAt: now,
    };

    const transactItems = [
      {
        Put: {
          TableName: TABLE,
          Item: storeRecord,
          ConditionExpression: 'attribute_not_exists(PK)',  // 중복 방지
        },
      },
      {
        Put: {
          TableName: TABLE,
          Item: userRecord,
        },
      },
    ];

    // passId 있으면 세션 차감을 같은 트랜잭션에 포함
    if (passId) {
      const passItem = await docClient.send(new GetCommand({
        TableName: TABLE,
        Key: { PK: `USER#${userId}`, SK: `PASS#${passId}` },
      }));

      if (!passItem.Item) return sendError(res, 404, '패스를 찾을 수 없습니다.');
      const pass = passItem.Item;

      if (pass.remainingSessions <= 0) {
        return sendError(res, 409, '잔여 세션이 없습니다.');
      }
      if (pass.expiryDate < now.slice(0, 10)) {
        return sendError(res, 409, '만료된 패스입니다.');
      }

      const newRemaining = pass.remainingSessions - 1;
      const newStatus = newRemaining <= 0 ? 'EXHAUSTED' : 'ACTIVE';

      transactItems.push({
        Update: {
          TableName: TABLE,
          Key: { PK: `USER#${userId}`, SK: `PASS#${passId}` },
          UpdateExpression: 'SET remainingSessions = :r, #st = :status, updatedAt = :now',
          ConditionExpression: 'remainingSessions > :zero',
          ExpressionAttributeNames: { '#st': 'status' },
          ExpressionAttributeValues: {
            ':r': newRemaining,
            ':status': newStatus,
            ':now': now,
            ':zero': 0,
          },
        },
      });
    }

    await docClient.send(new TransactWriteCommand({ TransactItems: transactItems }));

    // 차감 후 잔여 세션 응답에 포함
    let remainingSessions;
    if (passId) {
      const updated = await docClient.send(new GetCommand({
        TableName: TABLE,
        Key: { PK: `USER#${userId}`, SK: `PASS#${passId}` },
      }));
      remainingSessions = updated.Item?.remainingSessions;
    }

    res.status(201).json({
      reservationId,
      status: 'PENDING',
      datetime,
      storeId,
      userId,
      ...(passId && { passId, remainingSessions }),
    });
  } catch (e) {
    if (e.name === 'TransactionCanceledException') {
      return sendError(res, 409, '이미 예약된 시간입니다.');
    }
    console.error('POST /reservations error:', e);
    return sendError(res, 500, e.message || '예약 생성에 실패했습니다.');
  }
});

/**
 * PATCH /api/v2/stores/:storeId/reservations/:reservationId
 * 예약 상태 변경
 */
reservationsV2Router.patch('/:reservationId', async (req, res) => {
  try {
    const { storeId, reservationId } = req.params;
    const { status, date, time, editedBy, reason } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return sendError(res, 400, `status는 ${VALID_STATUSES.join(', ')} 중 하나여야 합니다.`);
    }
    if (!date || !time) {
      return sendError(res, 400, 'date, time은 필수입니다.');
    }

    const now = new Date().toISOString();
    const trainerId = req.body.trainerId || 'any';

    // 변경 전 상태 조회 (audit log용)
    const existing = await docClient.send(new GetCommand({
      TableName: TABLE,
      Key: {
        PK: `STORE#${storeId}`,
        SK: `RESERVATION#${date}#${time}#${trainerId}`,
      },
    }));
    const prevStatus = existing.Item?.status;

    await docClient.send(new UpdateCommand({
      TableName: TABLE,
      Key: {
        PK: `STORE#${storeId}`,
        SK: `RESERVATION#${date}#${time}#${trainerId}`,
      },
      UpdateExpression: 'SET #st = :status, statusDate = :statusDate, updatedAt = :now',
      ExpressionAttributeNames: { '#st': 'status' },
      ExpressionAttributeValues: {
        ':status': status,
        ':statusDate': `${status}#${date}`,
        ':now': now,
      },
    }));

    // 사용자 이력(USER#) 레코드 동기화 — GET /users/:id/reservations 와 일치
    const uid = existing.Item?.userId;
    if (uid) {
      const datetime = `${date}T${time}:00`;
      const userSk = `RESERVATION#${datetime}`;
      await docClient.send(new UpdateCommand({
        TableName: TABLE,
        Key: {
          PK: `USER#${uid}`,
          SK: userSk,
        },
        UpdateExpression: 'SET #st = :status, statusDate = :statusDate, updatedAt = :now',
        ExpressionAttributeNames: { '#st': 'status' },
        ExpressionAttributeValues: {
          ':status': status,
          ':statusDate': `${status}#${date}`,
          ':now': now,
        },
      }));
    }

    // Audit log 기록 (fire-and-forget)
    if (prevStatus !== status) {
      createAuditLog({
        entityType: 'RESERVATION',
        entityId: reservationId,
        userId: existing.Item?.userId,
        storeId,
        action: 'STATUS_CHANGE',
        changes: {
          status: { before: prevStatus ?? null, after: status },
        },
        editedBy,
        reason,
      }).catch(() => {});

      // PENDING → BOOKED 전환 시 회원에게 예약 확정 알림 발송
      if (prevStatus === 'PENDING' && status === 'BOOKED' && uid) {
        createNotification({
          userId: uid,
          storeId,
          type: 'RESERVATION_CONFIRMED',
          data: { date, time },
        }).catch(() => {});
      }
    }

    res.json({ reservationId, status, updatedAt: now });
  } catch (e) {
    console.error('PATCH /reservations/:id error:', e);
    return sendError(res, 500, e.message || '예약 상태 변경에 실패했습니다.');
  }
});
