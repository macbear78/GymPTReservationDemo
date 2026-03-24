<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1 pt-[72px]">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="border-t border-slate-200 bg-white py-6 mt-auto">
      <div class="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
        1:1 PT 예약 · Personal Training
      </div>
    </footer>
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
