import 'dotenv/config';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import docClient from '../db/dynamodb.js';

const TABLE = 'gympt';
const STORE_ID = 'store_default';

const programs = [
  {
    title: '다이어트 PT',
    desc: '체지방 감소와 건강한 식습관을 함께 만들어가는 맞춤 프로그램',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
  },
  {
    title: '근력 증가',
    desc: '기초 근력부터 탄탄히, 안전하고 체계적인 웨이트 트레이닝',
    image: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=600&q=80',
  },
  {
    title: '체형 교정',
    desc: '거북목·라운드숄더·골반 불균형을 바로잡아 통증 없는 몸 만들기',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80',
  },
  {
    title: 'HIIT · 유산소',
    desc: '짧고 강렬한 인터벌 운동으로 심폐 능력과 체지방을 동시에 개선',
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&q=80',
  },
  {
    title: '재활 트레이닝',
    desc: '부상 후 회복 및 만성 통증 완화를 위한 전문 재활 운동',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&q=80',
  },
  {
    title: '바디프로필 준비',
    desc: '목표 날짜까지 몸매 완성, 체계적인 감량·증량 사이클 관리',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
  },
];

async function main() {
  // 기존 레코드 확인
  const existing = await docClient.send(new GetCommand({
    TableName: TABLE,
    Key: { PK: `STORE#${STORE_ID}`, SK: `STORE#${STORE_ID}` },
  }));

  if (!existing.Item) {
    console.error('스토어 레코드가 없습니다. 스토어 설정 페이지에서 먼저 저장해주세요.');
    process.exit(1);
  }

  await docClient.send(new UpdateCommand({
    TableName: TABLE,
    Key: { PK: `STORE#${STORE_ID}`, SK: `STORE#${STORE_ID}` },
    UpdateExpression: 'SET programs = :programs, updatedAt = :updatedAt',
    ExpressionAttributeValues: {
      ':programs': programs,
      ':updatedAt': new Date().toISOString(),
    },
  }));

  console.log(`✅ 프로그램 카드 ${programs.length}개 저장 완료`);
  programs.forEach((p, i) => console.log(`  ${i + 1}. ${p.title}`));
}

main().catch((e) => {
  console.error('오류:', e.message);
  process.exit(1);
});
