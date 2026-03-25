<template>
  <footer class="py-10 bg-zinc-950 border-t border-zinc-800">
    <div
      class="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4"
    >
      <p class="text-zinc-600 text-sm">{{ storeName }} · {{ tagline }}</p>
      <div class="flex gap-6 text-zinc-500 text-sm">
        <router-link to="/trainers" class="hover:text-zinc-300 transition">트레이너 소개</router-link>
        <router-link to="/reserve" class="hover:text-zinc-300 transition">예약</router-link>
        <router-link to="/dashboard" class="hover:text-zinc-300 transition">내 PT · 예약</router-link>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  storeName: { type: String, required: true },
  tagline: {
    type: String,
    default: '프리미엄 퍼스널 트레이닝',
  },
});
</script>
