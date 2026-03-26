<template>
  <div class="min-h-screen flex flex-col">
    <DemoGuideModal />
    <PortfolioDemoBanner
      v-if="demoBannerVisible"
      @close="onDemoBannerClose"
      @height="onDemoBannerHeight"
    />
    <Header :top-offset="headerTopPx" />
    <main class="flex-1" :style="{ paddingTop: `${mainPaddingTop}px` }">
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
import { ref, computed } from 'vue';
import Header from './components/Header.vue';
import PortfolioDemoBanner from './components/PortfolioDemoBanner.vue';
import DemoGuideModal from './components/DemoGuideModal.vue';

/** Must match PortfolioDemoBanner.vue */
const PORTFOLIO_DEMO_BANNER_SESSION_KEY = 'gympt-portfolio-demo-banner-dismissed';

const HEADER_BAR_PX = 72;

const demoBannerVisible = ref(
  typeof sessionStorage !== 'undefined' &&
  sessionStorage.getItem(PORTFOLIO_DEMO_BANNER_SESSION_KEY) === '1'
    ? false
    : true
);

const bannerTopOffset = ref(0);

function onDemoBannerHeight(h) {
  bannerTopOffset.value = demoBannerVisible.value ? h : 0;
}

function onDemoBannerClose() {
  demoBannerVisible.value = false;
  bannerTopOffset.value = 0;
}

const headerTopPx = computed(() => bannerTopOffset.value);
const mainPaddingTop = computed(() => HEADER_BAR_PX + bannerTopOffset.value);
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
