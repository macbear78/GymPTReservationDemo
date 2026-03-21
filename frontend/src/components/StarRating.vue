<template>
  <div class="inline-flex items-center gap-1" :class="$attrs.class">
    <span
      v-for="i in 5"
      :key="i"
      class="text-amber-400"
      :class="i <= fullStars ? 'opacity-100' : i === fullStars + 1 && halfStar ? 'opacity-80' : 'opacity-30'"
    >
      <svg
        v-if="i <= fullStars || (i === fullStars + 1 && halfStar)"
        class="w-4 h-4 sm:w-5 sm:h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      <svg
        v-else
        class="w-4 h-4 sm:w-5 sm:h-5"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </span>
    <span v-if="showValue" class="ml-1 text-sm font-medium text-slate-600">{{ value }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: { type: Number, default: 0 },
  showValue: { type: Boolean, default: true },
});

const fullStars = computed(() => Math.floor(props.value));
const halfStar = computed(() => props.value % 1 >= 0.5);
</script>
