if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

import { Router } from 'express';
import { QueryCommand, PutCommand, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import docClient from '../../db/dynamodb.js';
import { createNotification } from './notifications.js';
import { createAuditLog } from './audit.js';

export const passesV2Router = Router({ mergeParams: true });

const TABLE = 'gympt';

function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

function resolveStatus(pass) {
  if (pass.remainingSessions <= 0) return 'EXHAUSTED';
  if (pass.expiryDate < new Date().toISOString().slice(0, 10)) return 'EXPIRED';
  return 'ACTIVE';
}

/**
 * POST /api/v2/stores/:storeId/users/:userId/passes
 * 패스 발급
 */
passesV2Router.post('/', async (req, res) => {
  try {
    const { storeId, userId } = req.params;
    const { totalSessions, expiryDate, memo } = req.body;

    if (!totalSessions || totalSessions < 1) {
      return sendError(res, 400, 'totalSessions는 1 이상이어야 합니다.');
    }
    if (!expiryDate || !/^\d{4}-\d{2}-\d{2}$/.test(expiryDate)) {
      return sendError(res, 400, 'expiryDate는 YYYY-MM-DD 형식이어야 합니다.');
    }

    const passId = randomUUID();
    const now = new Date().toISOString();

    const pass = {
      PK: `USER#${userId}`,
      SK: `PASS#${passId}`,
      passId,
      userId,
      storeId,
      totalSessions: Number(totalSessions),
      remainingSessions: Number(totalSessions),
      expiryDate,
      status: 'ACTIVE',
      ...(memo && { memo }),
      createdAt: now,
      updatedAt: now,
    };

    await docClient.send(new PutCommand({ TableName: TABLE, Item: pass }));

    res.status(201).json(pass);
  } catch (e) {
    console.error('POST /passes error:', e);
    return sendError(res, 500, e.message || '패스 발급에 실패했습니다.');
  }
});

/**
 * GET /api/v2/users/:userId/passes?status=ACTIVE
 * 사용자 패스 목록 조회
 */
passesV2Router.get('/', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    const result = await docClient.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':prefix': 'PASS#',
      },
    }));

    let passes = (result.Items || []).map((p) => ({ ...p, status: resolveStatus(p) }));
    if (status) passes = passes.filter((p) => p.status === status);

    passes.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));

    res.json({ passes });
  } catch (e) {
    console.error('GET /passes error:', e);
    return sendError(res, 500, e.message || '패스 조회에 실패했습니다.');
  }
});

/**
 * PATCH /api/v2/users/:userId/passes/:passId
 * 세션 수동 차감 또는 패스 수정
 * body: { action: 'DEDUCT', amount: 1 }  또는  { expiryDate, memo }
 */
passesV2Router.patch('/:passId', async (req, res) => {
  try {
    const { userId, passId } = req.params;
    const { action, amount, expiryDate, memo, remainingSessions: directRemaining } = req.body;

    // 현재 패스 조회
    const found = await docClient.send(new GetCommand({
      TableName: TABLE,
      Key: { PK: `USER#${userId}`, SK: `PASS#${passId}` },
    }));
    if (!found.Item) return sendError(res, 404, '패스를 찾을 수 없습니다.');

    const pass = found.Item;
    const now = new Date().toISOString();

    const { editedBy, reason } = req.body;

    if (action === 'DEDUCT') {
      const deductAmount = Number(amount) || 1;
      if (pass.remainingSessions < deductAmount) {
        return sendError(res, 409, '잔여 세션이 부족합니다.');
      }

      const newRemaining = pass.remainingSessions - deductAmount;
      const newStatus = resolveStatus({ ...pass, remainingSessions: newRemaining });

      await docClient.send(new UpdateCommand({
        TableName: TABLE,
        Key: { PK: `USER#${userId}`, SK: `PASS#${passId}` },
        UpdateExpression: 'SET remainingSessions = :r, #st = :status, updatedAt = :now',
        ConditionExpression: 'remainingSessions >= :amount',
        ExpressionAttributeNames: { '#st': 'status' },
        ExpressionAttributeValues: {
          ':r': newRemaining,
          ':status': newStatus,
          ':now': now,
          ':amount': deductAmount,
        },
      }));

      // Audit log 기록 (fire-and-forget)
      createAuditLog({
        entityType: 'PASS',
        entityId: passId,
        userId,
        storeId: pass.storeId,
        action: 'DEDUCT',
        changes: {
          remainingSessions: { before: pass.remainingSessions, after: newRemaining },
          ...(newStatus !== pass.status && { status: { before: pass.status, after: newStatus } }),
        },
        editedBy,
        reason,
      }).catch(() => {});

      // 자동 알림 (fire-and-forget)
      if (newRemaining === 0) {
        createNotification({ userId, storeId: pass.storeId, type: 'REPURCHASE_PROMO', data: {} }).catch(() => {});
      } else if (newRemaining <= 2) {
        createNotification({ userId, storeId: pass.storeId, type: 'LOW_SESSIONS', data: { remaining: newRemaining } }).catch(() => {});
      }

      return res.json({ ...pass, remainingSessions: newRemaining, status: newStatus, updatedAt: now });
    }

    // 일반 수정 (만료일, 메모, 잔여 세션 직접 설정)
    const updates = [];
    const names = {};
    const values = { ':now': now };

    if (expiryDate) { updates.push('expiryDate = :exp'); values[':exp'] = expiryDate; }
    if (memo !== undefined) { updates.push('memo = :memo'); values[':memo'] = memo; }

    // 잔여 세션 직접 설정 (관리자 수동 조정 - 증가 허용)
    if (directRemaining !== undefined) {
      const newR = Number(directRemaining);
      if (newR < 0 || newR > pass.totalSessions) {
        return sendError(res, 400, `잔여 세션은 0~${pass.totalSessions} 사이여야 합니다.`);
      }
      const newSt = resolveStatus({ ...pass, remainingSessions: newR });
      updates.push('remainingSessions = :r');
      updates.push('#st = :status');
      values[':r'] = newR;
      values[':status'] = newSt;
      names['#st'] = 'status';
    }

    updates.push('updatedAt = :now');

    await docClient.send(new UpdateCommand({
      TableName: TABLE,
      Key: { PK: `USER#${userId}`, SK: `PASS#${passId}` },
      UpdateExpression: `SET ${updates.join(', ')}`,
      ExpressionAttributeNames: Object.keys(names).length ? names : undefined,
      ExpressionAttributeValues: values,
    }));

    // Audit log 기록 (fire-and-forget)
    const auditChanges = {};
    if (expiryDate && expiryDate !== pass.expiryDate) {
      auditChanges.expiryDate = { before: pass.expiryDate, after: expiryDate };
    }
    if (memo !== undefined && memo !== pass.memo) {
      auditChanges.memo = { before: pass.memo ?? null, after: memo };
    }
    if (directRemaining !== undefined && Number(directRemaining) !== pass.remainingSessions) {
      auditChanges.remainingSessions = { before: pass.remainingSessions, after: Number(directRemaining) };
    }
    if (Object.keys(auditChanges).length > 0) {
      createAuditLog({
        entityType: 'PASS',
        entityId: passId,
        userId,
        storeId: pass.storeId,
        action: 'UPDATE',
        changes: auditChanges,
        editedBy,
        reason,
      }).catch(() => {});
    }

    const updated = { ...pass, ...(expiryDate && { expiryDate }), ...(memo !== undefined && { memo }), updatedAt: now };
    return res.json({ ...updated, status: resolveStatus(updated) });
  } catch (e) {
    if (e.name === 'ConditionalCheckFailedException') {
      return sendError(res, 409, '잔여 세션이 부족합니다.');
    }
    console.error('PATCH /passes/:id error:', e);
    return sendError(res, 500, e.message || '패스 수정에 실패했습니다.');
  }
});
