<template>
  <section class="insta" aria-labelledby="insta-heading">

    <!-- 헤더 -->
    <header class="insta__header">
      <div class="insta__header-left">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener"
          class="insta__handle"
          aria-label="인스타그램 계정으로 이동"
        >
          <svg class="insta__handle-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" stroke-width="1.8"/>
            <circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.8"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
          </svg>
          @gymfit.korea
        </a>
        <h2
          id="insta-heading"
          v-scroll-animate
          data-animate="fade-up"
          data-delay="0"
          class="insta__heading"
        >
          인스타그램에서<br />
          <span class="insta__heading-em">소식 받기</span>
        </h2>
      </div>

      <div class="insta__header-right">
        <p class="insta__subtext">
          매일 업데이트되는 운동 팁,<br />
          회원 후기, 이벤트 소식을 팔로우하세요.
        </p>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener"
          class="insta__follow-btn"
        >
          팔로우하기
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    </header>

    <!-- 갤러리 그리드 -->
    <div class="insta__grid">
      <button
        v-for="(post, index) in items"
        :key="post.id"
        v-scroll-animate
        data-animate="fade-up"
        :data-delay="String(index * 60)"
        type="button"
        class="insta__cell"
        :class="[
          index === 2 ? 'insta__cell--main' : '',
          `insta__cell--${index}`
        ]"
        :aria-label="post.alt || `인스타그램 사진 ${index + 1}`"
        @click="emit('open-post', post)"
      >
        <img
          :src="post.image"
          :alt="post.alt || ''"
          class="insta__cell-img"
          loading="lazy"
        />
        <!-- 호버 오버레이 -->
        <span class="insta__cell-overlay" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="white" stroke-width="1.5"/>
            <circle cx="12" cy="12" r="4.5" stroke="white" stroke-width="1.5"/>
            <circle cx="17.5" cy="6.5" r="1" fill="white"/>
          </svg>
        </span>
        <!-- 메인 셀 뱃지 -->
        <span v-if="index === 2" class="insta__cell-badge" aria-hidden="true">
          FEATURED
        </span>
      </button>
    </div>

    <!-- 하단 팔로워 바 -->
    <div class="insta__footer">
      <span class="insta__footer-stat">
        <strong>12.4K</strong> 팔로워
      </span>
      <span class="insta__footer-sep" aria-hidden="true">·</span>
      <span class="insta__footer-stat">
        <strong>847</strong> 게시물
      </span>
      <span class="insta__footer-sep" aria-hidden="true">·</span>
      <span class="insta__footer-stat">
        <strong>320</strong> 팔로잉
      </span>
    </div>

  </section>
</template>

<script setup>
import { computed } from 'vue'

const FALLBACKS = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=85',
  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=85',
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=85',
  'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=800&q=85',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=85',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=85',
  'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=85',
  'https://images.unsplash.com/photo-1606889464198-fcb18894cf50?w=800&q=85',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=85',
]

const DEFAULT_POSTS = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  image: '',
  alt: `헬스장 사진 ${i + 1}`,
  isMain: i === 2,
}))

const props = defineProps({
  posts: { type: Array, default: null },
})
const emit = defineEmits(['open-post'])

const items = computed(() => {
  const raw = props.posts?.length === 9 ? props.posts : DEFAULT_POSTS
  return raw.map((post, i) => ({
    ...post,
    image: post.image?.trim() || FALLBACKS[i % FALLBACKS.length],
  }))
})
</script>

<style scoped>
/* ─── 토큰 ────────────────────────────────── */
.insta {
  --bg: #f7f7f5;
  --text: #0e0e0c;
  --muted: #6b6b68;
  --accent: #d4f24a;
  --border: #e2e2de;
  --cell-radius: 8px;

  background: var(--bg);
  color: var(--text);
  padding: 80px 0 0;
  overflow: hidden;
}

/* ─── 헤더 ───────────────────────────────── */
.insta__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 60px 48px;
  gap: 32px;
  flex-wrap: wrap;
}
.insta__header-left {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* 핸들 링크 */
.insta__handle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s;
}
.insta__handle:hover { color: var(--text); }
.insta__handle-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* 헤딩 */
.insta__heading {
  font-size: clamp(2rem, 5.5vw, 4.8rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.04em;
  margin: 0;
}
.insta__heading-em {
  position: relative;
  display: inline-block;
}
.insta__heading-em::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 3px;
  width: 100%;
  height: 8px;
  background: var(--accent);
  z-index: -1;
  transform: skewX(-3deg);
}

/* 오른쪽 */
.insta__header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 20px;
  max-width: 300px;
}
.insta__subtext {
  font-size: 17px;
  line-height: 1.7;
  color: var(--muted);
  margin: 0;
  text-align: right;
}
.insta__follow-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: var(--text);
  color: var(--bg);
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.2s;
}
.insta__follow-btn:hover { background: #2a2a28; }
.insta__follow-btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* ─── 그리드 ──────────────────────────────── */
.insta__grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 260px 260px;
  gap: 4px;
  /* 전체 너비 채움 (패딩 없음) */
}

/* 기본 셀 */
.insta__cell {
  position: relative;
  overflow: hidden;
  background: #2a2a28;
  border: none;
  padding: 0;
  cursor: pointer;
  display: block;
}
.insta__cell-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              filter 0.4s ease;
}
.insta__cell:hover .insta__cell-img {
  transform: scale(1.06);
  filter: brightness(0.75);
}

/* 오버레이 아이콘 */
.insta__cell-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}
.insta__cell-overlay svg {
  width: 36px;
  height: 36px;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));
}
.insta__cell:hover .insta__cell-overlay { opacity: 1; }

/* 메인 셀 — col3 row-span-2 */
.insta__cell--main {
  grid-column: 3;
  grid-row: 1 / 3;
}
.insta__cell-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #0e0e0c;
  background: var(--accent);
  padding: 4px 10px;
  border-radius: 4px;
}

/* 나머지 셀 위치 명시 (col3 건너뜀) */
.insta__cell--0 { grid-column: 1; grid-row: 1; }
.insta__cell--1 { grid-column: 2; grid-row: 1; }
.insta__cell--3 { grid-column: 4; grid-row: 1; }
.insta__cell--4 { grid-column: 5; grid-row: 1; }
.insta__cell--5 { grid-column: 1; grid-row: 2; }
.insta__cell--6 { grid-column: 2; grid-row: 2; }
.insta__cell--7 { grid-column: 4; grid-row: 2; }
.insta__cell--8 { grid-column: 5; grid-row: 2; }

/* 좌우 끝 셀 첫 번째 행: 위 모서리 라운드 */
.insta__cell--0 { border-radius: var(--cell-radius) 0 0 0; }
.insta__cell--4 { border-radius: 0 var(--cell-radius) 0 0; }
.insta__cell--5 { border-radius: 0 0 0 var(--cell-radius); }
.insta__cell--8 { border-radius: 0 0 var(--cell-radius) 0; }

/* ─── 하단 팔로워 바 ──────────────────────── */
.insta__footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 20px 60px;
  border-top: 1px solid var(--border);
  margin-top: 4px;
}
.insta__footer-stat {
  font-size: 16px;
  color: var(--muted);
}
.insta__footer-stat strong {
  font-size: 20px;
  font-weight: 900;
  color: var(--text);
  margin-right: 4px;
}
.insta__footer-sep {
  color: var(--border);
  font-size: 18px;
}

/* ─── 반응형 ─────────────────────────────── */
@media (max-width: 900px) {
  .insta__header { padding: 0 32px 36px; }
  .insta__grid {
    grid-template-rows: 180px 180px;
  }
  .insta__footer { padding: 18px 32px; }
}
@media (max-width: 600px) {
  .insta__header {
    flex-direction: column;
    align-items: flex-start;
    padding: 0 20px 28px;
  }
  .insta__header-right { align-items: flex-start; max-width: none; }
  .insta__subtext { text-align: left; }
  .insta__grid {
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 140px);
  }
  /* 모바일: 3열 일반 그리드, 메인 셀 span 해제 */
  .insta__cell--main {
    grid-column: auto;
    grid-row: auto;
  }
  .insta__cell--0,
  .insta__cell--1,
  .insta__cell--3,
  .insta__cell--4,
  .insta__cell--5,
  .insta__cell--6,
  .insta__cell--7,
  .insta__cell--8 {
    grid-column: auto;
    grid-row: auto;
  }
  .insta__cell--0,
  .insta__cell--4,
  .insta__cell--5,
  .insta__cell--8 { border-radius: 0; }
  .insta__footer { flex-wrap: wrap; gap: 16px; padding: 16px 20px; }
}
</style>