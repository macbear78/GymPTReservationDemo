<template>
  <section class="py-14 bg-zinc-900 border-y border-zinc-800">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="home-v6-stat-item"
          v-scroll-animate
          data-animate="fade-up"
          :data-delay="String(index * 100)"
        >
          <p class="home-v6-stat-value font-bold text-amber-400 mb-2">{{ stat.value }}</p>
          <p class="home-v6-stat-label text-zinc-400">{{ stat.label }}</p>
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

<style scoped>
.home-v6-stat-value {
  font-size: clamp(2.75rem, 6.5vw, 4.25rem);
  line-height: 1;
  letter-spacing: -0.03em;
}
.home-v6-stat-label {
  font-size: 16px;
  line-height: 1.45;
  font-weight: 500;
}
@media (max-width: 640px) {
  .home-v6-stat-value {
    font-size: clamp(2.25rem, 8vw, 3.25rem);
  }
  .home-v6-stat-label {
    font-size: 15px;
  }
}
</style>
