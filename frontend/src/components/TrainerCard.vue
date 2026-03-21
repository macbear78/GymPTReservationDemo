<template>
  <button
    type="button"
    :class="[
      'w-full text-left p-5 rounded-xl border-2 transition duration-200',
      selected
        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/20'
        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
    ]"
    @click="$emit('select', trainer)"
  >
    <div class="flex items-center gap-4">
      <div
        class="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0"
        :class="avatarClass"
      >
        {{ trainer.name.charAt(0) }}
      </div>
      <div class="min-w-0">
        <div class="font-semibold text-slate-800">{{ trainer.name }}</div>
        <div class="text-sm text-slate-500">{{ trainer.specialty }}</div>
      </div>
      <div v-if="selected" class="ml-auto text-primary-600 shrink-0">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  trainer: { type: Object, required: true },
  selected: { type: Boolean, default: false },
});

const AVATAR_COLORS = {
  mike: 'bg-amber-500',
  anna: 'bg-rose-500',
  chris: 'bg-emerald-500',
  sarah: 'bg-violet-500',
  james: 'bg-blue-500',
  emma: 'bg-teal-500',
  david: 'bg-orange-500',
  lisa: 'bg-pink-500',
  ryan: 'bg-indigo-500',
  minji: 'bg-cyan-500',
  tom: 'bg-lime-600',
};

const avatarClass = computed(() => {
  return AVATAR_COLORS[(props.trainer.id || '').toLowerCase()] || 'bg-slate-500';
});
</script>
