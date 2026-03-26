import 'dotenv/config';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import docClient from '../db/dynamodb.js';

const TABLE = process.env.TRAINERS_TABLE || 'trainers';

const updates = {
  james: {
    specialty: 'Group & Team Training',
    specialtyKey: 'group',
    intro: '소그룹·커플·팀 PT 전문. 함께 운동하는 즐거움으로 꾸준함을 만듭니다.',
    introLong: '소그룹 및 팀 트레이닝 전문입니다. 12년간 복합 운동의 안전한 자세 지도 경험을 바탕으로 2~4인 그룹 PT를 운영해왔으며, 팀원 간 경쟁과 응원을 통해 혼자보다 더 높은 출석률과 성과를 만들어냅니다.',
    trainingAreas: ['그룹 PT', '팀 트레이닝', '복합 운동', '동기 부여 코칭'],
    programs: ['그룹 PT 프로그램', '커플·친구 PT', '소그룹 근력 트레이닝'],
  },
  lisa: {
    specialty: 'Body Profile & Shaping',
    specialtyKey: 'body',
    intro: '여성 바디프로필·바디 셰이핑 전문. 체형 완성과 촬영 컨디셔닝을 함께 설계합니다.',
    introLong: '여성 바디프로필과 바디 셰이핑에 특화되어 있습니다. 9년간 여성 회원의 체질·호르몬 주기를 고려한 감량·체형 교정 프로그램으로 바디프로필 촬영 성공 사례를 다수 보유하고 있습니다. 드라이아웃과 피크 컨디셔닝까지 전 과정을 밀착 관리합니다.',
    trainingAreas: ['바디프로필', '바디 셰이핑', '호르몬 밸런스', '피크 컨디셔닝'],
    programs: ['바디프로필 D-12주 집중', '바디 셰이핑 프로그램', '호르몬 밸런스 코칭'],
  },
  minji: {
    specialty: 'Group & Beginner Training',
    specialtyKey: 'group',
    intro: '소그룹 PT와 초보자 맞춤. 부담 없이 즐겁게 시작하는 분위기를 만듭니다.',
    introLong: '소그룹 PT와 초보자 맞춤 트레이닝을 전담합니다. 3년간 운동을 처음 시작하는 회원들이 그룹 안에서 편안하게 적응할 수 있도록 도왔으며, 밝고 긍정적인 분위기로 커플·친구·직장 동료 그룹에서 높은 만족도를 얻고 있습니다.',
    trainingAreas: ['그룹 PT', '초보자 트레이닝', '유산소', '동기 부여'],
    programs: ['그룹 PT 프로그램', '커플·친구 PT', '4주 입문 스타트'],
  },
  tom: {
    specialty: 'Body Profile & Competition',
    specialtyKey: 'body',
    intro: '바디프로필·피트니스 대회 준비 전문 코치. 감량부터 피크 컨디셔닝까지 설계합니다.',
    introLong: '바디프로필과 피트니스 대회 준비 전문 코치입니다. 15년간 아마추어부터 프로까지 다양한 촬영·대회 준비를 지도해왔으며, 체지방 감량·근비대·드라이아웃·피크 컨디셔닝까지 전 과정을 한 번에 설계합니다.',
    trainingAreas: ['바디프로필', '대회 준비', '근비대·커팅', '피크 컨디셔닝'],
    programs: ['바디프로필 D-12주 집중', '대회 준비 프로그램', '커팅·드라이아웃'],
  },
};

let success = 0;
let fail = 0;

for (const [id, fields] of Object.entries(updates)) {
  try {
    await docClient.send(new UpdateCommand({
      TableName: TABLE,
      Key: { id },
      UpdateExpression: 'SET specialty = :specialty, specialtyKey = :specialtyKey, intro = :intro, introLong = :introLong, trainingAreas = :trainingAreas, programs = :programs',
      ExpressionAttributeValues: {
        ':specialty': fields.specialty,
        ':specialtyKey': fields.specialtyKey,
        ':intro': fields.intro,
        ':introLong': fields.introLong,
        ':trainingAreas': fields.trainingAreas,
        ':programs': fields.programs,
      },
    }));
    console.log(`✓ ${id} → specialtyKey: ${fields.specialtyKey}`);
    success++;
  } catch (e) {
    console.error(`✗ ${id}: ${e.message}`);
    fail++;
  }
}

console.log(`\n완료: 성공 ${success}명 / 실패 ${fail}명`);
