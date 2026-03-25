<template>
  <section class="py-14 bg-zinc-900 border-y border-zinc-800">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        <div v-for="stat in stats" :key="stat.label" class="reveal">
          <p class="text-4xl sm:text-5xl font-bold text-amber-400 mb-2">{{ stat.value }}</p>
          <p class="text-zinc-400 text-sm">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  stats: {
    type: Array,
    required: true,
  },
});
</script>
