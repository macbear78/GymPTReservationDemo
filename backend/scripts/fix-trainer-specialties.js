import 'dotenv/config';
import { UpdateCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import docClient from '../db/dynamodb.js';

const TABLE = process.env.TRAINERS_TABLE || 'trainers';

// ── 1. 한국어 트레이너 6명에 specialtyKey 추가 ──────────────────────────
const koreanUpdates = {
  junho:  { specialtyKey: 'diet' },    // 크로스핏·HIIT → 유산소 다이어트
  kevin:  { specialtyKey: 'strength' }, // 기능성 트레이닝
  kim:    { specialtyKey: 'strength' }, // 근력 트레이닝
  jisoo:  { specialtyKey: 'rehab' },   // 필라테스·유연성
  soyeon: { specialtyKey: 'rehab' },   // 자세 교정
  yuna:   { specialtyKey: 'group' },   // 시니어·저강도 → 그룹 PT 적합
};

// ── 2. 껍데기 4개 삭제 후 완전한 데이터로 재생성 ───────────────────────
const skeletonReplacements = [
  {
    id: 'minji',
    name: '이민지',
    specialty: '다이어트 & 유산소',
    specialtyKey: 'diet',
    experience: '3년 경력',
    experienceYears: 3,
    rating: 4.5,
    reviewCount: 41,
    intro: '건강한 식습관과 유산소 다이어트 전문. 부담 없이 즐겁게 시작할 수 있습니다.',
    introLong: '건강한 식습관과 유산소를 결합한 다이어트를 지도합니다. 3년간 처음 운동을 시작하는 분들의 첫 다이어트 성공을 도왔으며, 무리하지 않는 습관 형성에 집중합니다.',
    trainingAreas: ['다이어트', '유산소 트레이닝', '식습관 개선', '체중 조절'],
    certifications: ['ACE Personal Trainer', '다이어트 코칭 수료'],
    programs: ['다이어트 집중 프로그램', '4주 스타트 프로그램', '유산소·근력 밸런스'],
    pricePerHour: 45000,
  },
  {
    id: 'lisa',
    name: '박소연',
    specialty: '바디프로필 & 셰이핑',
    specialtyKey: 'body',
    experience: '9년 경력',
    experienceYears: 9,
    rating: 4.9,
    reviewCount: 178,
    intro: '여성 바디프로필·바디 셰이핑 전문. 체형 완성과 촬영 컨디셔닝을 함께 설계합니다.',
    introLong: '여성 바디프로필과 바디 셰이핑에 특화되어 있습니다. 9년간 여성 회원의 체질·호르몬 주기를 고려한 감량·체형 교정 프로그램으로 바디프로필 촬영 성공 사례를 다수 보유하고 있습니다.',
    trainingAreas: ['바디프로필', '바디 셰이핑', '호르몬 밸런스', '피크 컨디셔닝'],
    certifications: ['스포츠영양사', 'NASM WLS', '여성 건강 트레이닝 전문가'],
    programs: ['바디프로필 D-12주 집중', '바디 셰이핑 프로그램', '호르몬 밸런스 코칭'],
    pricePerHour: 62000,
  },
  {
    id: 'tom',
    name: '최상훈',
    specialty: '바디프로필 & 대회 준비',
    specialtyKey: 'body',
    experience: '15년 경력',
    experienceYears: 15,
    rating: 5.0,
    reviewCount: 287,
    intro: '바디프로필·피트니스 대회 준비 전문 코치. 감량부터 피크 컨디셔닝까지 설계합니다.',
    introLong: '바디프로필과 피트니스 대회 준비 전문 코치입니다. 15년간 아마추어부터 프로까지 다양한 촬영·대회 준비를 지도해왔으며, 체지방 감량·근비대·드라이아웃·피크 컨디셔닝까지 전 과정을 한 번에 설계합니다.',
    trainingAreas: ['바디프로필', '대회 준비', '근비대·커팅', '피크 컨디셔닝'],
    certifications: ['IFBB Pro', 'NSCA-CSCS', '스포츠영양사'],
    programs: ['바디프로필 D-12주 집중', '대회 준비 프로그램', '커팅·드라이아웃'],
    pricePerHour: 75000,
  },
  {
    id: 'james',
    name: '이준혁',
    specialty: '그룹 & 팀 트레이닝',
    specialtyKey: 'group',
    experience: '12년 경력',
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 203,
    intro: '소그룹·커플·팀 PT 전문. 함께 운동하는 즐거움으로 꾸준함을 만듭니다.',
    introLong: '소그룹 및 팀 트레이닝 전문입니다. 12년간 복합 운동 지도 경험을 바탕으로 2~4인 그룹 PT를 운영해왔으며, 팀원 간 경쟁과 응원을 통해 혼자보다 더 높은 출석률과 성과를 만들어냅니다.',
    trainingAreas: ['그룹 PT', '팀 트레이닝', '복합 운동', '동기 부여 코칭'],
    certifications: ['NSCA-CSCS', 'NASM CPT', '그룹 피트니스 지도자'],
    programs: ['그룹 PT 프로그램', '커플·친구 PT', '소그룹 근력 트레이닝'],
    pricePerHour: 65000,
  },
];

let success = 0;
let fail = 0;

// Step 1: 한국어 트레이너 specialtyKey 업데이트
console.log('── Step 1: 한국어 트레이너 specialtyKey 추가 ──');
for (const [id, { specialtyKey }] of Object.entries(koreanUpdates)) {
  try {
    await docClient.send(new UpdateCommand({
      TableName: TABLE,
      Key: { id },
      UpdateExpression: 'SET specialtyKey = :sk',
      ExpressionAttributeValues: { ':sk': specialtyKey },
    }));
    console.log(`✓ ${id} → ${specialtyKey}`);
    success++;
  } catch (e) {
    console.error(`✗ ${id}: ${e.message}`);
    fail++;
  }
}

// Step 2: 껍데기 삭제 후 완전한 데이터로 재생성
console.log('\n── Step 2: 껍데기 트레이너 재생성 ──');
for (const trainer of skeletonReplacements) {
  try {
    await docClient.send(new DeleteCommand({
      TableName: TABLE,
      Key: { id: trainer.id },
    }));
    await docClient.send(new PutCommand({
      TableName: TABLE,
      Item: trainer,
    }));
    console.log(`✓ ${trainer.id} → ${trainer.name} (${trainer.specialtyKey})`);
    success++;
  } catch (e) {
    console.error(`✗ ${trainer.id}: ${e.message}`);
    fail++;
  }
}

console.log(`\n완료: 성공 ${success} / 실패 ${fail}`);
console.log('\n최종 배치:');
console.log('  diet     : 최준호, 이민지');
console.log('  strength : 박준혁, 김태훈');
console.log('  rehab    : 김지수, 이소연');
console.log('  body     : 박소연, 최상훈');
console.log('  group    : 이준혁, 정유나');
