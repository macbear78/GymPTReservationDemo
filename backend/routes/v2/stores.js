if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

import { Router } from 'express';
import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import docClient from '../../db/dynamodb.js';
import { requireAdmin } from '../../middleware/authMiddleware.js';

export const storesV2Router = Router({ mergeParams: true });

const TABLE = 'gympt';
const DEFAULT_TIME_SLOTS = ['06:00', '07:00', '08:00', '09:00', '18:00', '19:00', '20:00'];

function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

/**
 * GET /api/v2/stores/:storeId
 * 스토어 정보 조회
 */
storesV2Router.get('/', async (req, res) => {
  try {
    const { storeId } = req.params;

    const result = await docClient.send(new GetCommand({
      TableName: TABLE,
      Key: { PK: `STORE#${storeId}`, SK: `STORE#${storeId}` },
    }));

    if (!result.Item) {
      // 기본 스토어 정보 반환 (레코드 없을 시)
      return res.json({
        storeId,
        name: 'PT 스튜디오',
        phone: '',
        address: '',
        timeSlots: DEFAULT_TIME_SLOTS,
        createdAt: new Date().toISOString(),
      });
    }

    res.json(result.Item);
  } catch (e) {
    console.error('GET /stores/:storeId error:', e);
    return sendError(res, 500, e.message || '스토어 조회에 실패했습니다.');
  }
});

/**
 * PUT /api/v2/stores/:storeId
 * 스토어 정보 저장/수정 (관리자 전용)
 */
storesV2Router.put('/', requireAdmin, async (req, res) => {
  try {
    const { storeId } = req.params;
    const { name, phone, address, timeSlots, description, programs, hero, aboutSections, logo } = req.body;

    if (!name || !name.trim()) {
      return sendError(res, 400, '스토어 이름은 필수입니다.');
    }

    const now = new Date().toISOString();

    // 기존 레코드 조회 (createdAt 보존)
    const existing = await docClient.send(new GetCommand({
      TableName: TABLE,
      Key: { PK: `STORE#${storeId}`, SK: `STORE#${storeId}` },
    }));

    // 프로그램 카드 유효성 검사 (최대 6개)
    const validPrograms = Array.isArray(programs)
      ? programs.slice(0, 6).map((p) => ({
          title: String(p.title || '').trim(),
          desc:  String(p.desc  || '').trim(),
          image: String(p.image || '').trim(),
        })).filter((p) => p.title)
      : [];

    const record = {
      PK: `STORE#${storeId}`,
      SK: `STORE#${storeId}`,
      storeId,
      name: name.trim(),
      phone: phone || '',
      address: address || '',
      timeSlots: Array.isArray(timeSlots) && timeSlots.length > 0 ? timeSlots : DEFAULT_TIME_SLOTS,
      ...(description && { description }),
      programs: validPrograms,
      logo: logo && typeof logo === 'object' ? {
        image: String(logo.image || '').trim(),
        text:  String(logo.text  || '').trim(),
      } : (existing.Item?.logo || {}),
      hero: hero && typeof hero === 'object' ? {
        image:    String(hero.image    || '').trim(),
        title:    String(hero.title    || '').trim(),
        subtitle: String(hero.subtitle || '').trim(),
      } : (existing.Item?.hero || {}),
      aboutSections: Array.isArray(aboutSections)
        ? aboutSections.slice(0, 2).map((s) => ({
            image: String(s.image || '').trim(),
            title: String(s.title || '').trim(),
            body:  String(s.body  || '').trim(),
          }))
        : (existing.Item?.aboutSections || []),
      createdAt: existing.Item?.createdAt || now,
      updatedAt: now,
    };

    await docClient.send(new PutCommand({ TableName: TABLE, Item: record }));

    res.json(record);
  } catch (e) {
    console.error('PUT /stores/:storeId error:', e);
    return sendError(res, 500, e.message || '스토어 저장에 실패했습니다.');
  }
});
