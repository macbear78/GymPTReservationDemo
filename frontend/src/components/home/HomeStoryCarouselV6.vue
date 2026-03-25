<template>
  <section class="v6-story-carousel">
    <div class="v6-story-marquee" aria-hidden="true">
      <div class="v6-story-marquee-track">
        <span class="v6-story-marquee-text">{{ marqueeText }}</span>
        <span class="v6-story-marquee-text">{{ marqueeText }}</span>
      </div>
    </div>

    <div class="v6-story-foreground">
      <div class="v6-story-carousel-wrap">
        <button
          type="button"
          class="v6-story-card v6-story-card--prev"
          aria-label="이전 카드 선택"
          @click="goPrev"
        >
          <img :src="prevVideo.thumb" :alt="prevVideo.name" class="v6-story-thumb" />
          <div class="v6-story-name">{{ prevVideo.name }}</div>
        </button>

        <div class="v6-story-card v6-story-card--active" role="group" aria-label="선택된 카드">
          <template v-if="playing">
            <video
              ref="activeVideoEl"
              class="v6-story-thumb"
              :src="activeVideoSrc"
              playsinline
              autoplay
              muted
              controls
            />
          </template>
          <template v-else>
            <img :src="activeVideo.thumb" :alt="activeVideo.name" class="v6-story-thumb" />
            <button
              type="button"
              class="v6-story-play"
              aria-label="동영상 재생"
              @click.stop="playActive"
            >
              ▶
            </button>
          </template>
          <div class="v6-story-name">{{ activeVideo.name }}</div>
        </div>

        <button
          type="button"
          class="v6-story-card v6-story-card--next"
          aria-label="다음 카드 선택"
          @click="goNext"
        >
          <img :src="nextVideo.thumb" :alt="nextVideo.name" class="v6-story-thumb" />
          <div class="v6-story-name">{{ nextVideo.name }}</div>
        </button>
      </div>

      <div class="v6-story-arrows" aria-label="캐러셀 이동">
        <button type="button" class="v6-story-arrow" aria-label="이전" @click="goPrev">←</button>
        <button type="button" class="v6-story-arrow" aria-label="다음" @click="goNext">→</button>
      </div>

      <p class="v6-story-caption">
        {{ caption }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  videos: {
    type: Array,
    default: null,
  },
  /** 데모 영상 URL — 필요 시 교체 */
  demoVideoSrc: {
    type: String,
    default: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
  marqueeText: {
    type: String,
    default: '나의 변화 스토리  ·  회원 후기  ·  회원을 만나보세요  ·',
  },
  caption: {
    type: String,
    default: '나의 변화 스토리 · 회원들이 직접 말하는 PT 효과',
  },
});

const DEFAULT_VIDEOS = [
  { name: '김지영 회원', thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80' },
  { name: '박민준 회원', thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80' },
  { name: '이수아 회원', thumb: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80' },
];

const list = computed(() =>
  props.videos?.length ? props.videos : DEFAULT_VIDEOS
);

function mod(n, m) {
  return ((n % m) + m) % m;
}

const activeIndex = ref(1);

const activeVideo = computed(() => list.value[mod(activeIndex.value, list.value.length)]);
const prevVideo = computed(() => list.value[mod(activeIndex.value - 1, list.value.length)]);
const nextVideo = computed(() => list.value[mod(activeIndex.value + 1, list.value.length)]);

const playing = ref(false);
const activeVideoEl = ref(null);
const activeVideoSrc = computed(() => props.demoVideoSrc);

function playActive() {
  playing.value = true;
  requestAnimationFrame(() => {
    activeVideoEl.value?.play?.().catch(() => {});
  });
}

function goPrev() {
  activeIndex.value = mod(activeIndex.value - 1, list.value.length);
  playing.value = false;
}

function goNext() {
  activeIndex.value = mod(activeIndex.value + 1, list.value.length);
  playing.value = false;
}
</script>

<style scoped>
.v6-story-carousel {
  position: relative;
  background: #2d1b5e;
  height: 100vh;
  overflow: hidden;
}

.v6-story-marquee {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  overflow: hidden;
  pointer-events: none;
}

.v6-story-marquee-track {
  display: flex;
  gap: 3rem;
  white-space: nowrap;
  will-change: transform;
  animation: v6-story-marquee-ltr 20s linear infinite;
}

.v6-story-marquee-text {
  font-size: clamp(5rem, 12vw, 9rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgba(123, 79, 166, 0.35);
}

@keyframes v6-story-marquee-ltr {
  from {
    transform: translateX(-50%);
  }
  to {
    transform: translateX(0%);
  }
}

.v6-story-foreground {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 22px;
  padding: 24px 16px 34px;
}

.v6-story-carousel-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: min(68vh, 640px);
}

.v6-story-card {
  position: absolute;
  aspect-ratio: 9 / 16;
  border-radius: 1.5rem;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 0 26px 90px rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(0, 0, 0, 0.14);
  padding: 0;
  cursor: pointer;
}

.v6-story-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.v6-story-name {
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 14px;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.45);
  color: rgba(255, 255, 255, 0.92);
  font-size: 0.95rem;
  font-weight: 600;
  text-align: center;
}

.v6-story-play {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  color: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 18px;
  box-shadow: 0 12px 34px rgba(0, 0, 0, 0.35);
  border: none;
  cursor: pointer;
}

.v6-story-card--active {
  width: 300px;
  transform: translateX(0) scale(1);
  opacity: 1;
  z-index: 3;
}

.v6-story-card--prev {
  width: 260px;
  transform: translateX(calc(-100% + 60px)) scale(0.85);
  opacity: 0.6;
  z-index: 2;
}

.v6-story-card--next {
  width: 260px;
  transform: translateX(calc(100% - 60px)) scale(0.85);
  opacity: 0.6;
  z-index: 2;
}

.v6-story-card--prev .v6-story-play,
.v6-story-card--next .v6-story-play {
  display: none;
}

.v6-story-arrows {
  display: flex;
  gap: 10px;
  position: relative;
  z-index: 12;
}

.v6-story-arrow {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  background: rgba(0, 0, 0, 0.15);
  color: rgba(255, 255, 255, 0.92);
  font-weight: 700;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.v6-story-arrow:hover {
  background: rgba(0, 0, 0, 0.25);
  transform: translateY(-2px);
}

.v6-story-caption {
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.95rem;
  text-align: center;
}

@media (prefers-reduced-motion: reduce) {
  .v6-story-marquee-track {
    animation: none;
  }
}
</style>
