<template>
  <section class="classes" aria-labelledby="classes-heading">

    <!-- 헤더 -->
    <header class="classes__header">
      <div class="classes__header-left">
        <span class="classes__eyebrow">
          <span class="classes__eyebrow-tick" aria-hidden="true"></span>
          PROGRAMS
        </span>
        <h2
          id="classes-heading"
          v-scroll-animate
          data-animate="fade-up"
          data-delay="0"
          class="classes__heading"
        >
          저희의 모든<br />
          <span class="classes__heading-accent">강좌</span>를 살펴보세요
        </h2>
      </div>

      <div class="classes__header-right">
        <!-- 슬라이드 진행 표시 -->
        <div class="classes__progress" aria-hidden="true">
          <div
            class="classes__progress-bar"
            :style="{ width: `${progressPct}%` }"
          ></div>
        </div>
        <!-- 네비 버튼 -->
        <div class="classes__nav" role="group" aria-label="슬라이더 탐색">
          <button
            type="button"
            class="classes__nav-btn"
            aria-label="이전"
            :disabled="currentIndex <= 0"
            @click="prev"
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M12 4l-6 6 6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <span class="classes__nav-count">
            {{ String(currentIndex + 1).padStart(2, '0') }}
            <span class="classes__nav-sep">/</span>
            {{ String(items.length).padStart(2, '0') }}
          </span>
          <button
            type="button"
            class="classes__nav-btn"
            aria-label="다음"
            :disabled="currentIndex >= maxIndex"
            @click="next"
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M8 4l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </header>

    <!-- 슬라이더 뷰포트 -->
    <div ref="viewportRef" class="classes__viewport">
      <ul class="classes__track" :style="trackStyle" role="list">
        <li
          v-for="(item, index) in items"
          :key="item.id"
          class="classes__card"
          :style="{ width: `${cardWidthPx}px` }"
          :aria-label="item.title"
        >
          <!-- 이미지 -->
          <div class="classes__card-img-wrap">
            <img
              :src="item.image"
              :alt="item.title"
              class="classes__card-img"
              loading="lazy"
            />
            <!-- 번호 뱃지 -->
            <span class="classes__card-num" aria-hidden="true">
              {{ String(index + 1).padStart(2, '0') }}
            </span>
            <!-- 난이도 뱃지 -->
            <span
              v-if="item.level"
              class="classes__card-level"
              :data-level="item.level"
            >{{ item.level }}</span>
            <!-- 호버 오버레이 -->
            <div class="classes__card-overlay" aria-hidden="true">
              <span class="classes__card-cta">자세히 보기 →</span>
            </div>
          </div>

          <!-- 텍스트 -->
          <div class="classes__card-body">
            <h3 class="classes__card-title">{{ item.title }}</h3>
            <p class="classes__card-desc">{{ item.description }}</p>
            <!-- 태그 -->
            <div v-if="item.tags?.length" class="classes__card-tags">
              <span
                v-for="tag in item.tags"
                :key="tag"
                class="classes__card-tag"
              >{{ tag }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 섹션 하단 장식 라인 -->
    <div class="classes__rule" aria-hidden="true">
      <span class="classes__rule-label">ALL CLASSES</span>
    </div>

  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

const GAP_PX = 20
const VISIBLE = 2.4   // 한 번에 2.4장 노출 (오른쪽 살짝 잘림)

const FALLBACKS = [
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=85',
  'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=800&q=85',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=85',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=85',
]

const DEFAULT_CLASSES = [
  {
    id: 1,
    title: '고강도 훈련',
    description: '인터벌과 서킷으로 체력과 지구력을 함께 끌어올립니다.',
    image: '',
    level: 'HARD',
    tags: ['HIIT', '유산소'],
  },
  {
    id: 2,
    title: '역도',
    description: '올바른 리프팅 폼을 단계적으로 익혀 부상 없이 힘을 키웁니다.',
    image: '',
    level: 'MID',
    tags: ['웨이트', '근력'],
  },
  {
    id: 3,
    title: '크로스핏',
    description: '기능성 동작을 조합해 전신을 쓰는 트레이닝을 경험합니다.',
    image: '',
    level: 'HARD',
    tags: ['기능성', '전신'],
  },
  {
    id: 4,
    title: '요가',
    description: '호흡과 스트레칭으로 유연성과 회복, 집중력을 다듬습니다.',
    image: '',
    level: 'EASY',
    tags: ['유연성', '회복'],
  },
]

const props = defineProps({
  classes: { type: Array, default: null },
})

const items = computed(() => {
  const raw = props.classes?.length ? props.classes : DEFAULT_CLASSES
  return raw.map((item, i) => ({
    tags: [],
    ...item,
    image: item.image?.trim() || FALLBACKS[i % FALLBACKS.length],
  }))
})

const currentIndex = ref(0)
const viewportRef  = ref(null)
const viewportWidthPx = ref(0)

const maxIndex = computed(() => Math.max(0, items.value.length - Math.floor(VISIBLE)))
const progressPct = computed(() =>
  maxIndex.value === 0 ? 100 : (currentIndex.value / maxIndex.value) * 100
)
const cardWidthPx  = computed(() => {
  const w = viewportWidthPx.value
  if (w <= 0) return 0
  return (w - (Math.ceil(VISIBLE) - 1) * GAP_PX) / VISIBLE
})
const cardStepPx = computed(() => cardWidthPx.value + GAP_PX)
const trackStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * cardStepPx.value}px)`,
  transition: 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
}))

function prev() { if (currentIndex.value > 0) currentIndex.value -= 1 }
function next() { if (currentIndex.value < maxIndex.value) currentIndex.value += 1 }

function measure() {
  nextTick(() => {
    viewportWidthPx.value = viewportRef.value?.clientWidth ?? 0
  })
}

let ro
onMounted(() => {
  measure()
  window.addEventListener('resize', measure)
  if (viewportRef.value && typeof ResizeObserver !== 'undefined') {
    ro = new ResizeObserver(measure)
    ro.observe(viewportRef.value)
  }
})
onUnmounted(() => {
  window.removeEventListener('resize', measure)
  ro?.disconnect()
})
watch(items, () => {
  currentIndex.value = Math.min(currentIndex.value, maxIndex.value)
  measure()
})
watch(maxIndex, (m) => {
  if (currentIndex.value > m) currentIndex.value = m
})
</script>

<style scoped>
/* ─── 토큰 ────────────────────────────────── */
.classes {
  --bg: #111110;
  --surface: #1a1a18;
  --accent: #d4f24a;
  --text: #f0f0ee;
  --muted: #666663;
  --border: #272724;

  background: var(--bg);
  color: var(--text);
  padding: 80px 0 0;
  overflow: hidden;
}

/* ─── 헤더 ───────────────────────────────── */
.classes__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 60px 44px;
  gap: 32px;
  flex-wrap: wrap;
}

.classes__eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: var(--muted);
  text-transform: uppercase;
  margin-bottom: 14px;
}
.classes__eyebrow-tick {
  display: inline-block;
  width: 24px;
  height: 2px;
  background: var(--accent);
  flex-shrink: 0;
}

.classes__heading {
  font-size: clamp(2rem, 5.5vw, 4.4rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.04em;
  margin: 0;
}
.classes__heading-accent {
  color: var(--accent);
}

/* 오른쪽 헤더 */
.classes__header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
  flex-shrink: 0;
}

/* 프로그레스 바 */
.classes__progress {
  width: 180px;
  height: 2px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}
.classes__progress-bar {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width 0.4s ease;
}

/* 네비 버튼 */
.classes__nav {
  display: flex;
  align-items: center;
  gap: 12px;
}
.classes__nav-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  flex-shrink: 0;
}
.classes__nav-btn svg {
  width: 18px;
  height: 18px;
}
.classes__nav-btn:hover:not(:disabled) {
  border-color: var(--accent);
  background: rgba(212, 242, 74, 0.08);
}
.classes__nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.classes__nav-count {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
  min-width: 52px;
  text-align: center;
  letter-spacing: 0.04em;
}
.classes__nav-sep {
  color: var(--muted);
  margin: 0 2px;
}

/* ─── 슬라이더 ───────────────────────────── */
.classes__viewport {
  padding: 0 60px;
  overflow: hidden;
}
.classes__track {
  display: flex;
  gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
}

/* ─── 카드 ───────────────────────────────── */
.classes__card {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}
.classes__card-img-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 10px;
  overflow: hidden;
  background: var(--surface);
}
.classes__card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.classes__card:hover .classes__card-img {
  transform: scale(1.05);
}

/* 번호 뱃지 */
.classes__card-num {
  position: absolute;
  top: 14px;
  left: 14px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: rgba(240, 240, 238, 0.6);
}

/* 난이도 뱃지 */
.classes__card-level {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.14em;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}
.classes__card-level[data-level="EASY"]  { background: rgba(212,242,74,0.18); color: #d4f24a; }
.classes__card-level[data-level="MID"]   { background: rgba(255,185,50,0.18); color: #ffb932; }
.classes__card-level[data-level="HARD"]  { background: rgba(255,80,80,0.18);  color: #ff6060; }

/* 호버 오버레이 */
.classes__card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(14,14,12,0.75) 0%, transparent 50%);
  display: flex;
  align-items: flex-end;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.3s;
}
.classes__card:hover .classes__card-overlay { opacity: 1; }
.classes__card-cta {
  font-size: 15px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.04em;
}

/* 카드 텍스트 */
.classes__card-body {
  padding: 18px 4px 8px;
}
.classes__card-title {
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--text);
  margin: 0 0 8px;
}
.classes__card-desc {
  font-size: 16px;
  line-height: 1.65;
  color: var(--muted);
  margin: 0 0 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.classes__card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.classes__card-tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  border: 1px solid var(--border);
  padding: 3px 8px;
  border-radius: 4px;
}

/* ─── 하단 룰 ────────────────────────────── */
.classes__rule {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 48px 60px 0;
  padding-bottom: 0;
  border-top: 1px solid var(--border);
  padding-top: 16px;
}
.classes__rule::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}
.classes__rule-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--muted);
  text-transform: uppercase;
  flex-shrink: 0;
}

/* ─── 반응형 ─────────────────────────────── */
@media (max-width: 900px) {
  .classes__header  { padding: 0 32px 36px; }
  .classes__viewport { padding: 0 32px; }
  .classes__rule     { margin: 36px 32px 0; }
}
@media (max-width: 600px) {
  .classes__header   { padding: 0 20px 28px; flex-direction: column; align-items: flex-start; }
  .classes__header-right { align-items: flex-start; }
  .classes__progress { width: 120px; }
  .classes__viewport { padding: 0 20px; }
  .classes__rule     { margin: 28px 20px 0; }
}
</style>