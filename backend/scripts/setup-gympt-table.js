/**
 * gympt 단일 테이블 생성 스크립트
 * 실행: node scripts/setup-gympt-table.js
 */

// Node 16 polyfill
if (typeof globalThis.structuredClone === 'undefined') {
  globalThis.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

import { CreateTableCommand, DescribeTableCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-northeast-2',
});

const TABLE_NAME = 'gympt';

async function tableExists() {
  try {
    await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
    return true;
  } catch (e) {
    if (e.name === 'ResourceNotFoundException') return false;
    throw e;
  }
}

async function createTable() {
  const params = {
    TableName: TABLE_NAME,
    BillingMode: 'PAY_PER_REQUEST',

    AttributeDefinitions: [
      { AttributeName: 'PK',         AttributeType: 'S' },
      { AttributeName: 'SK',         AttributeType: 'S' },
      { AttributeName: 'phone',      AttributeType: 'S' },
      { AttributeName: 'storeId',    AttributeType: 'S' },
      { AttributeName: 'statusDate', AttributeType: 'S' },
      { AttributeName: 'notifType',  AttributeType: 'S' },
      { AttributeName: 'readStatus', AttributeType: 'S' },
    ],

    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' },
    ],

    GlobalSecondaryIndexes: [
      // GSI-1: 전화번호로 사용자 조회
      {
        IndexName: 'PhoneIndex',
        KeySchema: [
          { AttributeName: 'phone', KeyType: 'HASH' },
          { AttributeName: 'PK',    KeyType: 'RANGE' },
        ],
        Projection: { ProjectionType: 'ALL' },
      },
      // GSI-2: 스토어 + 상태·날짜로 예약 조회 (관리자 뷰)
      {
        IndexName: 'StatusIndex',
        KeySchema: [
          { AttributeName: 'storeId',    KeyType: 'HASH' },
          { AttributeName: 'statusDate', KeyType: 'RANGE' },
        ],
        Projection: { ProjectionType: 'ALL' },
      },
      // GSI-3: 알림 타입별 미읽음 배치 처리
      {
        IndexName: 'NotifTargetIndex',
        KeySchema: [
          { AttributeName: 'notifType',  KeyType: 'HASH' },
          { AttributeName: 'readStatus', KeyType: 'RANGE' },
        ],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
  };

  await client.send(new CreateTableCommand(params));
}

async function main() {
  if (await tableExists()) {
    console.log(`✓ 테이블 '${TABLE_NAME}' 이미 존재합니다.`);
    return;
  }
  console.log(`테이블 '${TABLE_NAME}' 생성 중...`);
  await createTable();
  console.log(`✓ 테이블 '${TABLE_NAME}' 생성 완료`);
  console.log('  - GSI: PhoneIndex, StatusIndex, NotifTargetIndex');
}

main().catch((e) => {
  console.error('테이블 생성 실패:', e.message);
  process.exit(1);
});
