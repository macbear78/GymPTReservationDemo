if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

import { Router }  from 'express';
import jwt         from 'jsonwebtoken';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { QueryCommand, PutCommand, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import docClient from '../../db/dynamodb.js';
import { createAuditLog } from './audit.js';

export const memberAuthRouter = Router({ mergeParams: true });

const TABLE       = 'gympt';
const scryptAsync = promisify(scrypt);

function getSecret() {
  return process.env.JWT_SECRET || 'gympt-jwt-secret-change-in-production';
}

function normalizePhone(p) {
  return String(p || '').replace(/[\s\-\.]/g, '').trim();
}

function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const buf  = await scryptAsync(password, salt, 64);
  return `${salt}:${buf.toString('hex')}`;
}

async function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const hashBuf = Buffer.from(hash, 'hex');
  const newBuf  = await scryptAsync(password, salt, 64);
  return timingSafeEqual(hashBuf, newBuf);
}

async function findUserByPhone(storeId, phone) {
  const result = await docClient.send(new QueryCommand({
    TableName: TABLE,
    IndexName: 'PhoneIndex',
    KeyConditionExpression: 'phone = :phone',
    FilterExpression: 'storeId = :storeId AND SK = :sk',
    ExpressionAttributeValues: {
      ':phone':   phone,
      ':storeId': storeId,
      ':sk':      'PROFILE',
    },
  }));
  return result.Items?.[0] || null;
}

/**
 * POST /api/v2/stores/:storeId/member/register
 * Body: { name, phone, password }
 */
memberAuthRouter.post('/register', async (req, res) => {
  try {
    const { storeId } = req.params;
    const { name, phone, password } = req.body;

    if (!name?.trim())     return sendError(res, 400, '이름을 입력해주세요.');
    if (!phone)            return sendError(res, 400, '전화번호를 입력해주세요.');
    if (!password)         return sendError(res, 400, '비밀번호를 입력해주세요.');
    if (password.length < 4) return sendError(res, 400, '비밀번호는 4자 이상이어야 합니다.');

    const normalized = normalizePhone(phone);
    if (normalized.length < 9) return sendError(res, 400, '올바른 전화번호를 입력해주세요.');

    const existing = await findUserByPhone(storeId, normalized);
    if (existing?.passwordHash) {
      return sendError(res, 409, '이미 가입된 전화번호입니다. 로그인해주세요.');
    }

    const pwHash  = await hashPassword(password);
    const now     = new Date().toISOString();

    if (existing) {
      // 기존 사용자(패스 없음)에 비밀번호 추가
      await docClient.send(new UpdateCommand({
        TableName: TABLE,
        Key: { PK: existing.PK, SK: 'PROFILE' },
        UpdateExpression: 'SET passwordHash = :hash, updatedAt = :now',
        ExpressionAttributeValues: { ':hash': pwHash, ':now': now },
      }));
      const token = jwt.sign(
        { role: 'member', userId: existing.userId, storeId, name: existing.name, phone: normalized },
        getSecret(), { expiresIn: '30d' }
      );
      return res.status(201).json({ token, userId: existing.userId, name: existing.name, phone: normalized });
    }

    // 신규 회원 생성
    const userId = randomUUID();
    const profile = {
      PK: `USER#${userId}`, SK: 'PROFILE',
      userId, storeId,
      name: name.trim(), phone: normalized,
      passwordHash: pwHash,
      createdAt: now, lastVisitAt: now,
    };
    const storeRef = {
      PK: `STORE#${storeId}`, SK: `USER#${userId}`,
      userId, storeId,
      name: name.trim(), phone: normalized,
      createdAt: now,
    };

    await Promise.all([
      docClient.send(new PutCommand({ TableName: TABLE, Item: profile })),
      docClient.send(new PutCommand({ TableName: TABLE, Item: storeRef })),
    ]);

    const token = jwt.sign(
      { role: 'member', userId, storeId, name: name.trim(), phone: normalized },
      getSecret(), { expiresIn: '30d' }
    );
    res.status(201).json({ token, userId, name: name.trim(), phone: normalized });
  } catch (e) {
    console.error('POST /member/register error:', e);
    return sendError(res, 500, e.message || '회원가입에 실패했습니다.');
  }
});

/**
 * POST /api/v2/stores/:storeId/member/login
 * Body: { phone, password }
 */
memberAuthRouter.post('/login', async (req, res) => {
  try {
    const { storeId } = req.params;
    const { phone, password } = req.body;

    if (!phone)    return sendError(res, 400, '전화번호를 입력해주세요.');
    if (!password) return sendError(res, 400, '비밀번호를 입력해주세요.');

    const normalized = normalizePhone(phone);
    const user = await findUserByPhone(storeId, normalized);

    if (!user) {
      return sendError(res, 401, '등록되지 않은 전화번호입니다.');
    }
    if (!user.passwordHash) {
      return sendError(res, 401, '비밀번호가 설정되지 않은 계정입니다. 회원가입을 진행해주세요.');
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return sendError(res, 401, '비밀번호가 올바르지 않습니다.');

    await docClient.send(new UpdateCommand({
      TableName: TABLE,
      Key: { PK: user.PK, SK: 'PROFILE' },
      UpdateExpression: 'SET lastVisitAt = :now',
      ExpressionAttributeValues: { ':now': new Date().toISOString() },
    }));

    const token = jwt.sign(
      { role: 'member', userId: user.userId, storeId, name: user.name, phone: normalized },
      getSecret(), { expiresIn: '30d' }
    );
    res.json({ token, userId: user.userId, name: user.name, phone: normalized });
  } catch (e) {
    console.error('POST /member/login error:', e);
    return sendError(res, 500, e.message || '로그인에 실패했습니다.');
  }
});

/**
 * GET /api/v2/stores/:storeId/member/me
 * Authorization: Bearer <memberToken>
 */
memberAuthRouter.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return sendError(res, 401, '인증이 필요합니다.');
  }
  try {
    const payload = jwt.verify(auth.slice(7), getSecret());
    if (payload.role !== 'member') return sendError(res, 403, '회원 토큰이 아닙니다.');
    res.json({ userId: payload.userId, name: payload.name, phone: payload.phone, storeId: payload.storeId });
  } catch {
    return sendError(res, 401, '유효하지 않은 토큰입니다.');
  }
});

/**
 * GET /api/v2/stores/:storeId/member/reservations
 * 본인 예약 목록 조회. Authorization: Bearer
 */
memberAuthRouter.get('/reservations', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return sendError(res, 401, '인증이 필요합니다.');
  let payload;
  try {
    payload = jwt.verify(auth.slice(7), getSecret());
    if (payload.role !== 'member') return sendError(res, 403, '회원 토큰이 아닙니다.');
  } catch {
    return sendError(res, 401, '유효하지 않은 토큰입니다.');
  }

  try {
    const { userId } = payload;
    const result = await docClient.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':prefix': 'RESERVATION#',
      },
    }));

    const reservations = (result.Items || [])
      .sort((a, b) => (b.datetime || '').localeCompare(a.datetime || ''))
      .map((r) => ({
        id: r.reservationId,
        reservationId: r.reservationId,
        date: r.date,
        time: r.time,
        status: r.status,
        trainerId: r.trainerId,
        ptType: r.ptType || '60min',
        pt_type: r.ptType || '60min',
        createdAt: r.createdAt,
      }));

    res.json({ reservations });
  } catch (e) {
    console.error('GET /member/reservations error:', e);
    return sendError(res, 500, e.message || '예약 조회에 실패했습니다.');
  }
});

/**
 * POST /api/v2/stores/:storeId/member/reservations/:reservationId/cancel
 * 본인 예약 취소 (v2 DynamoDB 예약만). Authorization: Bearer
 * Body: { date, time, trainerId? }
 */
memberAuthRouter.post('/reservations/:reservationId/cancel', async (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return sendError(res, 401, '인증이 필요합니다.');
  }
  let payload;
  try {
    payload = jwt.verify(auth.slice(7), getSecret());
    if (payload.role !== 'member') return sendError(res, 403, '회원 토큰이 아닙니다.');
  } catch {
    return sendError(res, 401, '유효하지 않은 토큰입니다.');
  }

  const { storeId, reservationId } = req.params;
  if (payload.storeId !== storeId) {
    return sendError(res, 403, '스토어가 일치하지 않습니다.');
  }

  const { date, time, trainerId } = req.body || {};
  if (!date || !time) {
    return sendError(res, 400, 'date, time은 필수입니다.');
  }
  const tid = trainerId || 'any';

  try {
    const existing = await docClient.send(new GetCommand({
      TableName: TABLE,
      Key: {
        PK: `STORE#${storeId}`,
        SK: `RESERVATION#${date}#${time}#${tid}`,
      },
    }));

    if (!existing.Item) {
      return sendError(res, 404, '예약을 찾을 수 없습니다.');
    }
    if (existing.Item.userId !== payload.userId) {
      return sendError(res, 403, '본인 예약만 취소할 수 있습니다.');
    }
    if (String(existing.Item.reservationId) !== String(reservationId)) {
      return sendError(res, 400, '예약 정보가 일치하지 않습니다.');
    }
    if (existing.Item.status !== 'BOOKED') {
      return sendError(res, 400, '취소할 수 있는 예약이 아닙니다.');
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    if (existing.Item.date < todayStr) {
      return sendError(res, 400, '이미 지난 예약은 취소할 수 없습니다.');
    }

    const status = 'CAD';
    const now = new Date().toISOString();
    const prevStatus = existing.Item.status;

    await docClient.send(new UpdateCommand({
      TableName: TABLE,
      Key: {
        PK: `STORE#${storeId}`,
        SK: `RESERVATION#${date}#${time}#${tid}`,
      },
      UpdateExpression: 'SET #st = :status, statusDate = :statusDate, updatedAt = :now',
      ExpressionAttributeNames: { '#st': 'status' },
      ExpressionAttributeValues: {
        ':status': status,
        ':statusDate': `${status}#${date}`,
        ':now': now,
      },
    }));

    const datetime = `${date}T${time}:00`;
    const userSk = `RESERVATION#${datetime}`;
    await docClient.send(new UpdateCommand({
      TableName: TABLE,
      Key: {
        PK: `USER#${payload.userId}`,
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

    if (prevStatus !== status) {
      createAuditLog({
        entityType: 'RESERVATION',
        entityId: reservationId,
        userId: payload.userId,
        storeId,
        action: 'STATUS_CHANGE',
        changes: {
          status: { before: prevStatus ?? null, after: status },
        },
        editedBy: 'member',
        reason: '회원 직접 취소',
      }).catch(() => {});
    }

    res.json({ reservationId, status, updatedAt: now });
  } catch (e) {
    console.error('POST /member/reservations/:id/cancel error:', e);
    return sendError(res, 500, e.message || '예약 취소에 실패했습니다.');
  }
});
