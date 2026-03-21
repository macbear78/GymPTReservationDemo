<template>
  <div class="space-y-2">
    <label class="block text-sm font-medium text-slate-700">Time slot</label>
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
      <button
        v-for="slot in timeSlots"
        :key="slot"
        type="button"
        :disabled="!availableSlots.includes(slot)"
        :class="[
          'py-3 rounded-xl font-medium transition',
          modelValue === slot
            ? 'bg-primary-500 text-white ring-2 ring-primary-500 ring-offset-2'
            : availableSlots.includes(slot)
              ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200'
              : 'bg-slate-50 text-slate-400 cursor-not-allowed border border-slate-200',
        ]"
        @click="availableSlots.includes(slot) && $emit('update:modelValue', slot)"
      >
        {{ slot }}
      </button>
    </div>
  </div>
</template>

<script setup>
const TIME_SLOTS = ['06:00', '07:00', '08:00', '09:00', '18:00', '19:00', '20:00'];

defineProps({
  modelValue: { type: String, default: '' },
  availableSlots: {
    type: Array,
    default: () => ['06:00', '07:00', '08:00', '09:00', '18:00', '19:00', '20:00'],
  },
});

defineEmits(['update:modelValue']);

const timeSlots = TIME_SLOTS;
</script>
