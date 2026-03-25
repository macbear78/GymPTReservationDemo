<template>
  <section
    class="bg-[#f3f4f6] px-4 py-20 sm:px-6"
    aria-labelledby="analytics-workout-heading"
  >
    <div
      class="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-0"
    >
      <!-- 왼쪽 60%: 이미지 + 플로팅 카드 -->
      <div class="relative w-full shrink-0 lg:w-3/5 lg:pr-6">
        <div
          class="relative h-[500px] w-full overflow-hidden bg-neutral-300 sm:h-[540px]"
        >
          <img
            v-if="imageSrc"
            :src="imageSrc"
            alt="트레이닝 분석"
            class="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <!-- 오버레이 카드 -->
        <div
          class="absolute bottom-10 left-0 z-10 w-[240px] max-w-[calc(100vw-2rem)] -rotate-3 rounded-xl bg-white p-5 shadow-lg shadow-black/10 sm:bottom-14 sm:-left-10 sm:-rotate-6"
        >
          <p class="text-sm font-bold text-neutral-900">트레이닝 유형</p>

          <div class="mt-3 flex flex-wrap gap-4 text-xs font-medium text-neutral-700">
            <span class="inline-flex items-center gap-1.5">
              <span class="h-2.5 w-2.5 shrink-0 rounded-full bg-[#7c3aed]" />
              웨이트
            </span>
            <span class="inline-flex items-center gap-1.5">
              <span class="h-2.5 w-2.5 shrink-0 rounded-full bg-[#e9d5ff]" />
              러닝
            </span>
          </div>

          <div class="relative mx-auto mt-4 h-40 w-40">
            <svg
              viewBox="0 0 160 160"
              class="h-full w-full"
              aria-hidden="true"
            >
              <defs>
                <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#7c3aed" />
                  <stop offset="100%" stop-color="#c4b5fd" />
                </linearGradient>
              </defs>
              <!-- 배경 링 -->
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke="#e9d5ff"
                stroke-width="18"
              />
              <!-- 진행 원호 -->
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="none"
                :stroke="`url(#${gradientId})`"
                stroke-width="18"
                stroke-linecap="round"
                :stroke-dasharray="strokeDasharray"
                stroke-dashoffset="0"
                transform="rotate(-90 80 80)"
              />
              <text
                x="80"
                y="76"
                text-anchor="middle"
                fill="#171717"
                font-size="22"
                font-weight="900"
              >
                48.2
              </text>
              <text
                x="80"
                y="98"
                text-anchor="middle"
                fill="#6b7280"
                font-size="12"
                font-weight="600"
              >
                웨이트
              </text>
            </svg>
          </div>
        </div>
      </div>

      <!-- 오른쪽 40%: 텍스트 -->
      <div
        class="flex w-full flex-col justify-center lg:w-2/5 lg:pl-12 xl:pl-16"
      >
        <h2
          id="analytics-workout-heading"
          class="text-4xl font-black leading-tight text-black sm:text-5xl"
        >
          <span class="block">데이터로 설계한</span>
          <span class="block">분석 기반</span>
          <span class="block">운동 프로그램</span>
        </h2>
        <p class="mt-6 text-base leading-relaxed text-gray-700 sm:text-lg">
          노하우 많은 트레이너가 다양한 연구·데이터를 바탕으로 프로그램을 구성합니다.
          회원 맞춤 솔루션으로 목표에 더 빠르게 가까이 갈 수 있도록 돕습니다.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, useId } from 'vue';

const props = defineProps({
  /** 메인 이미지 URL — 비우면 회색 placeholder */
  image: {
    type: String,
    default: '',
  },
});

const imageSrc = computed(() => props.image?.trim() || '');

const gradientId = `donutGrad-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

const R = 60;
const circumference = 2 * Math.PI * R;
const progress = 0.482;
const strokeDasharray = computed(() => {
  const filled = circumference * progress;
  return `${filled} ${circumference}`;
});
</script>
