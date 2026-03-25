<template>
  <section class="features" aria-labelledby="features-heading">
    <h2 id="features-heading" class="sr-only">특징</h2>

    <div class="features__grid">
      <div
        v-for="(feature, index) in items"
        :key="feature.id"
        v-scroll-animate
        data-animate="fade-up"
        :data-delay="String(index * 150)"
        class="features__card"
        :class="`features__card--${index}`"
      >
        <!-- 배경 번호 -->
        <span class="features__card-bg-num" aria-hidden="true">
          {{ String(index + 1).padStart(2, '0') }}
        </span>

        <!-- 아이콘 -->
        <div class="features__icon-wrap" :class="`features__icon-wrap--${feature.icon}`">
          <!-- 링 애니메이션 -->
          <span class="features__icon-ring features__icon-ring--1" aria-hidden="true"></span>
          <span class="features__icon-ring features__icon-ring--2" aria-hidden="true"></span>

          <!-- warning: 방패 + 느낌표 -->
          <svg
            v-if="feature.icon === 'warning'"
            class="features__icon-svg"
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M24 4L6 14v10c0 10.5 7.7 20.3 18 22.7C35.3 44.3 42 34.5 42 24V14L24 4z"
              stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"
            />
            <line x1="24" y1="18" x2="24" y2="28" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <circle cx="24" cy="34" r="1.5" fill="currentColor"/>
          </svg>

          <!-- clock: 시계 + 번개 -->
          <svg
            v-else-if="feature.icon === 'clock'"
            class="features__icon-svg"
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2.2"/>
            <path d="M24 12v13l8 5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18 6l-2 5h4l-2 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.45"/>
          </svg>

          <!-- check: 큰 체크 -->
          <svg
            v-else-if="feature.icon === 'check'"
            class="features__icon-svg"
            viewBox="0 0 48 48"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="24" cy="24" r="18" stroke="currentColor" stroke-width="2.2"/>
            <path
              d="M14 24l7 8 13-14"
              stroke="currentColor" stroke-width="2.8"
              stroke-linecap="round" stroke-linejoin="round"
            />
          </svg>
        </div>

        <!-- 텍스트 -->
        <div class="features__text">
          <h3 class="features__title">{{ feature.title }}</h3>
          <p class="features__desc">{{ feature.description }}</p>
        </div>

        <!-- 하단 구분선 + 더보기 -->
        <div class="features__footer">
          <span class="features__footer-line" aria-hidden="true"></span>
          <span class="features__footer-more">자세히 알아보기 →</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const DEFAULT_FEATURES = [
  {
    id: 1,
    icon: 'warning',
    title: '소수 정예 수업',
    description:
      '퍼스널 트레이닝의 본질에 맞게 한 번에 적은 수의 회원만 모십니다. 한 분에게 시간과 에너지를 더 깊게 쏟을 수 있습니다.',
  },
  {
    id: 2,
    icon: 'clock',
    title: '24시간 케어',
    description:
      '언제 어디서든 여정을 함께합니다. 걸음마다 옆에 있다는 느낌이 들도록 돕고, 저희도 같은 길을 걸어 본 사람으로서 공감합니다.',
  },
  {
    id: 3,
    icon: 'check',
    title: '진짜 경험의 코칭',
    description:
      '지금 회원님이 선택하신 길을 저희도 먼저 걸어 왔습니다. 이상적인 몸과 일상에 더 가까워지고 싶다면 함께하겠습니다.',
  },
]

const props = defineProps({
  features: { type: Array, default: null },
})

const items = computed(() =>
  props.features?.length ? props.features : DEFAULT_FEATURES
)
</script>

<style scoped>
/* ─── 토큰 ────────────────────────────────── */
.features {
  --bg: #f7f7f5;
  --card-bg: #ffffff;
  --text: #0e0e0c;
  --muted: #888884;
  --border: #e8e8e4;
  --accent: #d4f24a;
  --accent-warning: #ff6b35;
  --accent-clock: #4a9eff;
  --accent-check: #d4f24a;
  --radius: 20px;

  background: var(--bg);
  padding: var(--section-padding-desktop, 80px 60px);
}

/* ─── 3열 그리드 ─────────────────────────── */
.features__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* ─── 카드 ───────────────────────────────── */
.features__card {
  position: relative;
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 64px 48px 48px;
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow: hidden;
  transition: box-shadow 0.3s, transform 0.3s;
  cursor: default;
}
.features__card:hover {
  transform: translateY(-6px);
  box-shadow: 0 24px 60px rgba(14, 14, 12, 0.10);
}

/* 배경 번호 */
.features__card-bg-num {
  position: absolute;
  top: -10px;
  right: 20px;
  font-size: 8rem;
  font-weight: 900;
  line-height: 1;
  color: rgba(14, 14, 12, 0.035);
  letter-spacing: -0.06em;
  pointer-events: none;
  user-select: none;
}

/* ─── 아이콘 래퍼 ────────────────────────── */
.features__icon-wrap {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 36px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* 색상별 배경 */
.features__icon-wrap--warning {
  background: rgba(255, 107, 53, 0.1);
  color: var(--accent-warning);
}
.features__icon-wrap--clock {
  background: rgba(74, 158, 255, 0.1);
  color: var(--accent-clock);
}
.features__icon-wrap--check {
  background: rgba(212, 242, 74, 0.15);
  color: #7db800;
}

/* SVG 크기 */
.features__icon-svg {
  width: 64px;
  height: 64px;
  position: relative;
  z-index: 2;
}

/* ─── 링 애니메이션 ──────────────────────── */
.features__icon-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1.5px solid currentColor;
  opacity: 0;
  animation: ring-pulse 3s ease-out infinite;
}
.features__icon-ring--2 {
  animation-delay: 1s;
}

@keyframes ring-pulse {
  0%   { transform: scale(1);   opacity: 0.5; }
  100% { transform: scale(1.9); opacity: 0; }
}

/* 아이콘 자체 float 애니메이션 */
.features__icon-wrap .features__icon-svg {
  animation: icon-float 4s ease-in-out infinite;
}
.features__card--1 .features__icon-svg {
  animation-delay: 0.5s;
}
.features__card--2 .features__icon-svg {
  animation-delay: 1s;
}

@keyframes icon-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  30%       { transform: translateY(-5px) rotate(-2deg); }
  60%       { transform: translateY(-3px) rotate(1deg); }
}

/* ─── 텍스트 ─────────────────────────────── */
.features__text {
  flex: 1;
}
.features__title {
  font-size: 1.7rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: var(--text);
  margin: 0 0 14px;
  line-height: 1.3;
}
.features__desc {
  font-size: 17px;
  line-height: 1.8;
  color: var(--muted);
  margin: 0;
}

/* ─── 하단 푸터 ──────────────────────────── */
.features__footer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}
.features__footer-line {
  flex: 1;
  height: 1px;
  background: var(--border);
  /* 이미 border-top 있으므로 숨김 */
  display: none;
}
.features__footer-more {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--muted);
  transition: color 0.2s;
  white-space: nowrap;
}
.features__card:hover .features__footer-more {
  color: var(--text);
}

/* ─── 카드 hover 시 아이콘 링 가속 ──────── */
.features__card:hover .features__icon-ring {
  animation-duration: 1.5s;
}

/* ─── 반응형 ─────────────────────────────── */
@media (max-width: 960px) {
  .features {
    padding: 60px 32px;
  }
  .features__grid {
    grid-template-columns: 1fr;
    max-width: 540px;
  }
  .features__card {
    padding: 44px 36px 36px;
    flex-direction: row;
    gap: 32px;
    align-items: flex-start;
  }
  .features__icon-wrap {
    width: 80px;
    height: 80px;
    margin-bottom: 0;
    flex-shrink: 0;
  }
  .features__icon-svg {
    width: 40px;
    height: 40px;
  }
  .features__text { flex: 1; }
  .features__footer { margin-top: 20px; }
}

@media (max-width: 600px) {
  .features {
    padding: var(--section-padding-mobile, 48px 20px);
  }
  .features__card {
    flex-direction: column;
    gap: 0;
    padding: 36px 28px 32px;
  }
  .features__icon-wrap {
    margin-bottom: 28px;
  }
}

/* ─── 다크모드 ───────────────────────────── */
@media (prefers-color-scheme: dark) {
  .features {
    --bg: #0e0e0c;
    --card-bg: #161614;
    --text: #f0f0ee;
    --muted: #7a7a76;
    --border: #272724;
  }
  .features__icon-wrap--check { color: #a8d800; }
}
</style>