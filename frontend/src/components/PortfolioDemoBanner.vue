<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const BANNER_SESSION_KEY = 'gympt-portfolio-demo-banner-dismissed';

const root = ref(null);
const emit = defineEmits(['close', 'height']);

let ro;

function measure() {
  if (!root.value) return;
  emit('height', root.value.offsetHeight);
}

function dismiss() {
  try {
    sessionStorage.setItem(BANNER_SESSION_KEY, '1');
  } catch {
    /* ignore */
  }
  emit('close');
}

onMounted(() => {
  if (!root.value) return;
  ro = new ResizeObserver(() => measure());
  ro.observe(root.value);
  measure();
});

onUnmounted(() => {
  ro?.disconnect();
});
</script>

<template>
  <div
    ref="root"
    class="portfolio-demo-banner"
    role="region"
    aria-label="포트폴리오 데모 안내"
  >
    <p class="portfolio-demo-banner__text">
      🎯 포트폴리오 데모 사이트입니다 — 제작 문의는 숨고 프로필을 확인해 주세요
    </p>
    <button
      type="button"
      class="portfolio-demo-banner__close"
      aria-label="안내 배너 닫기"
      @click="dismiss"
    >
      ×
    </button>
  </div>
</template>

<style scoped>
.portfolio-demo-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 250;
  box-sizing: border-box;
  background: #1abc9c;
  padding: max(10px, env(safe-area-inset-top)) 48px max(10px, env(safe-area-inset-bottom)) 16px;
  padding-left: max(16px, env(safe-area-inset-left));
  padding-right: max(48px, calc(12px + env(safe-area-inset-right)));
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
}

.portfolio-demo-banner__text {
  margin: 0;
  max-width: min(100%, 56rem);
  font-size: 13px;
  line-height: 1.45;
  font-weight: 500;
  color: #fff;
  text-align: center;
}

.portfolio-demo-banner__close {
  position: absolute;
  top: 50%;
  right: max(8px, env(safe-area-inset-right));
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.12);
  color: #fff;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s ease;
}

.portfolio-demo-banner__close:hover {
  background: rgba(0, 0, 0, 0.2);
}

.portfolio-demo-banner__close:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

@media (max-width: 480px) {
  .portfolio-demo-banner {
    padding-left: 10px;
    padding-right: 44px;
    align-items: flex-start;
    min-height: auto;
  }

  .portfolio-demo-banner__text {
    text-align: left;
    padding-top: 2px;
    padding-bottom: 2px;
  }

  .portfolio-demo-banner__close {
    top: 10px;
    transform: none;
  }
}
</style>
