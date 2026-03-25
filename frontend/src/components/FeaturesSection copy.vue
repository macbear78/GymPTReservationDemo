<template>
  <section class="bg-white px-4 py-16 sm:px-6" aria-labelledby="features-section-heading">
    <h2 id="features-section-heading" class="sr-only">
      특징
    </h2>
    <div
      class="mx-auto max-w-6xl overflow-hidden rounded-xl border border-gray-200"
    >
      <div class="grid grid-cols-1 md:grid-cols-3">
        <div
          v-for="(feature, index) in items"
          :key="feature.id"
          v-scroll-animate
          data-animate="fade-up"
          :data-delay="String(index * 150)"
          class="flex flex-col items-center border-b border-gray-200 p-10 text-center last:border-b-0 md:border-b-0 md:border-r md:border-gray-200 md:p-12 md:last:border-r-0"
        >
          <div
            class="mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-[#f3f4f6] text-gray-400"
          >
            <svg
              v-if="feature.icon === 'warning'"
              class="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path
                d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <svg
              v-else-if="feature.icon === 'clock'"
              class="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <svg
              v-else-if="feature.icon === 'check'"
              class="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>

          <h3 class="mb-4 text-lg font-bold text-black">
            {{ feature.title }}
          </h3>
          <p class="text-sm leading-relaxed text-gray-500 sm:text-base">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const DEFAULT_FEATURES = [
  {
    id: 1,
    icon: 'warning',
    title: '소수 정예 수업',
    description:
      '퍼스널 트레이닝의 본질에 맞게 한 번에 적은 수의 회원만 모십니다. 그래서 한 분에게 시간과 에너지를 더 깊게 쏟을 수 있습니다.',
  },
  {
    id: 2,
    icon: 'clock',
    title: '24시간 케어',
    description:
      '언제 어디서든 여정을 함께합니다. 걸음마다 옆에 있다는 느낌이 들도록 돕고, 저희도 같은 길을 걸어 본 사람으로서 공감합니다.',
  },
  {
    id: 3,
    icon: 'check',
    title: '진짜 경험에서 온 코칭',
    description:
      '지금 회원님이 선택하신 길을 저희도 먼저 걸어 왔습니다. 이상적인 몸과 일상에 더 가까워지고 싶다면, 그 여정을 함께하겠습니다.',
  },
];

const props = defineProps({
  features: {
    type: Array,
    default: null,
  },
});

const items = computed(() =>
  props.features?.length ? props.features : DEFAULT_FEATURES
);
</script>
