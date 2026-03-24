/**
 * v1 → v2 데이터 마이그레이션 스크립트
 * 기존 reservations 테이블 → gympt 단일 테이블
 *
 * 실행: node scripts/migrate-to-v2.js
 * 옵션: --dry-run  (실제 저장 없이 변환 결과만 출력)
 */
import { ScanCommand, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import docClient from '../db/dynamodb.js';

const SOURCE_TABLE = 'reservations';
const TARGET_TABLE = 'gympt';
const DEFAULT_STORE_ID = 'store_default';
const DRY_RUN = process.argv.includes('--dry-run');

// v1 상태값 → v2 상태값 매핑
const STATUS_MAP = {
  'Confirmed': 'BOOKED',
  'Completed': 'COMPLETED',
  'Cancelled': 'CAD',
  'No-show':   'NO_SHOW',
};

function normalizePhone(phone) {
  return String(phone || '').replace(/[\s\-\.]/g, '').trim();
}

// 전화번호로 기존에 생성된 userId 찾기 (중복 생성 방지)
const phoneToUserId = new Map();

async function getOrCreateUser(name, phone) {
  const normalized = normalizePhone(phone);
  if (phoneToUserId.has(normalized)) {
    return phoneToUserId.get(normalized);
  }

  // gympt 테이블에 이미 있는지 확인
  const found = await docClient.send(new QueryCommand({
    TableName: TARGET_TABLE,
    IndexName: 'PhoneIndex',
    KeyConditionExpression: 'phone = :phone',
    FilterExpression: 'SK = :sk',
    ExpressionAttributeValues: { ':phone': normalized, ':sk': 'PROFILE' },
  }));

  if (found.Items && found.Items.length > 0) {
    const userId = found.Items[0].userId;
    phoneToUserId.set(normalized, userId);
    return userId;
  }

  // 신규 생성
  const userId = randomUUID();
  const now = new Date().toISOString();

  if (!DRY_RUN) {
    await Promise.all([
      docClient.send(new PutCommand({
        TableName: TARGET_TABLE,
        Item: {
          PK: `USER#${userId}`, SK: 'PROFILE',
          userId, storeId: DEFAULT_STORE_ID,
          name: name || '이름 없음',
          phone: normalized,
          createdAt: now, lastVisitAt: now,
        },
      })),
      docClient.send(new PutCommand({
        TableName: TARGET_TABLE,
        Item: {
          PK: `STORE#${DEFAULT_STORE_ID}`, SK: `USER#${userId}`,
          userId, name: name || '이름 없음', phone: normalized, createdAt: now,
        },
      })),
    ]);
  }

  phoneToUserId.set(normalized, userId);
  return userId;
}

async function scanAll() {
  const items = [];
  let lastKey;
  do {
    const result = await docClient.send(new ScanCommand({
      TableName: SOURCE_TABLE,
      ExclusiveStartKey: lastKey,
    }));
    items.push(...(result.Items || []));
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);
  return items;
}

async function migrate() {
  console.log(`[마이그레이션 시작] ${DRY_RUN ? '(DRY RUN — 저장 안 함)' : ''}`);
  console.log(`  소스: ${SOURCE_TABLE} → 대상: ${TARGET_TABLE}\n`);

  const items = await scanAll();
  console.log(`  총 ${items.length}건 조회\n`);

  let success = 0, skip = 0, fail = 0;

  for (const item of items) {
    try {
      const status = STATUS_MAP[item.status] || 'BOOKED';
      const date = item.date || '';
      const time = item.time || '';
      const datetime = `${date}T${time}:00`;
      const trainerId = item.trainer ? item.trainer.toLowerCase().replace(/\s/g, '_') : null;
      const now = item.created_at || new Date().toISOString();

      const userId = await getOrCreateUser(item.name, item.phone);

      const storeRecord = {
        PK: `STORE#${DEFAULT_STORE_ID}`,
        SK: `RESERVATION#${date}#${time}#${trainerId || 'any'}`,
        reservationId: item.id,
        storeId: DEFAULT_STORE_ID,
        userId,
        datetime, date, time,
        status,
        statusDate: `${status}#${date}`,
        ...(trainerId && { trainerId }),
        ...(item.pt_type && { ptType: item.pt_type }),
        createdAt: now, updatedAt: now,
      };

      const userRecord = {
        PK: `USER#${userId}`,
        SK: `RESERVATION#${datetime}`,
        reservationId: item.id,
        storeId: DEFAULT_STORE_ID,
        datetime, date, time, status,
        ...(trainerId && { trainerId }),
        ...(item.pt_type && { ptType: item.pt_type }),
        createdAt: now, updatedAt: now,
      };

      if (DRY_RUN) {
        console.log(`  [DRY] ${item.id} → userId:${userId}, status:${status}, datetime:${datetime}`);
      } else {
        await Promise.all([
          docClient.send(new PutCommand({ TableName: TARGET_TABLE, Item: storeRecord })),
          docClient.send(new PutCommand({ TableName: TARGET_TABLE, Item: userRecord })),
        ]);
        console.log(`  ✓ ${item.id} (${item.name} / ${status} / ${datetime})`);
      }
      success++;
    } catch (e) {
      console.error(`  ✗ ${item.id}: ${e.message}`);
      fail++;
    }
  }

  console.log(`\n[완료] 성공: ${success} / 건너뜀: ${skip} / 실패: ${fail}`);
  console.log(`  생성된 사용자: ${phoneToUserId.size}명`);
}

migrate().catch((e) => {
  console.error('마이그레이션 오류:', e.message);
  process.exit(1);
});
