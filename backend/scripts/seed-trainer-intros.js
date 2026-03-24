import 'dotenv/config';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import docClient from '../db/dynamodb.js';

const TABLE = process.env.TRAINERS_TABLE || 'trainers';

const intros = {
  jisoo: {
    intro: '필라테스와 유연성 트레이닝 전문. 코어 강화와 체형 균형을 함께 잡아드립니다.',
    introLong: '필라테스와 유연성 트레이닝을 전문으로 합니다. 6년간 코어 근육 강화, 척추 건강, 전신 유연성 향상 프로그램을 운영하며 다양한 회원들의 자세와 체형 균형을 개선해왔습니다. 몸이 뻣뻣하거나 자세가 나쁘다고 느끼시는 분들께 특히 추천드립니다.',
  },
  kevin: {
    intro: '기능성 트레이닝과 스포츠 퍼포먼스 전문. 일상과 운동 모두에서 강한 몸을 만듭니다.',
    introLong: '기능성 트레이닝과 스포츠 퍼포먼스 향상을 전문으로 합니다. 7년간 TRX, 케틀벨, 배틀로프 등 다양한 도구를 활용해 실생활 동작 능력과 운동 능력을 동시에 끌어올렸습니다. 단순한 근육 운동이 아닌 몸 전체의 협응력과 기능을 향상시키는 프로그램을 제공합니다.',
  },
  kim: {
    intro: '근력 트레이닝 전문. 체계적인 프로그램으로 목표 체형을 만들어 드립니다.',
    introLong: '근력 트레이닝을 전문으로 합니다. 개인의 체력 수준과 목표에 맞는 맞춤형 프로그램으로 안전하고 효과적인 근력 향상을 도와드립니다. 처음 헬스를 시작하는 분부터 수준을 높이고 싶은 분까지 누구나 함께할 수 있습니다.',
  },
  soyeon: {
    intro: '자세 교정 전문. 거북목·라운드숄더·골반 불균형을 바로잡아 통증 없는 몸을 만듭니다.',
    introLong: '자세 교정 전문 트레이너입니다. 9년간 사무직·장시간 컴퓨터 사용자의 거북목, 라운드숄더, 골반 불균형 등 현대인의 자세 문제를 체계적으로 교정해왔습니다. 움직임 분석과 개인 맞춤 교정 운동으로 일상 속 통증을 줄이고 건강한 체형을 되찾을 수 있도록 돕습니다.',
  },
  yuna: {
    intro: '시니어·저강도 트레이닝 전문. 나이와 관계없이 누구나 건강하게 운동할 수 있습니다.',
    introLong: '시니어와 저강도 트레이닝을 전문으로 합니다. 8년간 고령자, 만성질환자, 운동 입문자를 대상으로 부상 위험을 최소화하면서 근력·균형감각·심폐 기능을 향상시켜왔습니다. "나이가 많아서", "몸이 안 좋아서"라는 이유로 운동을 망설이고 계신 분들께 가장 잘 맞는 트레이너입니다.',
  },
  junho: {
    intro: '크로스핏·HIIT 전문. 짧고 강렬한 운동으로 최대의 효과를 만들어냅니다.',
    introLong: '크로스핏과 HIIT(고강도 인터벌 트레이닝) 전문 트레이너입니다. 5년간 제한된 시간 안에 최대 효율을 내는 고강도 프로그램으로 체지방 감소와 심폐 능력을 동시에 끌어올렸습니다. 시간이 부족하지만 빠른 변화를 원하는 분들에게 추천드립니다.',
  },
};

let success = 0;
let fail = 0;

for (const [id, { intro, introLong }] of Object.entries(intros)) {
  try {
    await docClient.send(new UpdateCommand({
      TableName: TABLE,
      Key: { id },
      UpdateExpression: 'SET intro = :intro, introLong = :introLong',
      ExpressionAttributeValues: {
        ':intro': intro,
        ':introLong': introLong,
      },
    }));
    console.log(`✓ ${id}`);
    success++;
  } catch (e) {
    console.error(`✗ ${id}: ${e.message}`);
    fail++;
  }
}

console.log(`\n완료: 성공 ${success}명 / 실패 ${fail}명`);
