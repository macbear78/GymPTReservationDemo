<template>
  <section class="trainers" aria-labelledby="trainers-heading">

    <!-- 상단 헤더 바 -->
    <div class="trainers__header">
      <div class="trainers__header-inner">
        <span class="trainers__eyebrow">
          <span class="trainers__eyebrow-line" aria-hidden="true"></span>
          OUR TEAM
        </span>
        <h2
          id="trainers-heading"
          v-scroll-animate
          data-animate="fade-up"
          data-delay="0"
          class="trainers__heading"
        >
          전문 퍼스널<br />
          <em class="trainers__heading-em">트레이너</em>팀
        </h2>
      </div>

      <!-- 오른쪽: 총 인원 카운터 + 네비 -->
      <div class="trainers__header-right">
        <div class="trainers__count" aria-hidden="true">
          <span class="trainers__count-num">{{ String(items.length).padStart(2, '0') }}</span>
          <span class="trainers__count-label">TRAINERS</span>
        </div>
        <div class="trainers__nav" v-if="items.length > visibleCount">
          <button
            type="button"
            class="trainers__nav-btn"
            :disabled="currentIndex <= 0"
            aria-label="이전"
            @click="prev"
          >
            <svg viewBox="0 0 20 20" fill="none"><path d="M12 4l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <span class="trainers__nav-count">
            {{ String(currentIndex + 1).padStart(2, '0') }}
            <span class="trainers__nav-sep">/</span>
            {{ String(maxIndex + 1).padStart(2, '0') }}
          </span>
          <button
            type="button"
            class="trainers__nav-btn"
            :disabled="currentIndex >= maxIndex"
            aria-label="다음"
            @click="next"
          >
            <svg viewBox="0 0 20 20" fill="none"><path d="M8 4l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 슬라이더 뷰포트 -->
    <div
      ref="viewportRef"
      class="trainers__viewport"
      @mouseenter="pauseAuto"
      @mouseleave="resumeAuto"
    >
      <ul
        class="trainers__track"
        :style="trackStyle"
        role="list"
      >
        <li
          v-for="(trainer, index) in items"
          :key="trainer.id"
          class="trainers__item"
          :style="{ width: `${cardWidth}px` }"
        >
          <span class="trainers__item-num" aria-hidden="true">
            {{ String(index + 1).padStart(2, '0') }}
          </span>

          <div class="trainers__img-wrap">
            <img
              :src="trainer.image"
              :alt="trainer.name"
              class="trainers__img"
              loading="lazy"
            />
            <div class="trainers__overlay" aria-hidden="true">
              <button
                type="button"
                class="trainers__detail-btn"
                :aria-label="`${trainer.name} 상세 보기`"
                @click="emit('select-trainer', trainer)"
              >
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <span class="trainers__tag">{{ trainer.role }}</span>
          </div>

          <div class="trainers__info">
            <h3 class="trainers__name">{{ trainer.name }}</h3>
            <div class="trainers__meta">
              <span
                v-for="spec in trainer.specs"
                :key="spec"
                class="trainers__spec"
              >{{ spec }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 프로그레스 바 -->
    <div class="trainers__progress" v-if="items.length > visibleCount" aria-hidden="true">
      <div class="trainers__progress-bar" :style="{ width: `${progressPct}%` }"></div>
    </div>

    <!-- 하단 장식 바 -->
    <div class="trainers__footer" aria-hidden="true">
      <span
        v-for="n in 6"
        :key="n"
        class="trainers__footer-block"
        :style="`opacity: ${0.06 + n * 0.04}`"
      ></span>
    </div>

  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

const GAP = 20
const VISIBLE_DESKTOP = 3
const AUTO_INTERVAL = 3500

const FALLBACKS = [
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=85',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=85',
  'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=800&q=85',
]

const DEFAULT_TRAINERS = [
  { id: 1, name: '김준호', role: '퍼스널 코치', image: '', specs: ['웨이트', 'HIIT'] },
  { id: 2, name: '이서연', role: '퍼스널 코치', image: '', specs: ['요가', '재활'] },
  { id: 3, name: '박도윤', role: '퍼스널 코치', image: '', specs: ['크로스핏', '역도'] },
]

const props = defineProps({
  trainers: { type: Array, default: null },
})
const emit = defineEmits(['select-trainer'])

const items = computed(() => {
  const raw = props.trainers?.length ? props.trainers : DEFAULT_TRAINERS
  return raw.map((t, i) => ({
    specs: [],
    ...t,
    image: t.image?.trim() || FALLBACKS[i % FALLBACKS.length],
  }))
})

const viewportRef = ref(null)
const viewportWidth = ref(900)
const currentIndex = ref(0)

const visibleCount = computed(() => {
  if (viewportWidth.value < 600) return 1
  if (viewportWidth.value < 900) return 2
  return VISIBLE_DESKTOP
})

const cardWidth = computed(() => {
  const totalGap = GAP * (visibleCount.value - 1)
  return (viewportWidth.value - totalGap) / visibleCount.value
})

const maxIndex = computed(() => Math.max(0, items.value.length - visibleCount.value))

const trackStyle = computed(() => {
  const offset = currentIndex.value * (cardWidth.value + GAP)
  return {
    transform: `translateX(-${offset}px)`,
    gap: `${GAP}px`,
    transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  }
})

const progressPct = computed(() => {
  if (maxIndex.value === 0) return 100
  return ((currentIndex.value) / maxIndex.value) * 100
})

function prev() {
  if (currentIndex.value > 0) currentIndex.value--
  restartAuto()
}

function next() {
  if (currentIndex.value < maxIndex.value) currentIndex.value++
  else currentIndex.value = 0
  restartAuto()
}

let autoTimer = null
let paused = false

function startAuto() {
  stopAuto()
  if (maxIndex.value <= 0) return
  autoTimer = setInterval(() => {
    if (!paused) {
      if (currentIndex.value < maxIndex.value) currentIndex.value++
      else currentIndex.value = 0
    }
  }, AUTO_INTERVAL)
}

function stopAuto() {
  if (autoTimer) { clearInterval(autoTimer); autoTimer = null }
}

function restartAuto() {
  startAuto()
}

function pauseAuto() { paused = true }
function resumeAuto() { paused = false }

function measure() {
  if (viewportRef.value) {
    viewportWidth.value = viewportRef.value.clientWidth
  }
}

let ro = null

onMounted(() => {
  measure()
  ro = new ResizeObserver(measure)
  if (viewportRef.value) ro.observe(viewportRef.value)
  startAuto()
})

onUnmounted(() => {
  stopAuto()
  if (ro) ro.disconnect()
})

watch(maxIndex, (m) => {
  if (currentIndex.value > m) currentIndex.value = m
})
</script>

<style scoped>
.trainers {
  --bg: #0e0e0c;
  --surface: #181816;
  --accent: #d4f24a;
  --text: #f0f0ee;
  --muted: #6b6b68;
  --border: #2a2a28;
  --radius: 10px;

  background: var(--bg);
  color: var(--text);
  padding: 80px 0 0;
  overflow: hidden;
}

/* ─── 헤더 ───────────────────────────────── */
.trainers__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 60px 48px;
  border-bottom: 1px solid var(--border);
  gap: 24px;
}
.trainers__header-inner {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.trainers__header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
  flex-shrink: 0;
}
.trainers__eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: var(--muted);
  text-transform: uppercase;
}
.trainers__eyebrow-line {
  display: inline-block;
  width: 24px;
  height: 2px;
  background: var(--accent);
  flex-shrink: 0;
}
.trainers__heading {
  font-size: clamp(2.2rem, 6vw, 5rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.04em;
  margin: 0;
}
.trainers__heading-em {
  font-style: normal;
  color: var(--accent);
}

/* 인원 카운터 */
.trainers__count {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.trainers__count-num {
  font-size: clamp(3rem, 7vw, 6.5rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.06em;
  color: var(--text);
}
.trainers__count-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--muted);
  text-transform: uppercase;
}

/* 네비 */
.trainers__nav {
  display: flex;
  align-items: center;
  gap: 12px;
}
.trainers__nav-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}
.trainers__nav-btn:hover:not(:disabled) {
  background: var(--surface);
  border-color: var(--accent);
}
.trainers__nav-btn:disabled {
  opacity: 0.3;
  cursor: default;
}
.trainers__nav-btn svg {
  width: 14px;
  height: 14px;
}
.trainers__nav-count {
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.06em;
  min-width: 50px;
  text-align: center;
}
.trainers__nav-sep {
  color: var(--muted);
  margin: 0 2px;
}

/* ─── 슬라이더 ─────────────────────────────── */
.trainers__viewport {
  overflow: hidden;
  padding: 40px 60px 0;
}

.trainers__track {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.trainers__item {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  cursor: pointer;
}
.trainers__item:hover .trainers__img {
  transform: scale(1.04);
}
.trainers__item:hover .trainers__overlay {
  opacity: 1;
}

.trainers__item-num {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--muted);
  z-index: 2;
}

/* 이미지 래퍼 */
.trainers__img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: var(--radius);
  overflow: hidden;
  background: #2a2a28;
}
.trainers__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  display: block;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 호버 오버레이 */
.trainers__overlay {
  position: absolute;
  inset: 0;
  background: rgba(14, 14, 12, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}
.trainers__detail-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px solid var(--accent);
  background: transparent;
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.trainers__detail-btn svg {
  width: 20px;
  height: 20px;
}
.trainers__detail-btn:hover {
  background: var(--accent);
  color: #0e0e0c;
}

/* 포지션 태그 */
.trainers__tag {
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: rgba(14, 14, 12, 0.78);
  color: var(--text);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 5px 10px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

/* 텍스트 */
.trainers__info {
  padding: 20px 0 36px;
}
.trainers__name {
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  margin: 0 0 10px;
  color: var(--text);
}
.trainers__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.trainers__spec {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--accent);
  background: rgba(212, 242, 74, 0.1);
  padding: 5px 12px;
  border-radius: 4px;
  border: 1px solid rgba(212, 242, 74, 0.2);
}

/* ─── 프로그레스 바 ─────────────────────────── */
.trainers__progress {
  height: 2px;
  background: var(--border);
  margin: 0 60px;
}
.trainers__progress-bar {
  height: 100%;
  background: var(--accent);
  transition: width 0.5s ease;
}

/* ─── 하단 장식 바 ───────────────────────────── */
.trainers__footer {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  height: 8px;
  margin-top: 0;
}
.trainers__footer-block {
  background: var(--accent);
  display: block;
}

/* ─── 반응형 ─────────────────────────────── */
@media (max-width: 900px) {
  .trainers__header { padding: 0 32px 36px; }
  .trainers__viewport { padding: 32px 32px 0; }
  .trainers__progress { margin: 0 32px; }
}
@media (max-width: 600px) {
  .trainers__header {
    flex-direction: column;
    align-items: flex-start;
    padding: 0 20px 28px;
  }
  .trainers__header-right {
    align-items: flex-start;
    flex-direction: row;
    gap: 20px;
  }
  .trainers__viewport { padding: 24px 20px 0; }
  .trainers__progress { margin: 0 20px; }
}
</style>
