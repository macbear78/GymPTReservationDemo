<template>
  <section
    class="overflow-x-hidden bg-[#0d0d0d] px-4 py-16 text-white sm:px-6 sm:py-20"
    aria-labelledby="classes-slider-heading"
  >
    <!-- 헤더 행 -->
    <div class="relative mx-auto mb-10 max-w-7xl sm:mb-12">
      <div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div class="relative w-full sm:w-auto">
          <p
            class="pointer-events-none absolute -left-1 -top-4 z-0 select-none font-bold leading-none text-white/[0.10] sm:-top-6 sm:text-[clamp(3rem,10vw,6.5rem)] text-[clamp(2.5rem,12vw,4rem)]"
            aria-hidden="true"
          >
            클래스
          </p>
          <h2
            id="classes-slider-heading"
            class="relative z-10 text-3xl font-bold text-white sm:text-4xl"
          >
            저희의 모든 강좌를 살펴보세요
          </h2>
        </div>

        <div class="relative z-10 flex shrink-0 gap-2 self-end sm:self-auto">
          <button
            type="button"
            class="flex h-12 w-12 items-center justify-center bg-white text-xl font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
            aria-label="이전"
            :disabled="currentIndex <= 0"
            @click="prev"
          >
            &lt;
          </button>
          <button
            type="button"
            class="flex h-12 w-12 items-center justify-center bg-white text-xl font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
            aria-label="다음"
            :disabled="currentIndex >= maxIndex"
            @click="next"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>

    <!-- 슬라이더: 뷰포트 기준 약 2.5장 노출 -->
    <div
      ref="viewportRef"
      class="relative mx-auto w-full max-w-7xl overflow-hidden"
    >
      <div class="flex gap-4" :style="trackStyle">
        <article
          v-for="item in items"
          :key="item.id"
          data-class-card
          class="shrink-0"
          :style="{ width: `${cardWidthPx}px` }"
        >
          <div
            class="relative w-full overflow-hidden rounded-lg bg-zinc-800"
            :style="{ aspectRatio: '3 / 4' }"
          >
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.title"
              class="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div class="pt-4">
            <h3 class="text-lg font-bold text-white">{{ item.title }}</h3>
            <p class="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-400">
              {{ item.description }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
} from 'vue';

const GAP_PX = 16; // gap-4

/** @type {{ id: number, title: string, description: string, image: string }[]} */
const DEFAULT_CLASSES = [
  {
    id: 1,
    title: '고강도 훈련',
    description:
      '순간 최대 출력을 높이는 인터벌과 서킷으로 체력과 지구력을 함께 끌어올립니다.',
    image: '',
  },
  {
    id: 2,
    title: '역도',
    description:
      '올바른 리프팅 폼과 중량 스킬을 단계적으로 익혀 부상 없이 힘을 키웁니다.',
    image: '',
  },
  {
    id: 3,
    title: '크로스핏',
    description:
      '다양한 기능성 동작을 조합해 전신을 쓰는 고강도 트레이닝을 경험합니다.',
    image: '',
  },
  {
    id: 4,
    title: '요가',
    description: '호흡과 스트레칭으로 유연성과 회복, 집중력을 가지런히 다듬습니다.',
    image: '',
  },
];

const props = defineProps({
  /** 강좌 목록 — image에 URL을 넣으면 표시 */
  classes: {
    type: Array,
    default: null,
  },
});

const items = computed(() =>
  props.classes?.length ? props.classes : DEFAULT_CLASSES
);

/** 2.5장 노출 → (뷰폭 − 2×gap) / 2.5 */
const VISIBLE_SLOT_COUNT = 3;

const currentIndex = ref(0);
const viewportRef = ref(null);
const viewportWidthPx = ref(0);

const maxIndex = computed(() =>
  Math.max(0, items.value.length - VISIBLE_SLOT_COUNT)
);

const cardWidthPx = computed(() => {
  const w = viewportWidthPx.value;
  if (w <= 0) return 0;
  return Math.max(0, (w - 2 * GAP_PX) / 2.5);
});

const cardStepPx = computed(() => cardWidthPx.value + GAP_PX);

function prev() {
  if (currentIndex.value > 0) currentIndex.value -= 1;
}

function next() {
  if (currentIndex.value < maxIndex.value) currentIndex.value += 1;
}

const trackStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * cardStepPx.value}px)`,
  transition: 'transform 0.4s ease',
}));

function measureViewport() {
  nextTick(() => {
    const el = viewportRef.value;
    viewportWidthPx.value = el ? el.clientWidth : 0;
  });
}

let ro;
onMounted(() => {
  measureViewport();
  window.addEventListener('resize', measureViewport);
  if (viewportRef.value && typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(() => measureViewport());
    ro.observe(viewportRef.value);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', measureViewport);
  ro?.disconnect();
});

watch(items, () => {
  currentIndex.value = Math.min(currentIndex.value, maxIndex.value);
  measureViewport();
});

watch(maxIndex, (m) => {
  if (currentIndex.value > m) currentIndex.value = m;
});
</script>
