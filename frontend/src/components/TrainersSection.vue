<template>
  <section
    class="relative overflow-x-hidden bg-white px-4 py-20 text-center sm:px-6"
    aria-labelledby="trainers-section-heading"
  >
    <!-- 헤더 -->
    <header class="relative mx-auto mb-12 max-w-5xl sm:mb-16">
      <p
        class="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-bold leading-none text-neutral-900/[0.09] text-[clamp(2.75rem,11vw,8rem)]"
        aria-hidden="true"
      >
        트레이너
      </p>
      <h2
        id="trainers-section-heading"
        class="relative z-10 mx-auto max-w-4xl text-4xl font-black leading-tight text-black sm:text-5xl"
      >
        <span class="block">전문</span>
        <span class="block">퍼스널 트레이너</span>
        <span class="block">팀을 만나보세요</span>
      </h2>
    </header>

    <!-- 카드 그리드 -->
    <div
      class="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <article
        v-for="trainer in items"
        :key="trainer.id"
        class="flex flex-col"
      >
        <div
          class="relative overflow-hidden rounded-lg bg-[#e5e5e5]"
          :style="{ aspectRatio: '1 / 1' }"
        >
          <img
            v-if="trainer.image"
            :src="trainer.image"
            :alt="trainer.name"
            class="h-full w-full object-cover object-top"
            loading="lazy"
          />
          <button
            type="button"
            class="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center bg-[#e63946] text-xl font-light leading-none text-white transition hover:bg-[#c82f3a]"
            :aria-label="`${trainer.name} 상세 보기`"
            @click="emit('select-trainer', trainer)"
          >
            +
          </button>
        </div>
        <div class="pt-4 pb-2 text-center">
          <h3 class="text-lg font-black text-black">
            {{ trainer.name }}
          </h3>
          <p class="mt-1 text-sm tracking-wide text-gray-500">
            {{ trainer.role }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

/** @type {{ id: number, name: string, role: string, image: string }[]} */
const DEFAULT_TRAINERS = [
  { id: 1, name: '김준호', role: '퍼스널 코치', image: '' },
  { id: 2, name: '이서연', role: '퍼스널 코치', image: '' },
  { id: 3, name: '박도윤', role: '퍼스널 코치', image: '' },
];

const props = defineProps({
  trainers: {
    type: Array,
    default: null,
  },
});

const emit = defineEmits(['select-trainer']);

const items = computed(() =>
  props.trainers?.length ? props.trainers : DEFAULT_TRAINERS
);
</script>
