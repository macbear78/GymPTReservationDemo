<template>
  <section
    class="flex min-h-[520px] flex-col bg-[#f9fafb] lg:flex-row"
    aria-labelledby="break-limits-heading"
  >
    <!-- 왼쪽: 풀 높이 이미지 -->
    <div
      class="relative h-[300px] w-full shrink-0 lg:h-auto lg:min-h-[520px] lg:w-1/2 lg:flex-1"
    >
      <img
        v-if="leftSrc"
        :src="leftSrc"
        alt=""
        class="absolute inset-0 h-full w-full object-cover object-[center_top]"
        loading="lazy"
      />
      <div
        v-else
        class="absolute inset-0 bg-[#e5e7eb]"
        aria-hidden="true"
      />
    </div>

    <!-- 오른쪽: 상단 이미지 + 텍스트 -->
    <div class="flex w-full flex-col lg:w-1/2 lg:flex-1">
      <div class="relative h-[280px] shrink-0 sm:h-[300px]">
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
          v-if="rightSrc"
          :src="rightSrc"
          alt=""
          class="h-full w-full object-cover"
          loading="lazy"
        />
        <div
          v-else
          class="h-full w-full bg-neutral-600"
          aria-hidden="true"
        />
      </div>

      <div class="flex flex-1 flex-col justify-center px-4 pb-8 pt-8 pl-2 sm:pr-6 lg:pl-4">
        <h2
          id="break-limits-heading"
          class="text-3xl font-bold text-black sm:text-4xl"
        >
          한계를 넘어서세요
        </h2>
        <p class="mt-4 text-base leading-relaxed text-gray-600 sm:text-lg">
          트레이닝과 식단 플랜을 함께 설계해 다음 시즌까지 몸의 컨디션을 끌어올립니다.
          과정 전반을 함께 걸으며 매 세션에서 성장할 수 있도록 도전 과제를 드립니다.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  /** 왼쪽 풀 높이 이미지 */
  leftImage: {
    type: String,
    default: '',
  },
  /** 오른쪽 상단 이미지 */
  rightImage: {
    type: String,
    default: '',
  },
});

const leftSrc = computed(() => props.leftImage?.trim() || '');
const rightSrc = computed(() => props.rightImage?.trim() || '');
</script>
