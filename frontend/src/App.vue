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
      <router-view />
    </main>
    <footer class="border-t border-white/10 bg-[#0a0a0a] py-6 mt-auto">
      <div class="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
        1:1 PT 예약 · Personal Training
      </div>
    </footer>
    <Transition name="scroll-top-fade">
      <button
        v-if="showScrollTop"
        type="button"
        class="scroll-top-btn"
        aria-label="맨 위로"
        @click="scrollToTop"
      >
        ↑
      </button>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
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

const showScrollTop = ref(false);

function onScroll() {
  showScrollTop.value = window.scrollY > 400;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', onScroll));
</script>

<style scoped>
.scroll-top-btn {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 190;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: rgba(20, 20, 20, 0.90);
  backdrop-filter: blur(6px);
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  transition: background 0.2s, transform 0.2s;
}

.scroll-top-btn:hover {
  background: var(--brand-primary, #1abc9c);
  transform: scale(1.1);
}

.scroll-top-fade-enter-active,
.scroll-top-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.scroll-top-fade-enter-from,
.scroll-top-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>

