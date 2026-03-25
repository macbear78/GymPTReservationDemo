<template>
  <div class="gym-site">
    <HomeHeroV6 :hero="hero" :hero-slides="heroSlides" :featured-program="featuredProgram" />
    <HomeStatsStrip :stats="stats" />
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
import { computed, ref, onMounted, onUnmounted } from 'vue';
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
  title: '지금 시작하세요',
  subtitle: '당신의 몸을 바꿀 시간입니다',
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

let revealObserver = null;

function setupReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      const handledParents = new Set();
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const parent = el.parentElement;
        if (parent && !handledParents.has(parent)) {
          const siblings = [...parent.querySelectorAll(':scope > .reveal:not(.is-visible)')];
          if (siblings.length > 1) {
            handledParents.add(parent);
            siblings.forEach((sib, i) => {
              sib.style.transitionDelay = `${i * 100}ms`;
              sib.classList.add('is-visible');
              revealObserver.unobserve(sib);
            });
            return;
          }
        }
        el.style.transitionDelay = '0ms';
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
}

onMounted(() => {
  loadStoreInfoForHome();
  setupReveal();
});

onUnmounted(() => {
  revealObserver?.disconnect();
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

.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.6s ease-out,
    transform 0.6s ease-out;
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
