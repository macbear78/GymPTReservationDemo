import 'dotenv/config';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import docClient from '../db/dynamodb.js';

const TABLE    = 'gympt';
const STORE_ID = 'store_default';

const hero = {
  image:    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=85',
  title:    '지금 시작하세요',
  subtitle: '당신의 몸을 바꿀 시간입니다',
};

const aboutSections = [
  {
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=85',
    title: '당신만의 변화가 시작되는 곳',
    body:  '프리미엄 환경에서 1:1 맞춤 트레이닝을 경험하세요. 전문 트레이너가 목표에 맞는 프로그램을 설계하고, 안전하고 지속 가능한 변화를 이끌어 드립니다.',
  },
  {
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=85',
    title: '목표에 맞춘 PT 루틴',
    body:  '체중 감량, 근력 향상, 자세 교정까지 회원님의 목표를 기준으로 세션을 구성합니다. 운동 강도와 진행 속도를 매 수업마다 조정해 무리 없이 꾸준히 이어갈 수 있습니다.',
  },
];

async function main() {
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
    UpdateExpression: 'SET hero = :hero, aboutSections = :aboutSections, updatedAt = :updatedAt',
    ExpressionAttributeValues: {
      ':hero':          hero,
      ':aboutSections': aboutSections,
      ':updatedAt':     new Date().toISOString(),
    },
  }));

  console.log('✅ 히어로 섹션 저장 완료');
  console.log(`   title: ${hero.title}`);
  console.log(`   subtitle: ${hero.subtitle}`);
  console.log('\n✅ 소개 섹션 2개 저장 완료');
  aboutSections.forEach((s, i) => console.log(`  ${i + 1}. ${s.title}`));
}

main().catch((e) => {
  console.error('오류:', e.message);
  process.exit(1);
});
