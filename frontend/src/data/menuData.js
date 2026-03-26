/** Gym PT — 헤더 메가메뉴 데이터 (1인 트레이너 PT샵 톤) */
export const navItems = [
  { key: 'home',     label: 'Home',       href: '/',        hasMega: false },
  { key: 'classes',   label: '강좌',       href: '/trainers', hasMega: false },
  { key: 'trainers', label: '트레이너',   href: '/trainers', hasMega: false },
  { key: 'story',    label: '스토리',     href: '/#story',     hasMega: false },
  { key: 'sns',      label: 'SNS',                              hasMega: true  },
  { key: 'member',   label: '회원',                            hasMega: true  },
  { key: 'admin',    label: '관리자',                         hasMega: true  },
];

export const menuData = {
  member: {
    eyebrow: 'MEMBER',
    title: '회원 서비스',
    description: '예약을 확인하고 PT 패스를 이용하세요.',
    overviewLink: '/reserve',
    categories: [
      {
        id: 'm1',
        title: '트레이너 소개',
        description: 'PT 트레이너를 소개합니다.',
        readMore: '/trainers',
      },
      {
        id: 'm0',
        title: '내 PT · 예약',
        description: 'PT 현황, 다가오는 예약, 출석 달력을 한 번에 확인합니다.',
        readMore: '/dashboard',
      },
      {
        id: 'm3',
        title: 'PT 패스 구매',
        description: '세션 패스를 결제하고 바로 사용하세요.',
        readMore: '/passes',
      },
      {
        id: 'm4',
        title: '로그인 · 회원가입',
        description: '전화번호와 비밀번호로 로그인하세요.',
        readMore: '/login',
      },
    ],
  },
  admin: {
    eyebrow: 'ADMIN',
    title: '관리자',
    description: '예약 대시보드와 운영 설정을 관리합니다.',
    overviewLink: '/admin',
    categories: [
      {
        id: 'a1',
        title: '대시보드',
        description: '예약 현황을 확인합니다.',
        readMore: '/admin',
      },
      {
        id: 'a10',
        title: '상담 문의',
        description: '무료 상담 신청을 확인하고 관리합니다.',
        readMore: '/admin/inquiries',
      },
      {
        id: 'a9',
        title: '회원 관리',
        description: '회원 목록을 보고 이름·전화번호를 수정합니다.',
        readMore: '/admin/members',
      },
      {
        id: 'a4',
        title: '패스 관리',
        description: '회원 PT 패스를 발급하고 세션을 관리합니다.',
        readMore: '/admin/passes',
      },
      {
        id: 'a5',
        title: '알림 관리',
        description: '회원 알림을 발송하고 이력을 확인합니다.',
        readMore: '/admin/notifications',
      },
      {
        id: 'a6',
        title: '통계',
        description: '월별 예약·완료율·신규 회원 통계를 확인합니다.',
        readMore: '/admin/stats',
      },
      {
        id: 'a7',
        title: '스토어 설정',
        description: '스튜디오 이름·주소·예약 시간을 설정합니다.',
        readMore: '/admin/store',
      },
      {
        id: 'a2',
        title: '트레이너 관리',
        description: '트레이너를 등록하고 정보를 수정합니다.',
        readMore: '/admin/trainer',
      },
    ],
  },
  sns: {
    eyebrow: 'SNS',
    title: '소셜 미디어',
    description: '인스타그램과 블로그에서 최신 소식을 확인하세요.',
    overviewLink: null,
    categories: [
      {
        id: 'sns1',
        title: '인스타그램',
        description: '트레이닝 일상과 회원 후기를 확인하세요.',
        readMore: 'https://instagram.com',
        external: true,
      },
      {
        id: 'sns2',
        title: '블로그',
        description: '운동 팁과 건강 정보를 공유합니다.',
        readMore: 'https://blog.naver.com',
        external: true,
      },
    ],
  },
  theme: {
    eyebrow: 'THEME',
    title: '메인 페이지 선택',
    description: '원하는 메인 스타일을 선택해 미리보기합니다. (?v=...)',
    overviewLink: '/?v=default',
    categories: [
      { id: 't0', title: '기본', description: '현재 기본 메인', readMore: '/?v=default' },
      { id: 't1', title: 'Alt 1', description: '이미지 히어로 + CTA', readMore: '/?v=alt1' },
      { id: 't2', title: 'Alt 2', description: '미니멀 그라데이션', readMore: '/?v=alt2' },
      { id: 't3', title: 'Alt 3', description: '좌우 분할 히어로', readMore: '/?v=alt3' },
      { id: 't4', title: 'Alt 4', description: '다크 히어로 오버레이', readMore: '/?v=alt4' },
      { id: 't5', title: 'Alt 5', description: '중앙 카드 히어로', readMore: '/?v=alt5' },
    ],
  },
};
