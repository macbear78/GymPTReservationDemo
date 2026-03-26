<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <!-- Top: brand + nav -->
      <div class="site-footer__top">
        <div class="site-footer__brand">
          <p class="site-footer__name">GymPT 강남점</p>
          <p class="site-footer__tagline">프리미엄 1:1 퍼스널 트레이닝</p>
        </div>

        <nav class="site-footer__nav" aria-label="푸터 메뉴">
          <router-link to="/trainers">트레이너 소개</router-link>
          <router-link to="/passes">프로그램·패스</router-link>
          <router-link to="/reserve">PT 예약</router-link>
          <router-link to="/dashboard">내 PT · 예약</router-link>
        </nav>
      </div>

      <!-- Middle: info -->
      <div class="site-footer__info">
        <div class="site-footer__info-item">
          <span class="site-footer__info-label">주소</span>
          <span>서울특별시 강남구 테헤란로 427</span>
        </div>
        <div class="site-footer__info-item">
          <span class="site-footer__info-label">전화</span>
          <a href="tel:0212345678" class="site-footer__link">02-1234-5678</a>
        </div>
        <div class="site-footer__info-item">
          <span class="site-footer__info-label">운영시간</span>
          <span>평일 06:00 – 23:00 / 주말 08:00 – 20:00</span>
        </div>
      </div>

      <!-- Bottom: copyright + social + admin -->
      <div class="site-footer__bottom">
        <p class="site-footer__copy">© 2025 GymPT. All rights reserved.</p>

        <div class="site-footer__social">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            class="site-footer__social-link"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="site-footer__social-icon">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
            </svg>
            <span>Instagram</span>
          </a>
        </div>
      </div>

      <!-- Admin (barely visible) -->
      <div class="site-footer__admin-row">
        <router-link to="/admin/login" class="site-footer__admin">관리자</router-link>
      </div>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  storeName: { type: String, default: 'GymPT 강남점' },
  tagline: { type: String, default: '프리미엄 1:1 퍼스널 트레이닝' },
});
</script>

<style scoped>
.site-footer {
  background: #09090b;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 56px 0 32px;
}

.site-footer__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ── Top ── */
.site-footer__top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.site-footer__name {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.02em;
}

.site-footer__tagline {
  margin: 6px 0 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
}

.site-footer__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.site-footer__nav a {
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.55);
  text-decoration: none;
  transition: color 0.2s;
}

.site-footer__nav a:hover {
  color: #fff;
}

/* ── Info ── */
.site-footer__info {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 40px;
  padding: 28px 0;
}

.site-footer__info-item {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.6;
}

.site-footer__info-label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  margin-right: 8px;
}

.site-footer__link {
  color: rgba(255, 255, 255, 0.45);
  text-decoration: none;
  transition: color 0.2s;
}

.site-footer__link:hover {
  color: #fff;
}

/* ── Bottom ── */
.site-footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.site-footer__copy {
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
}

.site-footer__social {
  display: flex;
  gap: 12px;
}

.site-footer__social-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  text-decoration: none;
  transition: color 0.2s;
}

.site-footer__social-link:hover {
  color: #fff;
}

.site-footer__social-icon {
  width: 18px;
  height: 18px;
}

/* ── Admin link ── */
.site-footer__admin-row {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.site-footer__admin {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.2);
  text-decoration: none;
  transition: color 0.15s;
}

.site-footer__admin:hover {
  color: rgba(255, 255, 255, 0.4);
}

/* ── Mobile ── */
@media (max-width: 640px) {
  .site-footer__top {
    flex-direction: column;
    gap: 20px;
  }

  .site-footer__nav {
    gap: 14px;
  }

  .site-footer__info {
    flex-direction: column;
    gap: 8px;
  }

  .site-footer__bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
