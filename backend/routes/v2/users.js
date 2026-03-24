if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

import { Router } from 'express';
import { QueryCommand, PutCommand, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import docClient from '../../db/dynamodb.js';
import { createAuditLog } from './audit.js';

export const usersV2Router = Router({ mergeParams: true });

const TABLE = 'gympt';

function normalizePhone(phone) {
  return String(phone || '').replace(/[\s\-\.]/g, '').trim();
}

function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

/**
 * POST /api/v2/stores/:storeId/users/lookup
 * 전화번호로 사용자 조회. 없으면 name 필드로 신규 생성.
 */
usersV2Router.post('/lookup', async (req, res) => {
  try {
    const { storeId } = req.params;
    const { phone, name } = req.body;

    if (!phone) return sendError(res, 400, '전화번호를 입력해주세요.');

    const normalized = normalizePhone(phone);
    if (normalized.length < 9) return sendError(res, 400, '올바른 전화번호를 입력해주세요.');

    // GSI-1(PhoneIndex)로 storeId 내 사용자 조회
    const found = await docClient.send(new QueryCommand({
      TableName: TABLE,
      IndexName: 'PhoneIndex',
      KeyConditionExpression: 'phone = :phone',
      FilterExpression: 'storeId = :storeId AND SK = :sk',
      ExpressionAttributeValues: {
        ':phone': normalized,
        ':storeId': storeId,
        ':sk': 'PROFILE',
      },
    }));

    if (found.Items && found.Items.length > 0) {
      const user = found.Items[0];

      // 마지막 조회 시간 업데이트
      await docClient.send(new UpdateCommand({
        TableName: TABLE,
        Key: { PK: user.PK, SK: 'PROFILE' },
        UpdateExpression: 'SET lastVisitAt = :now',
        ExpressionAttributeValues: { ':now': new Date().toISOString() },
      }));

      return res.json({ ...user, isNew: false });
    }

    // 신규 사용자 - name 필수
    if (!name || !name.trim()) {
      return res.status(404).json({ error: '등록되지 않은 번호입니다.', needsName: true });
    }

    const userId = randomUUID();
    const now = new Date().toISOString();

    const userRecord = {
      PK: `USER#${userId}`,
      SK: 'PROFILE',
      userId,
      storeId,
      name: name.trim(),
      phone: normalized,
      createdAt: now,
      lastVisitAt: now,
    };

    const storeUserRecord = {
      PK: `STORE#${storeId}`,
      SK: `USER#${userId}`,
      userId,
      name: name.trim(),
      phone: normalized,
      createdAt: now,
    };

    // 두 레코드 동시 저장
    await Promise.all([
      docClient.send(new PutCommand({ TableName: TABLE, Item: userRecord })),
      docClient.send(new PutCommand({ TableName: TABLE, Item: storeUserRecord })),
    ]);

    return res.status(201).json({ ...userRecord, isNew: true });
  } catch (e) {
    console.error('POST /users/lookup error:', e);
    return sendError(res, 500, e.message || '사용자 조회에 실패했습니다.');
  }
});

/**
 * GET /api/v2/stores/:storeId/members
 * 스토어 회원 목록 조회
 */
usersV2Router.get('/members', async (req, res) => {
  try {
    const { storeId } = req.params;

    const result = await docClient.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `STORE#${storeId}`,
        ':prefix': 'USER#',
      },
    }));

    const members = (result.Items || []).sort((a, b) =>
      (b.createdAt || '').localeCompare(a.createdAt || '')
    );

    res.json({ members });
  } catch (e) {
    console.error('GET /members error:', e);
    return sendError(res, 500, e.message || '회원 목록 조회에 실패했습니다.');
  }
});

/**
 * PATCH /api/v2/users/:userId/profile
 * 회원 기본정보 수정 (이름, 전화번호). 관리자 전용.
 * body: { name, phone, storeId, editedBy, reason }
 */
usersV2Router.patch('/:userId/profile', async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, storeId, editedBy, reason } = req.body;

    if (!name && !phone) {
      return sendError(res, 400, '수정할 항목(name 또는 phone)이 없습니다.');
    }

    // 기존 프로필 조회
    const existing = await docClient.send(new GetCommand({
      TableName: TABLE,
      Key: { PK: `USER#${userId}`, SK: 'PROFILE' },
    }));
    if (!existing.Item) return sendError(res, 404, '회원을 찾을 수 없습니다.');

    const prev = existing.Item;
    const now = new Date().toISOString();
    const normalizedPhone = phone ? normalizePhone(phone) : undefined;

    const updates = ['updatedAt = :now'];
    const values = { ':now': now };

    if (name && name.trim()) { updates.push('#nm = :name'); values[':name'] = name.trim(); }
    if (normalizedPhone) { updates.push('phone = :phone'); values[':phone'] = normalizedPhone; }

    const names = updates.some((u) => u.includes('#nm')) ? { '#nm': 'name' } : undefined;

    // USER#userId PROFILE 업데이트
    await docClient.send(new UpdateCommand({
      TableName: TABLE,
      Key: { PK: `USER#${userId}`, SK: 'PROFILE' },
      UpdateExpression: `SET ${updates.join(', ')}`,
      ...(names && { ExpressionAttributeNames: names }),
      ExpressionAttributeValues: values,
    }));

    // STORE#storeId USER#userId 업데이트 (storeId 있을 때)
    if (storeId) {
      const storeUpdates = ['updatedAt = :now'];
      if (name && name.trim()) storeUpdates.push('#nm = :name');
      if (normalizedPhone) storeUpdates.push('phone = :phone');

      await docClient.send(new UpdateCommand({
        TableName: TABLE,
        Key: { PK: `STORE#${storeId}`, SK: `USER#${userId}` },
        UpdateExpression: `SET ${storeUpdates.join(', ')}`,
        ...(names && { ExpressionAttributeNames: names }),
        ExpressionAttributeValues: values,
      })).catch(() => {}); // 스토어 레코드 없을 수 있으므로 실패 무시
    }

    // Audit log (fire-and-forget)
    const auditChanges = {};
    if (name && name.trim() && name.trim() !== prev.name) {
      auditChanges.name = { before: prev.name, after: name.trim() };
    }
    if (normalizedPhone && normalizedPhone !== prev.phone) {
      auditChanges.phone = { before: prev.phone, after: normalizedPhone };
    }
    if (Object.keys(auditChanges).length > 0) {
      createAuditLog({
        entityType: 'USER',
        entityId: userId,
        userId,
        storeId,
        action: 'UPDATE',
        changes: auditChanges,
        editedBy,
        reason,
      }).catch(() => {});
    }

    res.json({
      userId,
      name: name?.trim() ?? prev.name,
      phone: normalizedPhone ?? prev.phone,
      updatedAt: now,
    });
  } catch (e) {
    console.error('PATCH /users/:userId/profile error:', e);
    return sendError(res, 500, e.message || '회원 정보 수정에 실패했습니다.');
  }
});

/**
 * GET /api/v2/users/:userId/reservations
 * 사용자 예약 이력 조회
 * (v2Router에서 '/users/:userId/reservations'로 마운트되므로 여기서는 '/')
 */
usersV2Router.get('/', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const nextToken = req.query.nextToken
      ? JSON.parse(Buffer.from(req.query.nextToken, 'base64').toString())
      : undefined;

    const result = await docClient.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':prefix': 'RESERVATION#',
      },
      ScanIndexForward: false, // 최신순
      Limit: limit,
      ExclusiveStartKey: nextToken,
    }));

    const response = { reservations: result.Items || [] };
    if (result.LastEvaluatedKey) {
      response.nextToken = Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString('base64');
    }

    res.json(response);
  } catch (e) {
    console.error('GET /users/:userId/reservations error:', e);
    return sendError(res, 500, e.message || '예약 이력 조회에 실패했습니다.');
  }
});
