<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-slate-300">날짜 선택</label>
    <input
      type="date"
      :value="modelValue"
      :min="minDate"
      class="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#1e1e1e] text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
      @input="$emit('update:modelValue', ($event.target).value)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';

defineProps({
  modelValue: { type: String, default: '' },
});

defineEmits(['update:modelValue']);

const minDate = computed(() => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
});
</script>
