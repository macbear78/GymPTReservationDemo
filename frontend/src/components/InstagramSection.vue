<template>
  <section
    class="overflow-hidden bg-white px-4 py-16 text-center sm:px-6"
    aria-labelledby="instagram-section-heading"
  >
    <!-- 헤더 -->
    <header class="relative mx-auto mb-10 max-w-[1200px] sm:mb-12">
      <p
        class="pointer-events-none absolute -left-2 top-1/2 z-0 -translate-y-1/2 select-none font-bold leading-none text-neutral-900/[0.08] sm:-left-4 text-[clamp(2.5rem,14vw,7rem)] sm:text-[clamp(3.5rem,11vw,9.375rem)]"
        aria-hidden="true"
      >
        인스타그램
      </p>
      <h2
        id="instagram-section-heading"
        class="relative z-10 text-4xl font-black leading-tight text-black sm:text-5xl"
      >
        <span class="whitespace-normal sm:whitespace-nowrap">
          인스타그램에서
          <span class="underline decoration-2 decoration-black underline-offset-4 sm:underline-offset-[10px]">
            소식 받기
          </span>
        </span>
      </h2>
    </header>

    <!-- 갤러리: 5열 × 2행, 가운데 col3 row-span-2 -->
    <div
      class="mx-auto grid max-w-[1200px] grid-cols-5 gap-1 auto-rows-[140px] sm:gap-2 sm:auto-rows-[260px]"
    >
      <button
        v-for="(post, index) in items"
        :key="post.id"
        type="button"
        class="group relative block min-h-0 w-full cursor-pointer overflow-hidden border-0 bg-[#2d2d2d] p-0 text-left outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-black"
        :class="cellClass(index)"
        @click="emit('open-post', post)"
      >
        <span
          class="block h-full w-full origin-center transition duration-300 ease-out group-hover:scale-[1.03] group-hover:brightness-110"
        >
          <img
            v-if="post.image"
            :src="post.image"
            :alt="post.alt || '인스타그램 사진'"
            class="h-full w-full object-cover"
            loading="lazy"
          />
        </span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

/** @type {{ id: number, image: string, alt?: string, isMain?: boolean }[]} */
const DEFAULT_POSTS = [
  { id: 1, image: '', alt: '헬스장 사진 1', isMain: false },
  { id: 2, image: '', alt: '헬스장 사진 2', isMain: false },
  { id: 3, image: '', alt: '헬스장 사진 3', isMain: true },
  { id: 4, image: '', alt: '헬스장 사진 4', isMain: false },
  { id: 5, image: '', alt: '헬스장 사진 5', isMain: false },
  { id: 6, image: '', alt: '헬스장 사진 6', isMain: false },
  { id: 7, image: '', alt: '헬스장 사진 7', isMain: false },
  { id: 8, image: '', alt: '헬스장 사진 8', isMain: false },
  { id: 9, image: '', alt: '헬스장 사진 9', isMain: false },
];

const props = defineProps({
  /** 9개 권장 — 레이아웃 순서는 배열 인덱스 기준 */
  posts: {
    type: Array,
    default: null,
  },
});

const emit = defineEmits(['open-post']);

const items = computed(() => {
  if (props.posts?.length === 9) return props.posts;
  return DEFAULT_POSTS;
});

/** 그리드 위치 (0-based 인덱스) */
const CELL_LAYOUT = [
  'col-start-1 row-start-1 h-full',
  'col-start-2 row-start-1 h-full',
  'col-start-3 row-start-1 row-span-2 h-full min-h-0',
  'col-start-4 row-start-1 h-full',
  'col-start-5 row-start-1 h-full',
  'col-start-1 row-start-2 h-full',
  'col-start-2 row-start-2 h-full',
  'col-start-4 row-start-2 h-full',
  'col-start-5 row-start-2 h-full',
];

function cellClass(index) {
  return CELL_LAYOUT[index] || '';
}
</script>
