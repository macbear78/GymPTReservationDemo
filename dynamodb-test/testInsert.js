import { PutCommand } from '@aws-sdk/lib-dynamodb';
import docClient from './db.js';

const TABLE_NAME = 'reservations';

const item = {
  id: '1',
  name: '홍길동',
  trainer: 'Mike',
  date: '2026-03-20',
  time: '10:00',
};

async function testInsert() {
  try {
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item,
      })
    );
    console.log('저장 완료:', item);
  } catch (err) {
    console.error('저장 실패:', err.message);
    throw err;
  }
}

testInsert();
