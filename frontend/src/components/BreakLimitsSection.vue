<template>
  <section
    class="break-limits flex min-h-[520px] flex-col bg-[#f9fafb] lg:flex-row"
    aria-labelledby="break-limits-heading"
  >
    <!-- 왼쪽: 풀 높이 이미지 -->
    <div
      v-scroll-animate
      data-animate="fade-right"
      class="relative h-[300px] w-full shrink-0 overflow-hidden bg-neutral-200 lg:h-auto lg:min-h-[520px] lg:w-1/2 lg:flex-1"
    >
      <img
        :src="leftSrc"
        :alt="leftAlt"
        class="block h-full w-full object-cover object-top"
        loading="lazy"
        referrerpolicy="no-referrer"
        decoding="async"
      />
    </div>

    <!-- 오른쪽: 상단 이미지 + 텍스트 -->
    <div class="flex w-full flex-col lg:w-1/2 lg:flex-1">
      <div
        v-scroll-animate
        data-animate="fade-down"
        class="relative h-[280px] shrink-0 sm:h-[300px]"
      >
        <div
          class="pointer-events-none absolute right-0 top-0 z-10 flex flex-col"
          aria-hidden="true"
        >
          <div class="h-[7px] w-[70px] max-sm:w-[60px] bg-[#facc15]" />
          <div class="h-[7px] w-[70px] max-sm:w-[60px] bg-[#fb923c]" />
          <div class="h-[7px] w-[70px] max-sm:w-[60px] bg-[#a855f7]" />
          <div class="h-[7px] w-[80px] max-sm:w-[68px] bg-[#d8b4fe]" />
        </div>
        <img
          :src="rightSrc"
          :alt="rightAlt"
          class="block h-full w-full object-cover"
          loading="lazy"
          referrerpolicy="no-referrer"
          decoding="async"
        />
      </div>

      <div
        v-scroll-animate
        data-animate="fade-left"
        data-delay="300"
        class="flex flex-1 flex-col justify-center px-4 pb-8 pt-8 pl-2 sm:pr-6 lg:pl-4"
      >
        <h2
          id="break-limits-heading"
          class="break-limits__title text-3xl font-bold text-black sm:text-4xl"
        >
          한계를 넘어서세요
        </h2>
        <p class="break-limits__desc mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
          트레이닝과 식단 플랜을 함께 설계해 다음 시즌까지 몸의 컨디션을 끌어올립니다.
          과정 전반을 함께 걸으며 매 세션에서 성장할 수 있도록 도전 과제를 드립니다.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

/* 기본값: 식단·건강식 테마 (prop으로 덮어쓰기 가능) */
const DEFAULT_LEFT_IMAGE =
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=85';
const DEFAULT_RIGHT_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=85';
const DEFAULT_LEFT_ALT = '다양한 채소와 건강 식재료가 담긴 식단';
const DEFAULT_RIGHT_ALT = '신선한 샐러드와 균형 잡힌 한 끼';

const props = defineProps({
  /** 왼쪽 풀 높이 이미지 — 비우면 기본 이미지 */
  leftImage: {
    type: String,
    default: '',
  },
  /** 왼쪽 이미지 설명 — 비우면 기본 문구 */
  leftImageAlt: {
    type: String,
    default: '',
  },
  /** 오른쪽 상단 이미지 — 비우면 기본 이미지 */
  rightImage: {
    type: String,
    default: '',
  },
  /** 오른쪽 이미지 설명 — 비우면 기본 문구 */
  rightImageAlt: {
    type: String,
    default: '',
  },
});

const leftSrc = computed(() => props.leftImage?.trim() || DEFAULT_LEFT_IMAGE);
const rightSrc = computed(() => props.rightImage?.trim() || DEFAULT_RIGHT_IMAGE);
const leftAlt = computed(() => props.leftImageAlt?.trim() || DEFAULT_LEFT_ALT);
const rightAlt = computed(() => props.rightImageAlt?.trim() || DEFAULT_RIGHT_ALT);
</script>

<style scoped>
.break-limits__title {
  font-size: clamp(2rem, 4.2vw, 3.5rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1.12;
}
.break-limits__desc {
  font-size: 18px;
  line-height: 1.65;
  max-width: 40rem;
}
@media (max-width: 640px) {
  .break-limits__desc {
    font-size: 17px;
  }
}
</style>
