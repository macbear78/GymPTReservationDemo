<template>
  <section class="about-hero" aria-labelledby="about-heading">

    <!-- 왼쪽: 세로 텍스트 레일 -->
    <aside class="about-hero__rail" aria-hidden="true">
      <span class="about-hero__rail-text">ABOUT&nbsp;US</span>
    </aside>

    <!-- 중앙 콘텐츠 -->
    <div class="about-hero__body">

      <!-- 태그라인 -->
      <p
        v-scroll-animate
        data-animate="fade-right"
        data-delay="0"
        class="about-hero__tag"
      >
        <span class="about-hero__tag-dot" aria-hidden="true"></span>
        단순한 헬스장이 아닙니다
      </p>

      <!-- 메인 헤딩 -->
      <h2
        id="about-heading"
        v-scroll-animate
        data-animate="fade-up"
        data-delay="100"
        class="about-hero__heading"
      >
        <em class="about-hero__heading-em">하나의</em>
        <br />공동체입니다.
      </h2>

      <!-- 구분선 -->
      <div
        v-scroll-animate
        data-animate="fade-right"
        data-delay="250"
        class="about-hero__divider"
        aria-hidden="true"
      ></div>

      <!-- 설명 -->
      <p
        v-scroll-animate
        data-animate="fade-up"
        data-delay="350"
        class="about-hero__desc"
      >
        운동만이 아니라 생활 전반이 함께 바뀌는 공간입니다.<br />
        회원 한 분 한 분의 목표를 존중하고,<br />
        편안하게 머무를 수 있는 커뮤니티를 지향합니다.
      </p>

      <!-- CTA 버튼 -->
      <div
        v-scroll-animate
        data-animate="fade-up"
        data-delay="450"
        class="about-hero__cta"
      >
        <router-link to="/passes" class="about-hero__btn about-hero__btn--fill">
          지금 구독하세요
          <svg class="about-hero__btn-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </router-link>
        <router-link to="/classes" class="about-hero__btn about-hero__btn--ghost">
          강좌 찾아보기
        </router-link>
      </div>
    </div>

    <!-- 오른쪽: 숫자 스택 -->
    <aside
      v-scroll-animate
      data-animate="fade-left"
      data-delay="200"
      class="about-hero__stats"
      aria-label="주요 통계"
    >
      <div
        v-for="(stat, i) in stats"
        :key="stat.label"
        class="about-hero__stat"
        :style="`--i: ${i}`"
      >
        <span class="about-hero__stat-num">{{ stat.num }}</span>
        <span class="about-hero__stat-label">{{ stat.label }}</span>
      </div>
    </aside>

    <!-- 사선 장식 -->
    <div class="about-hero__slash" aria-hidden="true"></div>

  </section>
</template>

<script setup>
const stats = [
  { num: '500+', label: '활성 회원' },
  { num: '98%',  label: '만족도' },
  { num: '10+',  label: '전문 트레이너' },
  { num: '5년',  label: '운영 경력' },
]
</script>

<style scoped>
/* ─── 토큰 ─────────────────────────────────── */
.about-hero {
  --col-left: 56px;
  --col-right: 220px;
  --accent: #d4f24a;        /* 라임 포인트 */
  --text-main: #0e0e0e;
  --text-muted: #6b6b6b;
  --border: #e2e2e2;
  --bg: #f7f7f5;

  position: relative;
  display: grid;
  grid-template-columns: var(--col-left) 1fr var(--col-right);
  grid-template-rows: 1fr;
  min-height: 540px;
  background: var(--bg);
  overflow: hidden;
}

/* ─── 왼쪽 세로 레일 ────────────────────────── */
.about-hero__rail {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid var(--border);
}
.about-hero__rail-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: #c4c4c4;
  text-transform: uppercase;
}

/* ─── 중앙 본문 ──────────────────────────────── */
.about-hero__body {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px 60px 80px 52px;
  position: relative;
  z-index: 1;
}

/* 태그라인 */
.about-hero__tag {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-muted);
  margin: 0 0 20px;
}
.about-hero__tag-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  flex-shrink: 0;
}

/* 헤딩 */
.about-hero__heading {
  font-size: clamp(2.6rem, 5.5vw, 4.2rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--text-main);
  margin: 0;
}
.about-hero__heading-em {
  font-style: normal;
  position: relative;
  display: inline-block;
}
.about-hero__heading-em::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 4px;
  width: 100%;
  height: 10px;
  background: var(--accent);
  z-index: -1;
  transform: skewX(-4deg);
}

/* 구분선 */
.about-hero__divider {
  width: 48px;
  height: 3px;
  background: var(--text-main);
  margin: 28px 0;
  border-radius: 2px;
}

/* 설명 */
.about-hero__desc {
  font-size: 15px;
  line-height: 1.8;
  color: var(--text-muted);
  margin: 0 0 36px;
  max-width: 420px;
}

/* CTA */
.about-hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
.about-hero__btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.22s ease;
  cursor: pointer;
  white-space: nowrap;
}
.about-hero__btn--fill {
  background: var(--text-main);
  color: #fff;
  border: 2px solid var(--text-main);
}
.about-hero__btn--fill:hover {
  background: #2a2a2a;
  border-color: #2a2a2a;
}
.about-hero__btn-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.about-hero__btn--ghost {
  background: transparent;
  color: var(--text-main);
  border: 2px solid var(--border);
}
.about-hero__btn--ghost:hover {
  border-color: var(--text-main);
}

/* ─── 오른쪽 통계 패널 ──────────────────────── */
.about-hero__stats {
  grid-column: 3;
  grid-row: 1;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border);
}
.about-hero__stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 28px;
  border-bottom: 1px solid var(--border);
  transition: background 0.2s;
}
.about-hero__stat:last-child {
  border-bottom: none;
}
.about-hero__stat:hover {
  background: #fff;
}
.about-hero__stat-num {
  font-size: clamp(1.8rem, 2.8vw, 2.4rem);
  font-weight: 900;
  color: var(--text-main);
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 4px;
}
.about-hero__stat-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

/* ─── 사선 배경 장식 ────────────────────────── */
.about-hero__slash {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background: linear-gradient(
    108deg,
    transparent 58%,
    rgba(212, 242, 74, 0.07) 58%,
    rgba(212, 242, 74, 0.07) 100%
  );
}

/* ─── 반응형 ─────────────────────────────────── */
@media (max-width: 900px) {
  .about-hero {
    grid-template-columns: var(--col-left) 1fr;
    grid-template-rows: auto auto;
    min-height: unset;
  }
  .about-hero__stats {
    grid-column: 1 / -1;
    grid-row: 2;
    flex-direction: row;
    flex-wrap: wrap;
    border-left: none;
    border-top: 1px solid var(--border);
  }
  .about-hero__stat {
    flex: 1 1 50%;
    padding: 24px 20px;
    border-bottom: 1px solid var(--border);
    border-right: 1px solid var(--border);
  }
  .about-hero__stat:nth-child(even) { border-right: none; }
  .about-hero__stat:nth-last-child(-n+2) { border-bottom: none; }
}

@media (max-width: 600px) {
  .about-hero__rail { display: none; }
  .about-hero {
    grid-template-columns: 1fr;
  }
  .about-hero__body {
    padding: 56px 24px 40px;
  }
  .about-hero__stats {
    grid-column: 1;
  }
  .about-hero__stat {
    flex: 1 1 50%;
  }
}

/* ─── 다크 모드 ──────────────────────────────── */
@media (prefers-color-scheme: dark) {
  .about-hero {
    --accent: #d4f24a;
    --text-main: #f0f0ee;
    --text-muted: #9a9a9a;
    --border: #2c2c2c;
    --bg: #111110;
  }
  .about-hero__stat:hover { background: #1a1a18; }
  .about-hero__btn--fill {
    background: #f0f0ee;
    color: #111;
    border-color: #f0f0ee;
  }
  .about-hero__btn--fill:hover { background: #d4d4d0; }
  .about-hero__btn--ghost { color: #f0f0ee; }
}
</style>