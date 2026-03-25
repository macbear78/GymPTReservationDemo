<template>
  <section class="story">

    <!-- 마키 배경 텍스트 -->
    <div class="story__marquee" aria-hidden="true">
      <div class="story__marquee-track">
        <span class="story__marquee-text">{{ marqueeText }}</span>
        <span class="story__marquee-text">{{ marqueeText }}</span>
      </div>
    </div>

    <!-- 포그라운드 -->
    <div class="story__fg">

      <!-- 헤더 -->
      <header class="story__header">
        <span class="story__eyebrow">
          <span class="story__eyebrow-line" aria-hidden="true"></span>
          MEMBER STORIES
        </span>
        <h2 class="story__heading">
          나의 변화<br />
          <em class="story__heading-em">스토리</em>
        </h2>
      </header>

      <!-- 카드 캐러셀 -->
      <div class="story__stage">

        <!-- 이전 카드 -->
        <button
          type="button"
          class="story__card story__card--side story__card--prev"
          aria-label="이전 카드"
          @click="goPrev"
        >
          <img :src="prevVideo.thumb" :alt="prevVideo.name" class="story__thumb" />
          <div class="story__card-overlay" aria-hidden="true"></div>
          <span class="story__card-name">{{ prevVideo.name }}</span>
        </button>

        <!-- 활성 카드 -->
        <div class="story__card story__card--active" role="group" aria-label="현재 선택된 카드">
          <!-- 재생 중 -->
          <template v-if="playing">
            <video
              ref="activeVideoEl"
              class="story__thumb"
              :src="demoVideoSrc"
              playsinline
              autoplay
              muted
              controls
            />
          </template>
          <!-- 썸네일 -->
          <template v-else>
            <img :src="activeVideo.thumb" :alt="activeVideo.name" class="story__thumb" />
            <div class="story__card-overlay story__card-overlay--active" aria-hidden="true"></div>
            <button
              type="button"
              class="story__play"
              aria-label="동영상 재생"
              @click.stop="playActive"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </template>

          <!-- 이름 + 태그 -->
          <div class="story__card-meta">
            <span class="story__card-tag" aria-hidden="true">● LIVE</span>
            <span class="story__card-name story__card-name--active">{{ activeVideo.name }}</span>
            <span v-if="activeVideo.result" class="story__card-result">{{ activeVideo.result }}</span>
          </div>

          <!-- 카드 번호 -->
          <span class="story__card-num" aria-hidden="true">
            {{ String(activeIndex + 1).padStart(2, '0') }} / {{ String(list.length).padStart(2, '0') }}
          </span>
        </div>

        <!-- 다음 카드 -->
        <button
          type="button"
          class="story__card story__card--side story__card--next"
          aria-label="다음 카드"
          @click="goNext"
        >
          <img :src="nextVideo.thumb" :alt="nextVideo.name" class="story__thumb" />
          <div class="story__card-overlay" aria-hidden="true"></div>
          <span class="story__card-name">{{ nextVideo.name }}</span>
        </button>
      </div>

      <!-- 하단 컨트롤 -->
      <div class="story__controls">
        <!-- 도트 인디케이터 -->
        <div class="story__dots" role="tablist" aria-label="카드 선택">
          <button
            v-for="(v, i) in list"
            :key="i"
            type="button"
            role="tab"
            class="story__dot"
            :class="{ 'story__dot--active': i === activeIndex }"
            :aria-label="`${i + 1}번 카드`"
            :aria-selected="i === activeIndex"
            @click="goTo(i)"
          ></button>
        </div>

        <!-- 화살표 -->
        <div class="story__arrows">
          <button type="button" class="story__arrow" aria-label="이전" @click="goPrev">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M12 4l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button type="button" class="story__arrow" aria-label="다음" @click="goNext">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M8 4l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  videos: { type: Array, default: null },
  demoVideoSrc: {
    type: String,
    default: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  },
  marqueeText: {
    type: String,
    default: '나의 변화 스토리  ·  회원 후기  ·  회원을 만나보세요  ·  PT 효과  ·',
  },
})

const DEFAULT_VIDEOS = [
  {
    name: '김지영 회원',
    result: '체지방 -12kg',
    thumb: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
  },
  {
    name: '박민준 회원',
    result: '근육량 +8kg',
    thumb: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80',
  },
  {
    name: '이수아 회원',
    result: '6개월 변화',
    thumb: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80',
  },
]

const list = computed(() => props.videos?.length ? props.videos : DEFAULT_VIDEOS)

function mod(n, m) { return ((n % m) + m) % m }

const activeIndex = ref(1)
const playing = ref(false)
const activeVideoEl = ref(null)

const activeVideo = computed(() => list.value[mod(activeIndex.value, list.value.length)])
const prevVideo   = computed(() => list.value[mod(activeIndex.value - 1, list.value.length)])
const nextVideo   = computed(() => list.value[mod(activeIndex.value + 1, list.value.length)])

function playActive() {
  playing.value = true
  requestAnimationFrame(() => activeVideoEl.value?.play?.().catch(() => {}))
}
function goPrev() { activeIndex.value = mod(activeIndex.value - 1, list.value.length); playing.value = false }
function goNext() { activeIndex.value = mod(activeIndex.value + 1, list.value.length); playing.value = false }
function goTo(i) { activeIndex.value = i; playing.value = false }
</script>

<style scoped>
/* ─── 토큰 ────────────────────────────────── */
.story {
  --bg: #0e0e0c;
  --surface: #161614;
  --accent: #d4f24a;
  --text: #f0f0ee;
  --muted: #666663;
  --border: #272724;
  --card-radius: 20px;

  position: relative;
  background: var(--bg);
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ─── 마키 배경 ──────────────────────────── */
.story__marquee {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}
.story__marquee-track {
  display: flex;
  gap: 4rem;
  white-space: nowrap;
  animation: marquee-scroll 24s linear infinite;
  will-change: transform;
}
.story__marquee-text {
  font-size: clamp(6rem, 14.4vw, 10.8rem);
  font-weight: 900;
  letter-spacing: -0.03em;
  color: rgba(212, 242, 74, 0.05);
}
@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ─── 포그라운드 ──────────────────────────── */
.story__fg {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 60px 60px 52px;
}

/* ─── 헤더 ───────────────────────────────── */
.story__header {
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.story__eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: var(--muted);
  text-transform: uppercase;
}
.story__eyebrow-line {
  display: inline-block;
  width: 24px;
  height: 2px;
  background: var(--accent);
  flex-shrink: 0;
}
.story__heading {
  font-size: clamp(2.2rem, 6.5vw, 5.5rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.04em;
  color: var(--text);
  margin: 0;
}
.story__heading-em {
  font-style: normal;
  color: var(--accent);
}

/* ─── 스테이지 ───────────────────────────── */
.story__stage {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: min(62vh, 580px);
  width: 100%;
}

/* ─── 공통 카드 ──────────────────────────── */
.story__card {
  position: absolute;
  aspect-ratio: 9 / 16;
  border-radius: var(--card-radius);
  overflow: hidden;
  transition: all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: 1px solid var(--border);
  background: var(--surface);
  padding: 0;
}
.story__thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 오버레이 */
.story__card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(14,14,12,0.85) 0%, transparent 55%);
}
.story__card-overlay--active {
  background: linear-gradient(to top, rgba(14,14,12,0.9) 0%, transparent 50%);
}

/* 활성 카드 */
.story__card--active {
  width: 280px;
  transform: translateX(0) scale(1);
  opacity: 1;
  z-index: 3;
  box-shadow: 0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,242,74,0.15);
  cursor: default;
}

/* 사이드 카드 공통 */
.story__card--side {
  width: 230px;
  opacity: 0.45;
  z-index: 2;
  cursor: pointer;
  filter: brightness(0.7);
}
.story__card--side:hover {
  opacity: 0.7;
  filter: brightness(0.9);
}
.story__card--prev {
  transform: translateX(calc(-100% + 40px)) scale(0.88);
}
.story__card--next {
  transform: translateX(calc(100% - 40px)) scale(0.88);
}

/* 카드 메타 (이름, 태그) */
.story__card-meta {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.story__card-tag {
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: var(--accent);
  text-transform: uppercase;
}
.story__card-name {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  font-size: 13px;
  font-weight: 700;
  color: rgba(240,240,238,0.85);
  text-align: center;
  background: rgba(14,14,12,0.5);
  padding: 6px 10px;
  border-radius: 8px;
  backdrop-filter: blur(4px);
}
.story__card-name--active {
  position: static;
  background: none;
  padding: 0;
  backdrop-filter: none;
  border-radius: 0;
  font-size: 18px;
  font-weight: 800;
  color: var(--text);
  text-align: left;
}
.story__card-result {
  font-size: 16px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.04em;
}

/* 카드 번호 */
.story__card-num {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(240,240,238,0.45);
}

/* 재생 버튼 */
.story__play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--accent);
  color: #0e0e0c;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
  box-shadow: 0 8px 30px rgba(212,242,74,0.35);
  z-index: 4;
}
.story__play:hover {
  transform: translate(-50%, -50%) scale(1.1);
}
.story__play svg {
  width: 22px;
  height: 22px;
  margin-left: 3px;
}

/* ─── 컨트롤 ─────────────────────────────── */
.story__controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  width: 100%;
}

/* 도트 */
.story__dots {
  display: flex;
  align-items: center;
  gap: 8px;
}
.story__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--border);
  border: none;
  cursor: pointer;
  transition: background 0.25s, transform 0.25s, width 0.25s;
  padding: 0;
}
.story__dot--active {
  background: var(--accent);
  width: 24px;
  border-radius: 3px;
}

/* 화살표 */
.story__arrows {
  display: flex;
  gap: 10px;
}
.story__arrow {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.story__arrow svg {
  width: 18px;
  height: 18px;
}
.story__arrow:hover {
  border-color: var(--accent);
  background: rgba(212,242,74,0.08);
}

/* ─── 반응형 ─────────────────────────────── */
@media (max-width: 900px) {
  .story__fg {
    padding: 48px 32px 40px;
  }
  .story__card--active { width: 240px; }
  .story__card--side { width: 190px; }
}
@media (max-width: 600px) {
  .story__marquee-text {
    font-size: clamp(3.2rem, 18vw, 7rem);
  }
  .story__fg {
    padding: 48px 20px 32px;
    gap: 28px;
  }
  .story__card--active { width: 200px; }
  .story__card--side { width: 150px; opacity: 0.35; }
  .story__card--prev { transform: translateX(calc(-100% + 24px)) scale(0.84); }
  .story__card--next { transform: translateX(calc(100% - 24px)) scale(0.84); }
}

@media (prefers-reduced-motion: reduce) {
  .story__marquee-track { animation: none; }
  .story__card { transition: none; }
}
</style>