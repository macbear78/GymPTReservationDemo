if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

import { Router } from 'express';
import { QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import docClient from '../../db/dynamodb.js';
import { requireAdmin } from '../../middleware/authMiddleware.js';

export const statsV2Router = Router({ mergeParams: true });

const TABLE = 'gympt';
const TRAINERS_TABLE = process.env.TRAINERS_TABLE || 'trainers';

function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

/** 트레이너 id→name 맵 로드 */
async function loadTrainerMap() {
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

/**
 * GET /api/v2/stores/:storeId/stats?year=2026&month=3
 * 월별 통계 집계 (관리자 전용)
 */
statsV2Router.get('/', requireAdmin, async (req, res) => {
  try {
    const { storeId } = req.params;
    const now = new Date();
    const year  = parseInt(req.query.year)  || now.getFullYear();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const yyyymm = `${year}-${String(month).padStart(2, '0')}`;

    // ── 1. 해당 월 예약 전체 조회 ──────────────────────────────
    const reservationResult = await docClient.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `STORE#${storeId}`,
        ':prefix': `RESERVATION#${yyyymm}`,
      },
    }));
    const reservations = reservationResult.Items || [];

    // 상태 집계
    const statusCounts = { BOOKED: 0, COMPLETED: 0, CAD: 0, NO_SHOW: 0 };
    for (const r of reservations) {
      if (statusCounts[r.status] !== undefined) statusCounts[r.status]++;
    }
    const total = reservations.length;
    const completionRate    = total > 0 ? Math.round((statusCounts.COMPLETED / total) * 100) : 0;
    const cancellationRate  = total > 0 ? Math.round((statusCounts.CAD  / total) * 100) : 0;

    // ── 2. 시간대별 분포 ─────────────────────────────────────
    const timeMap = {};
    for (const r of reservations) {
      const t = r.time || '';
      if (!t) continue;
      timeMap[t] = (timeMap[t] || 0) + 1;
    }
    const timeSlotDist = Object.entries(timeMap)
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => a.time.localeCompare(b.time));

    // ── 3. 요일별 분포 ───────────────────────────────────────
    const DOW_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
    const dowMap = [0, 0, 0, 0, 0, 0, 0];
    for (const r of reservations) {
      if (!r.date) continue;
      const dow = new Date(r.date).getDay();
      dowMap[dow]++;
    }
    const dowDist = DOW_LABELS.map((label, i) => ({ dow: i, label, count: dowMap[i] }));

    // ── 4. 트레이너별 실적 ──────────────────────────────────
    const trainerMap = await loadTrainerMap();
    const trainerCountMap = {};
    for (const r of reservations) {
      const tid = r.trainerId || 'any';
      if (!trainerCountMap[tid]) {
        trainerCountMap[tid] = { total: 0, completed: 0, cancelled: 0, noShow: 0 };
      }
      trainerCountMap[tid].total++;
      if (r.status === 'COMPLETED') trainerCountMap[tid].completed++;
      if (r.status === 'CAD')       trainerCountMap[tid].cancelled++;
      if (r.status === 'NO_SHOW')   trainerCountMap[tid].noShow++;
    }
    const trainerStats = Object.entries(trainerCountMap)
      .map(([tid, counts]) => ({
        trainerId: tid,
        trainerName: tid === 'any' ? '담당 미지정' : (trainerMap[tid] || tid),
        ...counts,
        completionRate: counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0,
      }))
      .sort((a, b) => b.completed - a.completed);

    // ── 5. 해당 월 신규 회원 + 전체 회원 수 ──────────────────
    const memberResult = await docClient.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `STORE#${storeId}`,
        ':prefix': 'USER#',
      },
    }));
    const allMembers = memberResult.Items || [];
    const newThisMonth = allMembers.filter((m) =>
      (m.createdAt || '').startsWith(yyyymm)
    ).length;
    const totalMembers = allMembers.length;

    // ── 6. 패스 발급 수 (이번 달 가입 회원 기반) ──────────────
    let passesIssuedThisMonth = 0;
    let activePasses = 0;
    await Promise.all(
      allMembers.map(async (m) => {
        if (!m.userId) return;
        const passResult = await docClient.send(new QueryCommand({
          TableName: TABLE,
          KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
          ExpressionAttributeValues: {
            ':pk': `USER#${m.userId}`,
            ':prefix': 'PASS#',
          },
        }));
        for (const p of passResult.Items || []) {
          if ((p.createdAt || '').startsWith(yyyymm)) passesIssuedThisMonth++;
          if (p.status === 'ACTIVE') activePasses++;
        }
      })
    );

    // ── 7. 최근 6개월 월별 트렌드 (완료/취소/전체 분리) ────────
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d  = new Date(year, month - 1 - i, 1);
      const mm = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const r  = await docClient.send(new QueryCommand({
        TableName: TABLE,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
        ExpressionAttributeValues: {
          ':pk': `STORE#${storeId}`,
          ':prefix': `RESERVATION#${mm}`,
        },
      }));
      const items = r.Items || [];
      const mc = { BOOKED: 0, COMPLETED: 0, CAD: 0, NO_SHOW: 0 };
      for (const item of items) {
        if (mc[item.status] !== undefined) mc[item.status]++;
      }
      monthlyTrend.push({
        month: mm,
        total: items.length,
        completed: mc.COMPLETED,
        cancelled: mc.CAD,
        noShow: mc.NO_SHOW,
        booked: mc.BOOKED,
      });
    }

    res.json({
      period: yyyymm,
      reservations: {
        total,
        booked: statusCounts.BOOKED,
        completed: statusCounts.COMPLETED,
        cancelled: statusCounts.CAD,
        noShow: statusCounts.NO_SHOW,
        completionRate,
        cancellationRate,
      },
      members: { newThisMonth, total: totalMembers },
      passes: { issuedThisMonth: passesIssuedThisMonth, active: activePasses },
      monthlyTrend,
      trainerStats,
      timeSlotDist,
      dowDist,
    });
  } catch (e) {
    console.error('GET /stats error:', e);
    return sendError(res, 500, e.message || '통계 조회에 실패했습니다.');
  }
});
