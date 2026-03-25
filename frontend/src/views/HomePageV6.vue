<template>
  <div class="gym-site">
    <!-- 1. Hero -->
    <section class="hero-v6 hero-v6--slider">
      <!-- background slides (no overlay) -->
      <div class="hero-v6__bg" aria-hidden="true">
        <img
          v-for="(src, i) in heroSlides"
          :key="`${src}-${i}`"
          :src="src"
          :alt="`hero slide ${i + 1}`"
          class="hero-v6__bg-img"
          :class="{ 'is-active': i === activeSlide }"
        />
      </div>

      <!-- title (top-left) -->
      <h1 class="hero-v6__title">
        {{ hero.title }}
      </h1>

      <!-- floating program card (bottom-left, hidden on mobile) -->
      <div v-if="featuredProgram" class="hero-v6__program-card">
        <img
          :src="featuredProgram.image"
          :alt="featuredProgram.title"
          class="hero-v6__program-thumb"
          loading="lazy"
        />
        <div class="hero-v6__program-meta">
          <p class="hero-v6__program-name">{{ featuredProgram.title }}</p>
          <p class="hero-v6__program-desc">{{ featuredProgram.desc }}</p>
          <router-link to="/passes" class="hero-v6__program-link">알아보기 →</router-link>
        </div>
      </div>

      <!-- subtitle + indicators (bottom-right) -->
      <div class="hero-v6__footer">
        <p class="hero-v6__subtitle">{{ hero.subtitle }}</p>
        <div class="hero-v6__dots" role="tablist" aria-label="hero slides">
          <button
            v-for="i in 4"
            :key="i"
            type="button"
            :aria-label="`slide ${i}`"
            @click="activeSlide = i - 1; restartHeroAuto()"
            class="hero-v6__dot-btn"
          >
            <span v-if="activeSlide === i - 1" :key="heroProgressKey" class="indicator-dot active" />
            <span v-else class="indicator-dot" />
          </button>
        </div>
      </div>
    </section>

    <!-- 2. 숫자 배지 (Stats) — placeholder -->
    <section class="py-14 bg-zinc-900 border-y border-zinc-800">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div v-for="stat in stats" :key="stat.label" class="reveal">
            <p class="text-4xl sm:text-5xl font-bold text-amber-400 mb-2">{{ stat.value }}</p>
            <p class="text-zinc-400 text-sm">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. About / 소개1 -->
    <section class="py-20 sm:py-28 bg-zinc-900">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div class="order-2 lg:order-1 reveal">
            <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">
              {{ aboutSections[0].title }}
            </h2>
            <p class="text-zinc-400 text-lg leading-relaxed">
              {{ aboutSections[0].body }}
            </p>
          </div>
          <div class="order-1 lg:order-2">
            <img
              :src="aboutSections[0].image"
              :alt="aboutSections[0].title"
              class="rounded-2xl object-cover w-full h-full min-h-[340px] sm:min-h-[460px] shadow-2xl reveal"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 4. About / 소개2 (반대 레이아웃) -->
    <section class="py-20 sm:py-28 bg-zinc-900">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div class="order-1">
            <img
              :src="aboutSections[1].image"
              :alt="aboutSections[1].title"
              class="rounded-2xl object-cover w-full h-full min-h-[340px] sm:min-h-[460px] shadow-2xl reveal"
              loading="lazy"
            />
          </div>
          <div class="order-2 reveal">
            <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">
              {{ aboutSections[1].title }}
            </h2>
            <p class="text-zinc-400 text-lg leading-relaxed">
              {{ aboutSections[1].body }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Value Props (Green) -->
    <section class="py-20 sm:py-24 bg-[#f0fce8]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-zinc-900 mb-10 sm:mb-12 reveal">
          1:1 맞춤 트레이닝으로 당신의 몸을 바꿉니다
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="v6-green-card reveal">
            <div class="text-[3rem] leading-none mb-5">💪</div>
            <h3 class="v6-green-card-title">완전 맞춤 프로그램</h3>
            <p class="v6-green-card-desc">
              체력, 목표, 생활패턴을 분석해 나만을 위한 루틴을 설계합니다
            </p>
          </div>

          <div class="v6-green-card reveal">
            <div class="text-[3rem] leading-none mb-5">🎯</div>
            <h3 class="v6-green-card-title">목표 중심 트레이닝</h3>
            <p class="v6-green-card-desc">
              다이어트, 근력, 재활 — 목표에 맞는 방법으로 정확하게 접근합니다
            </p>
          </div>

          <div class="v6-green-card reveal">
            <div class="text-[3rem] leading-none mb-5">🔄</div>
            <h3 class="v6-green-card-title">지속 가능한 변화</h3>
            <p class="v6-green-card-desc">
              단기 효과가 아닌 평생 유지되는 몸과 습관을 만들어 드립니다
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Programs -->
    <section class="py-20 sm:py-28 bg-zinc-950">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 class="text-3xl sm:text-4xl font-bold text-white text-center mb-4 reveal">
          프로그램
        </h2>
        <p class="text-zinc-500 text-center mb-14 reveal">
          목표에 맞는 프로그램을 선택하세요
        </p>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(p, i) in programs"
            :key="p.title"
            class="rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 transition-all duration-300 text-center reveal overflow-hidden flex flex-col"
          >
            <div class="w-full h-52">
              <img
                :src="p.image"
                :alt="`${p.title} 프로그램`"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div class="p-5 border-t border-zinc-800 flex flex-col justify-center min-h-[96px]">
              <h3 class="text-xl font-semibold text-white mb-2">{{ p.title }}</h3>
              <p class="text-zinc-500 text-sm">{{ p.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Video Carousel (Story) -->
    <section class="v6-story-carousel">
      <!-- background marquee (back layer) -->
      <div class="v6-story-marquee" aria-hidden="true">
        <div class="v6-story-marquee-track">
          <span class="v6-story-marquee-text">나의 변화 스토리  ·  회원 후기  ·  Meet Our Members  ·</span>
          <span class="v6-story-marquee-text">나의 변화 스토리  ·  회원 후기  ·  Meet Our Members  ·</span>
        </div>
      </div>

      <!-- carousel (front layer) -->
      <div class="v6-story-foreground">
        <div class="v6-story-carousel-wrap">
          <button
            type="button"
            class="v6-story-card v6-story-card--prev"
            aria-label="이전 카드 선택"
            @click="goPrev"
          >
            <img :src="prevVideo.thumb" :alt="prevVideo.name" class="v6-story-thumb" />
            <div class="v6-story-name">{{ prevVideo.name }}</div>
          </button>

          <div class="v6-story-card v6-story-card--active" role="group" aria-label="선택된 카드">
            <template v-if="playing">
              <video
                ref="activeVideoEl"
                class="v6-story-thumb"
                :src="activeVideoSrc"
                playsinline
                autoplay
                muted
                controls
              />
            </template>
            <template v-else>
              <img :src="activeVideo.thumb" :alt="activeVideo.name" class="v6-story-thumb" />
              <button
                type="button"
                class="v6-story-play"
                aria-label="동영상 재생"
                @click.stop="playActive"
              >
                ▶
              </button>
            </template>
            <div class="v6-story-name">{{ activeVideo.name }}</div>
          </div>

          <button
            type="button"
            class="v6-story-card v6-story-card--next"
            aria-label="다음 카드 선택"
            @click="goNext"
          >
            <img :src="nextVideo.thumb" :alt="nextVideo.name" class="v6-story-thumb" />
            <div class="v6-story-name">{{ nextVideo.name }}</div>
          </button>
        </div>

        <div class="v6-story-arrows" aria-label="캐러셀 이동">
          <button type="button" class="v6-story-arrow" aria-label="이전" @click="goPrev">←</button>
          <button type="button" class="v6-story-arrow" aria-label="다음" @click="goNext">→</button>
        </div>

        <p class="v6-story-caption">
          나의 변화 스토리 · 회원들이 직접 말하는 PT 효과
        </p>
      </div>
    </section>

    <!-- 6. 후기 (Testimonials) — placeholder -->
    <section class="py-20 sm:py-28 bg-zinc-900">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 class="text-3xl sm:text-4xl font-bold text-white text-center mb-4 reveal">
          회원 후기
        </h2>
        <p class="text-zinc-500 text-center mb-14 reveal">
          실제 회원들의 변화 이야기
        </p>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(review, i) in testimonials"
            :key="review.name"
            class="rounded-2xl bg-zinc-950 border border-zinc-800 p-6 reveal"
          >
            <div class="flex gap-1 mb-4">
              <span v-for="n in 5" :key="n" class="text-amber-400 text-lg">★</span>
            </div>
            <p class="text-zinc-300 text-sm leading-relaxed mb-6">"{{ review.body }}"</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
                {{ review.name.charAt(0) }}
              </div>
              <div>
                <p class="text-white text-sm font-medium">{{ review.name }}</p>
                <p class="text-zinc-500 text-xs">{{ review.tag }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. 요금제 (Pricing) — placeholder -->
    <section class="py-20 sm:py-28 bg-zinc-950">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 class="text-3xl sm:text-4xl font-bold text-white text-center mb-4 reveal">
          요금제
        </h2>
        <p class="text-zinc-500 text-center mb-14 reveal">
          목표와 예산에 맞는 플랜을 선택하세요
        </p>
        <div class="grid sm:grid-cols-3 gap-6">
          <div
            v-for="(plan, i) in pricingPlans"
            :key="plan.name"
            class="rounded-2xl border p-8 flex flex-col reveal"
            :class="plan.featured
              ? 'bg-amber-500 border-amber-400 text-zinc-950'
              : 'bg-zinc-900 border-zinc-800 text-white'"
          >
            <p class="text-sm font-semibold uppercase tracking-widest mb-3" :class="plan.featured ? 'text-zinc-900' : 'text-amber-400'">
              {{ plan.name }}
            </p>
            <p class="text-4xl font-bold mb-1">{{ plan.price }}</p>
            <p class="text-sm mb-6" :class="plan.featured ? 'text-zinc-800' : 'text-zinc-500'">{{ plan.unit }}</p>
            <ul class="space-y-2 mb-8 flex-1">
              <li
                v-for="feature in plan.features"
                :key="feature"
                class="flex items-center gap-2 text-sm"
                :class="plan.featured ? 'text-zinc-900' : 'text-zinc-300'"
              >
                <svg class="w-4 h-4 shrink-0" :class="plan.featured ? 'text-zinc-900' : 'text-amber-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                {{ feature }}
              </li>
            </ul>
            <button
              type="button"
              class="w-full py-3 rounded-xl font-semibold transition-all duration-300"
              :class="plan.featured
                ? 'bg-zinc-950 text-white hover:bg-zinc-800'
                : 'bg-zinc-800 text-white hover:bg-amber-500 hover:text-zinc-950'"
              @click="inquiryOpen = true"
            >
              문의하기
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. Contact -->
    <section id="contact" class="py-20 sm:py-28 bg-zinc-900">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 class="text-3xl sm:text-4xl font-bold text-white text-center mb-14 reveal">
          오시는 길 · 문의
        </h2>
        <div class="rounded-2xl overflow-hidden border border-zinc-700 mb-8 reveal">
          <iframe
            title="스토어 위치 지도"
            :src="googleMapEmbedUrl"
            class="w-full h-[320px] sm:h-[420px]"
            style="border: 0"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          />
        </div>
        <div class="flex flex-col sm:flex-row gap-8 sm:gap-12 justify-center items-center sm:items-start text-zinc-400 reveal">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div class="text-left">
              <p class="text-white font-medium mb-1">위치</p>
              <a
                :href="googleMapLinkUrl"
                target="_blank"
                rel="noopener"
                class="hover:text-amber-400 transition"
              >
                {{ storeAddress }}
              </a>
            </div>
          </div>
          <a :href="storePhoneHref" class="flex items-center gap-4 hover:text-amber-400 transition">
            <div class="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div class="text-left">
              <p class="text-white font-medium mb-1">전화</p>
              <p>{{ storePhoneDisplay }}</p>
            </div>
          </a>
          <a href="https://pf.kakao.com/_example" target="_blank" rel="noopener" class="flex items-center gap-4 hover:text-amber-400 transition">
            <div class="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.328-1.18.24-1.556-.223l-.002-.003-1.014-1.589a8.18 8.18 0 0 1-1.793-.96C3.967 15.49 1.5 12.358 1.5 8.185 1.5 3.664 6.201 0 12 0Z" />
              </svg>
            </div>
            <div class="text-left">
              <p class="text-white font-medium mb-1">카카오톡</p>
              <p>1:1 문의하기</p>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-10 bg-zinc-950 border-t border-zinc-800">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-zinc-600 text-sm">
          {{ storeName }} · 프리미엄 퍼스널 트레이닝
        </p>
        <div class="flex gap-6 text-zinc-500 text-sm">
          <router-link to="/trainers" class="hover:text-zinc-300 transition">트레이너 소개</router-link>
          <router-link to="/reserve" class="hover:text-zinc-300 transition">예약</router-link>
          <router-link to="/dashboard" class="hover:text-zinc-300 transition">내 PT · 예약</router-link>
        </div>
      </div>
    </footer>
  </div>

  <InquiryModal v-model="inquiryOpen" />
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import { getStoreInfo } from '../api';
import { formatKoreanPhoneDisplayOrDash } from '../utils/phoneFormat';
import InquiryModal from '../components/InquiryModal.vue';

const inquiryOpen = ref(false);

const STORE_ID = 'store_default';

const storeName = ref('Gym PT');
const storeAddress = ref('서울시 강남구 테헤란로 123');
const storePhoneRaw = ref('02-0000-0000');
const storeDescription = ref('넓고 쾌적한 공간, 최신 장비, 그리고 당신에게만 집중하는 시간. 지금 바로 찾아오세요.');

const hero = ref({
  image:    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=85',
  title:    '지금 시작하세요',
  subtitle: '당신의 몸을 바꿀 시간입니다',
});

const aboutSections = ref([
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
]);

// 숫자 배지 — placeholder
const stats = ref([
  { value: '500+', label: '누적 회원' },
  { value: '98%', label: '재등록률' },
  { value: '10+', label: '전문 트레이너' },
  { value: '5년+', label: '운영 경력' },
]);

// 후기 — placeholder
const testimonials = ref([
  {
    name: '김지수',
    tag: '다이어트 3개월',
    body: '3개월 만에 체중 8kg 감량에 성공했어요. 트레이너님이 식단부터 운동까지 꼼꼼하게 관리해 주셔서 지속할 수 있었습니다.',
  },
  {
    name: '이민준',
    tag: '근력 증가 6개월',
    body: '데드리프트 50kg에서 100kg으로 올렸습니다. 체계적인 프로그램 덕분에 부상 없이 빠르게 성장할 수 있었어요.',
  },
  {
    name: '박서연',
    tag: '체형 교정 2개월',
    body: '오랜 거북목과 굽은 어깨가 눈에 띄게 개선됐습니다. 일상에서 자세가 달라졌다는 말을 많이 들어요.',
  },
]);

// 요금제 — placeholder
const pricingPlans = ref([
  {
    name: 'Basic',
    price: '30만원',
    unit: '월 8회 / 50분',
    featured: false,
    features: ['1:1 맞춤 트레이닝', '기초 체력 측정', '운동 계획서 제공'],
  },
  {
    name: 'Standard',
    price: '50만원',
    unit: '월 12회 / 50분',
    featured: true,
    features: ['1:1 맞춤 트레이닝', '정기 체성분 분석', '식단 가이드 제공', '카카오 피드백'],
  },
  {
    name: 'Premium',
    price: '80만원',
    unit: '월 20회 / 50분',
    featured: false,
    features: ['1:1 맞춤 트레이닝', '매월 상세 리포트', '식단 + 보충제 상담', '우선 예약', '24h 카카오 케어'],
  },
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

// ─── Hero slider ────────────────────────────────────────────
const activeSlide = ref(0);
const heroProgressKey = ref(0);
const heroSlide4 = ref('https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1920&q=85');
const heroSlides = computed(() => {
  // 4 dots 요구사항: 4개 슬롯 제공 (이미지 3장 기반으로 1장 반복)
  const a0 = aboutSections.value?.[0]?.image;
  const a1 = aboutSections.value?.[1]?.image;
  const base = [
    hero.value?.image,
    a0,
    a1,
    heroSlide4.value,
  ].filter(Boolean);
  // 부족하면 hero.image로 채움
  while (base.length < 4) base.push(hero.value?.image);
  return base.slice(0, 4);
});

watch(activeSlide, () => {
  heroProgressKey.value += 1;
});

let heroTimer = null;

function startHeroAuto() {
  stopHeroAuto();
  heroTimer = window.setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % 4;
  }, 4000);
}

function stopHeroAuto() {
  if (heroTimer) {
    clearInterval(heroTimer);
    heroTimer = null;
  }
}

function restartHeroAuto() {
  startHeroAuto();
}

const storePhoneDisplay = computed(() => formatKoreanPhoneDisplayOrDash(storePhoneRaw.value));
const storePhoneHref = computed(() => {
  const digits = String(storePhoneRaw.value || '').replace(/\D/g, '');
  return digits ? `tel:${digits}` : 'tel:';
});
const googleMapQuery = computed(() => encodeURIComponent(storeAddress.value || '서울시 강남구'));
const googleMapEmbedUrl = computed(() => `https://maps.google.com/maps?q=${googleMapQuery.value}&z=16&output=embed`);
const googleMapLinkUrl = computed(() => `https://www.google.com/maps/search/?api=1&query=${googleMapQuery.value}`);

// ─── Story carousel (V6 section) ────────────────────────────
const videos = [
  { name: '김지영 회원', thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80' },
  { name: '박민준 회원', thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80' },
  { name: '이수아 회원', thumb: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80' },
];
const activeIndex = ref(1); // 가운데가 기본

function mod(n, m) {
  return ((n % m) + m) % m;
}

const activeVideo = computed(() => videos[mod(activeIndex.value, videos.length)]);
const prevVideo = computed(() => videos[mod(activeIndex.value - 1, videos.length)]);
const nextVideo = computed(() => videos[mod(activeIndex.value + 1, videos.length)]);

const playing = ref(false);
const activeVideoEl = ref(null);
// 데모용: 실제 영상 URL로 교체하면 됨 (각 회원별로 다르게도 가능)
const activeVideoSrc = computed(() => 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');

function playActive() {
  playing.value = true;
  requestAnimationFrame(() => {
    activeVideoEl.value?.play?.().catch(() => {});
  });
}

function goPrev() {
  activeIndex.value = mod(activeIndex.value - 1, videos.length);
  playing.value = false;
}
function goNext() {
  activeIndex.value = mod(activeIndex.value + 1, videos.length);
  playing.value = false;
}

async function loadStoreInfoForHome() {
  try {
    const store = await getStoreInfo(STORE_ID);
    storeName.value = store.name || storeName.value;
    storeAddress.value = store.address || storeAddress.value;
    storePhoneRaw.value = store.phone || storePhoneRaw.value;
    storeDescription.value = store.description || storeDescription.value;
    if (Array.isArray(store.programs) && store.programs.length > 0) {
      programs.value = store.programs;
    }
    if (store.hero?.title) hero.value = store.hero;
    if (Array.isArray(store.aboutSections) && store.aboutSections.length === 2) {
      aboutSections.value = store.aboutSections;
    }
  } catch {
    // 스토어 조회 실패 시 기본 문구로 렌더링
  }
}

// ─── IntersectionObserver reveal ────────────────────────────
let revealObserver = null;

function setupReveal() {
  // prefers-reduced-motion: 즉시 표시
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      // 같은 콜백 배치에서 같은 부모를 중복 처리하지 않도록 추적
      const handledParents = new Set();

      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const parent = el.parentElement;

        // 같은 부모의 직계 .reveal 형제들을 stagger 처리
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

        // 단독 요소
        el.style.transitionDelay = '0ms';
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );

  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
}

onMounted(() => {
  loadStoreInfoForHome();
  setupReveal();
  startHeroAuto();
});

onUnmounted(() => {
  revealObserver?.disconnect();
  stopHeroAuto();
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

/* ─── Hero V6 ─────────────────────────────────────────────── */
/* ─── Hero slider ─────────────────────────────────────────── */
.hero-v6--slider {
  position: relative;
  height: 90vh;
  overflow: hidden;
  font-family: 'Pretendard', -apple-system, sans-serif;
}

.hero-v6__bg {
  position: absolute;
  inset: 0;
}

.hero-v6__bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.hero-v6__bg-img.is-active {
  opacity: 1;
}

.hero-v6__title {
  position: absolute;
  top: 2.5rem;
  left: 2.5rem;
  max-width: 60%;
  margin: 0;
  color: #ffffff;
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-weight: 700;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.15;
  letter-spacing: -0.01em;
  z-index: 10;
}

.hero-v6__program-card {
  position: absolute;
  bottom: 3rem;
  left: 2.5rem;
  width: 260px;
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 10;
}

.hero-v6__program-thumb {
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  object-fit: cover;
  flex-shrink: 0;
}

.hero-v6__program-meta {
  min-width: 0;
  text-align: left;
}

.hero-v6__program-name {
  margin: 0 0 0.25rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #111827;
}

.hero-v6__program-desc {
  margin: 0 0 0.4rem;
  font-size: 0.75rem;
  color: rgba(17, 24, 39, 0.65);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hero-v6__program-link {
  font-size: 0.75rem;
  text-decoration: underline;
  color: rgba(17, 24, 39, 0.9);
}

.hero-v6__footer {
  position: absolute;
  bottom: 3rem;
  right: 2.5rem;
  z-index: 10;
  text-align: right;
}

.hero-v6__subtitle {
  margin: 0 0 0.6rem;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.8rem;
  font-weight: 500;
}

.hero-v6__dots {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
}

.hero-v6__dot-btn {
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  line-height: 0;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.4);
  transition: width 0.3s ease;
  overflow: hidden;
  position: relative;
  display: inline-block;
}

.indicator-dot.active {
  width: 32px;
  background: rgba(255, 255, 255, 0.3);
}

.indicator-dot.active::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0%;
  background: #fff;
  border-radius: 4px;
  animation: progress-fill 4000ms linear forwards;
}

@keyframes progress-fill {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .hero-v6__title {
    top: 1.5rem;
    left: 1.25rem;
    max-width: 92%;
  }
  .hero-v6__program-card {
    display: none;
  }
  .hero-v6__footer {
    right: 1.25rem;
    left: 1.25rem;
    bottom: 1.5rem;
    text-align: left;
  }
}

.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #a8946a;
  margin-bottom: 1.75rem;
}
.hero-eyebrow::before {
  content: '';
  display: inline-block;
  width: 2rem;
  height: 1px;
  background: #c4a97a;
  flex-shrink: 0;
}

.hero-title {
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-size: clamp(2.8rem, 5vw, 5.25rem);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: #1c1917;
  margin-bottom: 1.75rem;
}

.hero-subtitle {
  font-size: 1.1rem;
  line-height: 1.85;
  color: #78716c;
  max-width: 30rem;
}

.hero-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.9rem 2rem;
  background: #1c1917;
  color: #faf8f3;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: background 0.22s;
}
.hero-btn-primary:hover {
  background: #3a3230;
}

.hero-btn-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.9rem 2rem;
  background: transparent;
  color: #57534e;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  border: 1px solid #d6cfc5;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: border-color 0.22s, color 0.22s;
}
.hero-btn-ghost:hover {
  border-color: #1c1917;
  color: #1c1917;
}

.hero-img-wrap {
  position: relative;
  border-radius: 1.5rem;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  box-shadow:
    0 4px 6px rgba(0,0,0,0.04),
    0 20px 60px rgba(0,0,0,0.10);
}
.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-badge {
  position: absolute;
  bottom: -1.25rem;
  left: -1.5rem;
  background: #ffffff;
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.09);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 7rem;
}
.hero-badge-num {
  font-family: 'Playfair Display', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #1c1917;
  line-height: 1;
}
.hero-badge-label {
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: #a8946a;
}

.hero-deco-circle {
  position: absolute;
  top: -3rem;
  right: -3rem;
  width: 14rem;
  height: 14rem;
  border-radius: 50%;
  background: radial-gradient(circle, #e8dfc8 0%, transparent 70%);
  opacity: 0.55;
  pointer-events: none;
  z-index: -1;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animation-delay-150 {
  animation-delay: 0.15s;
  opacity: 0;
}

.animation-delay-300 {
  animation-delay: 0.3s;
  opacity: 0;
}

/* ─── Scroll reveal (IntersectionObserver) ─────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  /* transitionDelay는 JS가 인라인으로 주입 */
}

.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ─── Green section cards ─────────────────────────────────── */
.v6-green-card {
  background: #c8f0a0;
  border-radius: 1rem;
  padding: 2rem;
  color: #111827;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.v6-green-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 44px rgba(17, 24, 39, 0.12);
}

.v6-green-card-title {
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-style: italic;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
}

.v6-green-card-desc {
  font-size: 0.85rem;
  line-height: 1.7;
  color: rgba(17, 24, 39, 0.7);
  margin: 0;
}

/* ─── Story carousel section ───────────────────────────────── */
.v6-story-carousel {
  position: relative;
  background: #2d1b5e;
  height: 100vh;
  overflow: hidden;
}

.v6-story-marquee {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center; /* vertical center */
  overflow: hidden;
  pointer-events: none;
}

.v6-story-marquee-track {
  display: flex;
  gap: 3rem;
  white-space: nowrap;
  will-change: transform;
  animation: v6-story-marquee-ltr 20s linear infinite;
}

.v6-story-marquee-text {
  font-size: clamp(5rem, 12vw, 9rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgba(123, 79, 166, 0.35); /* #7b4fa6 with alpha */
}

@keyframes v6-story-marquee-ltr {
  from { transform: translateX(-50%); }
  to { transform: translateX(0%); }
}

.v6-story-foreground {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;
  padding: 24px 16px 34px;
}

.v6-story-carousel-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: min(68vh, 640px);
}

.v6-story-card {
  position: absolute;
  aspect-ratio: 9 / 16;
  border-radius: 1.5rem;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 0 26px 90px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.14);
  padding: 0;
  cursor: pointer;
}

.v6-story-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.v6-story-name {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 14px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.45);
  color: rgba(255, 255, 255, 0.92);
  font-size: 0.95rem;
  font-weight: 600;
  text-align: center;
}

.v6-story-play {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 18px;
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.35);
  border: none;
  cursor: pointer;
}

.v6-story-card--active {
  width: 300px;
  transform: translateX(0) scale(1);
  opacity: 1;
  z-index: 3;
}

.v6-story-card--prev {
  width: 260px;
  transform: translateX(calc(-100% + 60px)) scale(0.85);
  opacity: 0.6;
  z-index: 2;
}

.v6-story-card--next {
  width: 260px;
  transform: translateX(calc(100% - 60px)) scale(0.85);
  opacity: 0.6;
  z-index: 2;
}

/* play button: only active card shows it */
.v6-story-card--prev .v6-story-play,
.v6-story-card--next .v6-story-play {
  display: none;
}

.v6-story-arrows {
  display: flex;
  gap: 10px;
  position: relative;
  z-index: 12;
}

.v6-story-arrow {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(0, 0, 0, 0.15);
  color: rgba(255, 255, 255, 0.92);
  font-weight: 700;
  transition: transform 0.2s ease, background 0.2s ease;
}

.v6-story-arrow:hover {
  background: rgba(0, 0, 0, 0.25);
  transform: translateY(-2px);
}

.v6-story-caption {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.95rem;
  text-align: center;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .reveal {
    animation: none;
    opacity: 1;
    transform: none;
    transition: none;
  }
  .animation-delay-150,
  .animation-delay-300 {
    opacity: 1;
  }
}
</style>
