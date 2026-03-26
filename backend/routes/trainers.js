import { Router } from 'express';
import { PutCommand, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import docClient from '../db/dynamodb.js';

const TRAINERS_TABLE = process.env.TRAINERS_TABLE || 'trainers';

async function scanAllTrainers() {
  const items = [];
  let lastKey;
  do {
    const result = await docClient.send(
      new ScanCommand({
        TableName: TRAINERS_TABLE,
        ExclusiveStartKey: lastKey,
      })
    );
    items.push(...(result.Items || []));
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);
  return items;
}

export const TRAINERS = [
  {
    id: 'mike',
    name: 'Mike',
    specialty: 'Strength Training',
    specialtyKey: 'strength',
    experience: '8년 경력',
    experienceYears: 8,
    rating: 4.9,
    reviewCount: 128,
    intro: '근력과 체형 교정 전문. 개인 맞춤 프로그램으로 목표 달성을 도와드립니다.',
    introLong: '근력 강화와 체형 교정을 전문으로 하는 PT 트레이너입니다. 8년 동안 다양한 회원의 체형 개선과 다이어트를 도와왔으며, 개인의 목표와 체력 수준에 맞는 맞춤 프로그램을 제공합니다.',
    trainingAreas: ['근력 강화', '체형 교정', '다이어트', '자세 교정'],
    certifications: ['생활스포츠지도사 2급', 'NASM Certified Personal Trainer', '기능성 트레이닝 전문가'],
    programs: ['다이어트 집중 프로그램', '근력 강화 프로그램', '체형 교정 프로그램'],
    pricePerHour: 60000,
    image: null,
  },
  {
    id: 'anna',
    name: 'Anna',
    specialty: 'Diet & Body Shape',
    specialtyKey: 'diet',
    experience: '5년 경력',
    experienceYears: 5,
    rating: 4.8,
    reviewCount: 95,
    intro: '다이어트와 바디 셰이핑 전문. 식단 관리와 운동을 함께 설계합니다.',
    introLong: '다이어트와 바디 셰이핑을 전문으로 합니다. 5년간 식단 관리와 운동을 결합한 프로그램으로 회원들의 목표 달성을 도왔으며, 지속 가능한 습관 형성에 중점을 둡니다.',
    trainingAreas: ['다이어트', '체형 교정', '식단 코칭', '유산소 트레이닝'],
    certifications: ['스포츠영양사', 'NASM Weight Loss Specialist', 'KCCA 다이어트 코치'],
    programs: ['다이어트 집중 프로그램', '바디 셰이핑 프로그램', '식단·운동 통합 프로그램'],
    pricePerHour: 55000,
    image: null,
  },
  {
    id: 'chris',
    name: 'Chris',
    specialty: 'Rehabilitation Training',
    specialtyKey: 'rehab',
    experience: '10년 경력',
    experienceYears: 10,
    rating: 5.0,
    reviewCount: 156,
    intro: '재활 및 부상 복귀 트레이닝. 안전한 동작으로 회복을 이끌어냅니다.',
    introLong: '재활 및 부상 복귀 트레이닝 전문입니다. 10년간 스포츠 부상, 요통, 어깨 통증 등 다양한 케이스를 다뤄왔으며, 안전한 동작과 단계별 프로그램으로 회복을 이끌어냅니다.',
    trainingAreas: ['재활 트레이닝', '자세 교정', '통증 완화', '동작 분석'],
    certifications: ['NSCA-CPT', 'Corrective Exercise Specialist', '스포츠재활지도사'],
    programs: ['재활 트레이닝', '부상 복귀 프로그램', '통증 완화·자세 교정'],
    pricePerHour: 70000,
    image: null,
  },
  {
    id: 'sarah',
    name: 'Sarah',
    specialty: 'Diet & Body Shape',
    specialtyKey: 'diet',
    experience: '6년 경력',
    experienceYears: 6,
    rating: 4.7,
    reviewCount: 82,
    intro: '체중 조절과 식단 코칭 전문. 지속 가능한 습관으로 건강한 몸을 만듭니다.',
    introLong: '체중 조절과 식단 코칭을 전문으로 합니다. 6년간 다양한 연령대의 다이어트 성공 사례를 쌓았으며, 무리하지 않는 식습관과 운동으로 건강한 몸을 만드는 데 집중합니다.',
    trainingAreas: ['다이어트', '체중 조절', '식단 관리', '유산소 트레이닝'],
    certifications: ['영양사 자격증', 'ACE Personal Trainer', '다이어트 코칭 전문가'],
    programs: ['다이어트 집중 프로그램', '체중 조절 8주 프로그램', '습관 형성 코칭'],
    pricePerHour: 52000,
    image: null,
  },
  {
    id: 'james',
    name: 'James',
    specialty: 'Group & Team Training',
    specialtyKey: 'group',
    experience: '12년 경력',
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 203,
    intro: '소그룹·커플·팀 PT 전문. 함께 운동하는 즐거움으로 꾸준함을 만듭니다.',
    introLong: '소그룹 및 팀 트레이닝 전문입니다. 12년간 복합 운동의 안전한 자세 지도 경험을 바탕으로 2~4인 그룹 PT를 운영해왔으며, 팀원 간 경쟁과 응원을 통해 혼자보다 더 높은 출석률과 성과를 만들어냅니다.',
    trainingAreas: ['그룹 PT', '팀 트레이닝', '복합 운동', '동기 부여 코칭'],
    certifications: ['NSCA-CSCS', 'NASM CPT', '올림픽 리프팅 지도자'],
    programs: ['그룹 PT 프로그램', '커플·친구 PT', '소그룹 근력 트레이닝'],
    pricePerHour: 65000,
    image: null,
  },
  {
    id: 'emma',
    name: 'Emma',
    specialty: 'Rehabilitation Training',
    specialtyKey: 'rehab',
    experience: '7년 경력',
    experienceYears: 7,
    rating: 4.8,
    reviewCount: 91,
    intro: '요통·어깨 재활 전문. 일상 동작 개선과 통증 완화에 집중합니다.',
    introLong: '요통과 어깨 재활을 전문으로 합니다. 7년간 일상 동작 개선과 통증 완화 프로그램을 운영해왔으며, 개인의 생활 패턴을 고려한 맞춤 재활 플랜을 제공합니다.',
    trainingAreas: ['재활 트레이닝', '요통 완화', '어깨 재활', '자세 교정'],
    certifications: ['물리치료학과 졸업', 'CES', '필라테스 지도자'],
    programs: ['재활 트레이닝', '요통·어깨 집중 프로그램', '일상 동작 개선'],
    pricePerHour: 58000,
    image: null,
  },
  {
    id: 'david',
    name: 'David',
    specialty: 'Strength Training',
    specialtyKey: 'strength',
    experience: '4년 경력',
    experienceYears: 4,
    rating: 4.6,
    reviewCount: 64,
    intro: '초보자 맞춤 근력 트레이닝. 기초부터 탄탄히 다져 목표 체형을 만듭니다.',
    introLong: '초보자 맞춤 근력 트레이닝을 전문으로 합니다. 4년간 운동을 처음 시작하는 회원들의 기초 체력 향상과 올바른 자세 형성을 도왔으며, 부상 없이 목표 체형에 도달할 수 있도록 합니다.',
    trainingAreas: ['근력 강화', '체형 교정', '기초 체력', '자세 교정'],
    certifications: ['ACE Personal Trainer', '기능성 트레이닝 전문가'],
    programs: ['근력 강화 프로그램', '입문자 12주 프로그램', '체형 교정 프로그램'],
    pricePerHour: 48000,
    image: null,
  },
  {
    id: 'lisa',
    name: 'Lisa',
    specialty: 'Body Profile & Shaping',
    specialtyKey: 'body',
    experience: '9년 경력',
    experienceYears: 9,
    rating: 4.9,
    reviewCount: 178,
    intro: '여성 바디프로필·바디 셰이핑 전문. 체형 완성과 촬영 컨디셔닝을 함께 설계합니다.',
    introLong: '여성 바디프로필과 바디 셰이핑에 특화되어 있습니다. 9년간 여성 회원의 체질·호르몬 주기를 고려한 감량·체형 교정 프로그램으로 바디프로필 촬영 성공 사례를 다수 보유하고 있습니다. 드라이아웃과 피크 컨디셔닝까지 전 과정을 밀착 관리합니다.',
    trainingAreas: ['바디프로필', '바디 셰이핑', '호르몬 밸런스', '피크 컨디셔닝'],
    certifications: ['스포츠영양사', 'NASM WLS', '여성 건강 트레이닝 전문가'],
    programs: ['바디프로필 D-12주 집중', '바디 셰이핑 프로그램', '호르몬 밸런스 코칭'],
    pricePerHour: 62000,
    image: null,
  },
  {
    id: 'ryan',
    name: 'Ryan',
    specialty: 'Rehabilitation Training',
    specialtyKey: 'rehab',
    experience: '11년 경력',
    experienceYears: 11,
    rating: 5.0,
    reviewCount: 134,
    intro: '스포츠 부상 재활과 동작 분석. 재발 방지를 위한 근본적인 교정을 진행합니다.',
    introLong: '스포츠 부상 재활과 동작 분석 전문입니다. 11년간 선수 및 일반인의 부상 복귀를 지도해왔으며, 재발 방지를 위한 근본적인 동작 교정과 근력 불균형 해소에 집중합니다.',
    trainingAreas: ['재활 트레이닝', '동작 분석', '스포츠 재활', '자세 교정'],
    certifications: ['NSCA-CPT', 'Corrective Exercise Specialist', '스포츠재활지도사'],
    programs: ['재활 트레이닝', '스포츠 부상 복귀', '동작 분석·교정 프로그램'],
    pricePerHour: 72000,
    image: null,
  },
  {
    id: 'minji',
    name: 'Minji',
    specialty: 'Group & Beginner Training',
    specialtyKey: 'group',
    experience: '3년 경력',
    experienceYears: 3,
    rating: 4.5,
    reviewCount: 41,
    intro: '소그룹 PT와 초보자 맞춤. 부담 없이 즐겁게 시작하는 분위기를 만듭니다.',
    introLong: '소그룹 PT와 초보자 맞춤 트레이닝을 전담합니다. 3년간 운동을 처음 시작하는 회원들이 그룹 안에서 편안하게 적응할 수 있도록 도왔으며, 밝고 긍정적인 분위기로 커플·친구·직장 동료 그룹에서 높은 만족도를 얻고 있습니다.',
    trainingAreas: ['그룹 PT', '초보자 트레이닝', '유산소', '동기 부여'],
    certifications: ['ACE Personal Trainer', '그룹 피트니스 지도자'],
    programs: ['그룹 PT 프로그램', '커플·친구 PT', '4주 입문 스타트'],
    pricePerHour: 45000,
    image: null,
  },
  {
    id: 'tom',
    name: 'Tom',
    specialty: 'Body Profile & Competition',
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
    image: null,
  },
];

export const trainersRouter = Router();

trainersRouter.get('/', async (req, res) => {
  try {
    const items = await scanAllTrainers();
    res.json(items);
  } catch (err) {
    console.error('GET /api/trainers error:', err);
    res.status(500).json({ message: err.message || '트레이너 목록 조회에 실패했습니다.' });
  }
});

/**
 * GET /api/trainers/:id - 트레이너 단건 조회
 */
trainersRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id?.trim()) {
      return res.status(400).json({ message: 'id가 필요합니다.' });
    }

    const result = await docClient.send(
      new GetCommand({
        TableName: TRAINERS_TABLE,
        Key: { id: id.trim() },
      })
    );

    if (!result?.Item) {
      return res.status(404).json({ message: '트레이너를 찾을 수 없습니다.' });
    }

    res.json(result.Item);
  } catch (err) {
    console.error('GET /api/trainers/:id error:', err);
    res.status(500).json({ message: err.message || '트레이너 조회에 실패했습니다.' });
  }
});

/**
 * POST /api/trainers - 트레이너 등록 (DynamoDB 저장)
 * Body: { id, name, specialty, experience, pricePerHour, profileImage, intro, introLong? }
 */
trainersRouter.post('/', async (req, res) => {
  try {
    const { id, name, specialty, experience, pricePerHour, profileImage, intro, introLong } = req.body;

    if (!id || typeof id !== 'string' || !id.trim()) {
      return res.status(400).json({ message: 'id는 필수입니다.' });
    }
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'name은 필수입니다.' });
    }
    if (!specialty || typeof specialty !== 'string' || !specialty.trim()) {
      return res.status(400).json({ message: 'specialty는 필수입니다.' });
    }
    if (experience === undefined || experience === null || String(experience).trim() === '') {
      return res.status(400).json({ message: 'experience는 필수입니다.' });
    }
    if (pricePerHour === undefined || pricePerHour === null || Number.isNaN(Number(pricePerHour))) {
      return res.status(400).json({ message: 'pricePerHour는 숫자여야 합니다.' });
    }
    if (!profileImage || typeof profileImage !== 'string' || !profileImage.trim()) {
      return res.status(400).json({ message: 'profileImage(S3 URL)는 필수입니다.' });
    }
    if (!intro || typeof intro !== 'string' || !intro.trim()) {
      return res.status(400).json({ message: 'intro(짧은 소개)는 필수입니다.' });
    }

    const trimmedId = String(id).trim();
    const price = Number(pricePerHour);

    const existing = await docClient.send(
      new GetCommand({
        TableName: TRAINERS_TABLE,
        Key: { id: trimmedId },
      })
    );

    if (existing?.Item) {
      return res.status(409).json({
        message: '이미 사용 중인 트레이너 ID입니다. 다른 ID를 사용해 주세요.',
      });
    }

    const trainer = {
      id: trimmedId,
      name: String(name).trim(),
      specialty: String(specialty).trim(),
      experience: String(experience).trim(),
      pricePerHour: price,
      profileImage: String(profileImage).trim(),
      intro: String(intro).trim(),
      introLong: introLong != null && String(introLong).trim() ? String(introLong).trim() : String(intro).trim(),
    };

    await docClient.send(
      new PutCommand({
        TableName: TRAINERS_TABLE,
        Item: trainer,
      })
    );

    res.status(201).json({
      message: '등록 완료',
      trainer,
    });
  } catch (err) {
    console.error('POST /api/trainers error:', err);
    res.status(500).json({
      message: err.message || '트레이너 등록에 실패했습니다.',
    });
  }
});

/**
 * PUT /api/trainers/:id - 트레이너 수정
 * Body: { name?, specialty?, experience?, pricePerHour?, profileImage?, intro?, introLong? }
 */
trainersRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, specialty, experience, pricePerHour, profileImage, intro, introLong } = req.body;

    if (!id?.trim()) {
      return res.status(400).json({ message: 'id가 필요합니다.' });
    }

    const existing = await docClient.send(
      new GetCommand({
        TableName: TRAINERS_TABLE,
        Key: { id: id.trim() },
      })
    );

    if (!existing?.Item) {
      return res.status(404).json({ message: '트레이너를 찾을 수 없습니다.' });
    }

    const current = existing.Item;
    const nextIntro =
      intro !== undefined && intro !== null ? String(intro).trim() : current.intro ?? '';
    const nextIntroLong =
      introLong !== undefined && introLong !== null
        ? String(introLong).trim()
        : current.introLong ?? nextIntro;

    const updated = {
      ...current,
      name: name !== undefined && name !== null ? String(name).trim() : current.name,
      specialty: specialty !== undefined && specialty !== null ? String(specialty).trim() : current.specialty,
      experience: experience !== undefined && experience !== null ? String(experience).trim() : current.experience,
      pricePerHour: pricePerHour !== undefined && pricePerHour !== null ? Number(pricePerHour) : current.pricePerHour,
      profileImage: profileImage !== undefined && profileImage !== null ? String(profileImage).trim() : current.profileImage,
      intro: nextIntro,
      introLong: nextIntroLong || nextIntro,
    };

    if (!updated.name) {
      return res.status(400).json({ message: 'name은 필수입니다.' });
    }
    if (!updated.specialty) {
      return res.status(400).json({ message: 'specialty는 필수입니다.' });
    }
    if (!updated.experience) {
      return res.status(400).json({ message: 'experience는 필수입니다.' });
    }
    if (Number.isNaN(updated.pricePerHour) || updated.pricePerHour < 0) {
      return res.status(400).json({ message: 'pricePerHour는 0 이상의 숫자여야 합니다.' });
    }
    if (!updated.profileImage) {
      return res.status(400).json({ message: 'profileImage는 필수입니다.' });
    }
    if (!updated.intro) {
      return res.status(400).json({ message: 'intro(짧은 소개)는 필수입니다.' });
    }

    await docClient.send(
      new PutCommand({
        TableName: TRAINERS_TABLE,
        Item: updated,
      })
    );

    res.json({
      message: '수정 완료',
      trainer: updated,
    });
  } catch (err) {
    console.error('PUT /api/trainers/:id error:', err);
    res.status(500).json({
      message: err.message || '트레이너 수정에 실패했습니다.',
    });
  }
});
