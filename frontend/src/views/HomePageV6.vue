<template>
  <div class="gym-site home-v6-rhythm">
    <HomeHeroV6 :hero="hero" :hero-slides="heroSlides" :featured-program="featuredProgram" />

    <AboutHeroSection />
    <AnalyticsWorkoutSection />
    <BreakLimitsSection />
    <FeaturesSection />
    <ClassesSliderSection />
    <TrainersSection @select-trainer="onTrainerSelect" />
    <HomeStoryCarouselV6 />
    <InstagramSection @open-post="onInstagramPost" />
    <HomeContactSection
      :address="storeAddress"
      :phone-display="storePhoneDisplay"
      :phone-href="storePhoneHref"
      :map-embed-url="googleMapEmbedUrl"
      :map-link-url="googleMapLinkUrl"
    />
    <HomeSiteFooter :store-name="storeName" />
  </div>

  <InquiryModal v-model="inquiryOpen" />
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getStoreInfo } from '../api';
import { formatKoreanPhoneDisplayOrDash } from '../utils/phoneFormat';
import InquiryModal from '../components/InquiryModal.vue';
import HomeHeroV6 from '../components/home/HomeHeroV6.vue';
import HomeStatsStrip from '../components/home/HomeStatsStrip.vue';
import HomeStoryCarouselV6 from '../components/home/HomeStoryCarouselV6.vue';
import HomeContactSection from '../components/home/HomeContactSection.vue';
import HomeSiteFooter from '../components/home/HomeSiteFooter.vue';
import AboutHeroSection from '../components/AboutHeroSection.vue';
import ClassesSliderSection from '../components/ClassesSliderSection.vue';
import TrainersSection from '../components/TrainersSection.vue';
import InstagramSection from '../components/InstagramSection.vue';
import AnalyticsWorkoutSection from '../components/AnalyticsWorkoutSection.vue';
import BreakLimitsSection from '../components/BreakLimitsSection.vue';
import FeaturesSection from '../components/FeaturesSection.vue';

const router = useRouter();
const inquiryOpen = ref(false);

function onTrainerSelect(trainer) {
  router.push({ name: 'TrainerDetail', params: { id: String(trainer.id) } });
}

function onInstagramPost(_post) {
  window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer');
}

const STORE_ID = 'store_default';

const storeName = ref('짐 PT');
const storeAddress = ref('서울시 강남구 테헤란로 123');
const storePhoneRaw = ref('02-0000-0000');

const hero = ref({
  image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=85',
  title: '지금 시작하세요\n오늘부터 달라질 겁니다.',
  subtitle: '프리미엄 1:1 퍼스널 트레이닝 · 목표까지 함께합니다',
});

const aboutSections = ref([
  {
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=85',
    title: '당신만의 변화가 시작되는 곳',
    body: '프리미엄 환경에서 1:1 맞춤 트레이닝을 경험하세요. 전문 트레이너가 목표에 맞는 프로그램을 설계하고, 안전하고 지속 가능한 변화를 이끌어 드립니다.',
  },
  {
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=85',
    title: '목표에 맞춘 PT 루틴',
    body: '체중 감량, 근력 향상, 자세 교정까지 회원님의 목표를 기준으로 세션을 구성합니다. 운동 강도와 진행 속도를 매 수업마다 조정해 무리 없이 꾸준히 이어갈 수 있습니다.',
  },
]);

const stats = ref([
  { value: '500+', label: '누적 회원' },
  { value: '98%', label: '재등록률' },
  { value: '10+', label: '전문 트레이너' },
  { value: '5년+', label: '운영 경력' },
]);

const DEFAULT_PROGRAMS = [
  {
    title: '다이어트',
    desc: '목표 체중과 건강한 습관을 위한 맞춤 프로그램',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80',
  },
  {
    title: '근력 증가',
    desc: '기초부터 탄탄히, 안전한 근력 트레이닝',
    image: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=400&q=80',
  },
  {
    title: '체형 교정',
    desc: '자세와 움직임 개선으로 일상이 편해집니다',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
  },
];

const programs = ref(DEFAULT_PROGRAMS);
const featuredProgram = computed(() => programs.value?.[0] || null);

const heroSlide4 = ref('https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1920&q=85');
const heroSlides = computed(() => {
  const a0 = aboutSections.value?.[0]?.image;
  const a1 = aboutSections.value?.[1]?.image;
  const base = [hero.value?.image, a0, a1, heroSlide4.value].filter(Boolean);
  while (base.length < 4) base.push(hero.value?.image);
  return base.slice(0, 4);
});

const storePhoneDisplay = computed(() => formatKoreanPhoneDisplayOrDash(storePhoneRaw.value));
const storePhoneHref = computed(() => {
  const digits = String(storePhoneRaw.value || '').replace(/\D/g, '');
  return digits ? `tel:${digits}` : 'tel:';
});
const googleMapQuery = computed(() => encodeURIComponent(storeAddress.value || '서울시 강남구'));
const googleMapEmbedUrl = computed(() => `https://maps.google.com/maps?q=${googleMapQuery.value}&z=16&output=embed`);
const googleMapLinkUrl = computed(
  () => `https://www.google.com/maps/search/?api=1&query=${googleMapQuery.value}`
);

async function loadStoreInfoForHome() {
  try {
    const store = await getStoreInfo(STORE_ID);
    storeName.value = store.name || storeName.value;
    storeAddress.value = store.address || storeAddress.value;
    storePhoneRaw.value = store.phone || storePhoneRaw.value;
    if (Array.isArray(store.programs) && store.programs.length > 0) {
      programs.value = store.programs;
    }
    if (store.hero?.title) hero.value = store.hero;
    if (Array.isArray(store.aboutSections) && store.aboutSections.length === 2) {
      aboutSections.value = store.aboutSections;
    }
  } catch {
    /* 스토어 조회 실패 시 기본값 유지 */
  }
}

onMounted(() => {
  loadStoreInfoForHome();
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css');
</style>

<style scoped>
.gym-site {
  background: #09090b;
}

/**
 * 홈 V6: 섹션 간 상하 리듬 통일
 * - 각 블록 컴포넌트에 제각각인 py-* 대신 동일한 세로 간격 적용
 * - 전체 화면 히어로·100vh 스토리 캐러셀은 레이아웃 유지를 위해 제외
 */
.home-v6-rhythm {
  --home-section-py: clamp(3rem, 5vw, 5rem);
}

.home-v6-rhythm > :deep(section:not(.hero-v6):not(.v6-story-carousel)) {
  padding-top: var(--home-section-py) !important;
  padding-bottom: var(--home-section-py) !important;
}

.home-v6-rhythm > :deep(footer) {
  padding-top: var(--home-section-py) !important;
  padding-bottom: var(--home-section-py) !important;
}

/* 히어로: 문구(의도된 줄바꿈) + 배경 대비 */
.home-v6-rhythm :deep(.hero-v6.hero-v6--slider)::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.58) 0%,
    rgba(0, 0, 0, 0.22) 42%,
    rgba(0, 0, 0, 0.68) 100%
  );
}

.home-v6-rhythm :deep(.hero-v6__bg) {
  z-index: 0;
}

.home-v6-rhythm :deep(.hero-v6__title) {
  white-space: pre-line;
  color: #fff;
  text-shadow:
    0 0 1px rgba(0, 0, 0, 0.85),
    0 2px 18px rgba(0, 0, 0, 0.75),
    0 4px 36px rgba(0, 0, 0, 0.4);
}

.home-v6-rhythm :deep(.hero-v6__subtitle) {
  color: rgba(255, 255, 255, 0.97);
  font-size: clamp(0.875rem, 2.2vw, 1rem);
  font-weight: 600;
  text-shadow:
    0 1px 10px rgba(0, 0, 0, 0.88),
    0 0 1px rgba(0, 0, 0, 0.9);
}

/* 통계 바: 톤 다운 + 라벨 가독성 (V6만) */
.home-v6-rhythm :deep(section.home-v6-stats) {
  background-color: #0a0a0b !important;
  border-top-color: rgba(255, 255, 255, 0.07) !important;
  border-bottom-color: rgba(255, 255, 255, 0.07) !important;
}

.home-v6-rhythm :deep(.home-v6-stats .home-v6-stat-value) {
  color: #f4f4f5 !important;
}

.home-v6-rhythm :deep(.home-v6-stats .home-v6-stat-label) {
  color: #c4c4cc !important;
  font-size: clamp(15px, 2.2vw, 17px) !important;
  font-weight: 500;
  line-height: 1.45;
}
</style>
