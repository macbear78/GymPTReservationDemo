/**
 * 배치 알림 스케줄러
 *
 * 사용법:
 *   node scripts/send-scheduled-notifications.js [--dry-run] [--type=all|REMINDER|INACTIVITY|REPURCHASE]
 *
 * AWS Lambda Scheduled Event 또는 cron 으로 매일 오전 9시 실행 권장
 *
 * 처리 항목:
 *   1. SESSION_REMINDER  — 내일 예약된 BOOKED 건에 대해 알림 생성
 *   2. INACTIVITY_ALERT  — 마지막 방문 후 14일 이상 경과한 회원
 *   3. REPURCHASE_PROMO  — 패스 만료 7일 이내인 ACTIVE 패스 보유 회원
 */

if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

import { QueryCommand, ScanCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import docClient from '../db/dynamodb.js';

const TABLE = 'gympt';
const STORE_ID = 'store_default';
const DRY_RUN = process.argv.includes('--dry-run');
const TYPE_ARG = (process.argv.find((a) => a.startsWith('--type=')) || '--type=all').split('=')[1];

const today = new Date();
const todayStr = today.toISOString().slice(0, 10);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowStr = tomorrow.toISOString().slice(0, 10);
const inactivityCutoff = new Date(today);
inactivityCutoff.setDate(inactivityCutoff.getDate() - 14);
const inactivityCutoffStr = inactivityCutoff.toISOString();
const expiryWarningStr = new Date(today.setDate(today.getDate() + 7)).toISOString().slice(0, 10);

let created = 0;
let skipped = 0;

async function createNotif({ userId, storeId, type, data = {} }) {
  const TEMPLATES = {
    SESSION_REMINDER: (d) => `내일(${d.date}) ${d.time} PT 수업이 있습니다. 잊지 마세요!`,
    INACTIVITY_ALERT: (d) => `${d.name}님, 오랜만이에요. 다시 시작해볼까요?`,
    REPURCHASE_PROMO: (d) => `회원권이 ${d.expiryDate}에 만료됩니다. 지금 재구매하시면 특별 혜택을 드립니다!`,
  };

  const message = TEMPLATES[type] ? TEMPLATES[type](data) : '알림이 있습니다.';

  if (DRY_RUN) {
    console.log(`[DRY-RUN] ${type} → userId=${userId} | ${message}`);
    skipped++;
    return;
  }

  const notifId = randomUUID();
  const now = new Date().toISOString();

  await docClient.send(new PutCommand({
    TableName: TABLE,
    Item: {
      PK: `USER#${userId}`,
      SK: `NOTIF#${notifId}`,
      notifId,
      userId,
      storeId: storeId || STORE_ID,
      type,
      message,
      isRead: false,
      createdAt: now,
      notifType: type,
      readStatus: 'UNREAD',
    },
  }));
  created++;
  console.log(`[CREATED] ${type} → userId=${userId} | ${message}`);
}

// ─── 1. SESSION_REMINDER ────────────────────────────────────────────────────

async function sendSessionReminders() {
  console.log(`\n[SESSION_REMINDER] 내일(${tomorrowStr}) 예약 조회 중...`);

  const result = await docClient.send(new QueryCommand({
    TableName: TABLE,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
    FilterExpression: '#st = :status',
    ExpressionAttributeNames: { '#st': 'status' },
    ExpressionAttributeValues: {
      ':pk': `STORE#${STORE_ID}`,
      ':prefix': `RESERVATION#${tomorrowStr}#`,
      ':status': 'BOOKED',
    },
  }));

  const reservations = result.Items || [];
  console.log(`  → ${reservations.length}건 발견`);

  for (const r of reservations) {
    await createNotif({
      userId: r.userId,
      storeId: r.storeId,
      type: 'SESSION_REMINDER',
      data: { date: r.date, time: r.time },
    });
  }
}

// ─── 2. INACTIVITY_ALERT ────────────────────────────────────────────────────

async function sendInactivityAlerts() {
  console.log(`\n[INACTIVITY_ALERT] ${inactivityCutoffStr.slice(0, 10)} 이전 마지막 방문 회원 조회 중...`);

  const result = await docClient.send(new QueryCommand({
    TableName: TABLE,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
    FilterExpression: 'lastVisitAt <= :cutoff',
    ExpressionAttributeValues: {
      ':pk': `STORE#${STORE_ID}`,
      ':prefix': 'USER#',
      ':cutoff': inactivityCutoffStr,
    },
  }));

  const members = result.Items || [];
  console.log(`  → ${members.length}명 발견`);

  for (const m of members) {
    await createNotif({
      userId: m.userId,
      storeId: STORE_ID,
      type: 'INACTIVITY_ALERT',
      data: { name: m.name },
    });
  }
}

// ─── 3. REPURCHASE_PROMO ────────────────────────────────────────────────────

async function sendRepurchasePromos() {
  console.log(`\n[REPURCHASE_PROMO] 만료일 ${expiryWarningStr} 이하 활성 패스 조회 중...`);

  // 스토어 회원 목록 → 각 회원의 패스 조회
  const membersResult = await docClient.send(new QueryCommand({
    TableName: TABLE,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
    ExpressionAttributeValues: {
      ':pk': `STORE#${STORE_ID}`,
      ':prefix': 'USER#',
    },
  }));

  const members = membersResult.Items || [];
  let found = 0;

  for (const m of members) {
    const passResult = await docClient.send(new QueryCommand({
      TableName: TABLE,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
      FilterExpression: '#st = :active AND expiryDate BETWEEN :today AND :warning',
      ExpressionAttributeNames: { '#st': 'status' },
      ExpressionAttributeValues: {
        ':pk': `USER#${m.userId}`,
        ':prefix': 'PASS#',
        ':active': 'ACTIVE',
        ':today': todayStr,
        ':warning': expiryWarningStr,
      },
    }));

    for (const pass of (passResult.Items || [])) {
      found++;
      await createNotif({
        userId: m.userId,
        storeId: STORE_ID,
        type: 'REPURCHASE_PROMO',
        data: { expiryDate: pass.expiryDate },
      });
    }
  }

  console.log(`  → ${found}건 발견`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n=== 알림 스케줄러 실행 (${todayStr}) ${DRY_RUN ? '[DRY-RUN]' : ''} ===`);

  try {
    if (TYPE_ARG === 'all' || TYPE_ARG === 'REMINDER') await sendSessionReminders();
    if (TYPE_ARG === 'all' || TYPE_ARG === 'INACTIVITY') await sendInactivityAlerts();
    if (TYPE_ARG === 'all' || TYPE_ARG === 'REPURCHASE') await sendRepurchasePromos();
  } catch (e) {
    console.error('스케줄러 오류:', e);
    process.exit(1);
  }

  console.log(`\n=== 완료: 생성 ${created}건, 스킵(dry-run) ${skipped}건 ===\n`);
}

main();
