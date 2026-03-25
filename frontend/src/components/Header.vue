<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { navItems } from "../data/menuData.js";
import { useStoreInfo }   from "../composables/useStoreInfo.js";
import { useMemberAuth }  from "../composables/useMemberAuth.js";

const { storeName, logoImage, logoText, load: loadStoreInfo } = useStoreInfo();
const { isLoggedIn, name: memberName, clearSession, checkToken } = useMemberAuth();

const mobileOpen = ref(false);
const isScrolled = ref(false);

function onScroll() {
  isScrolled.value = window.scrollY > 20;
}

function toggleMobileMenu() {
  mobileOpen.value = !mobileOpen.value;
}

function closeMobile() {
  mobileOpen.value = false;
}

function onResize() {
  if (typeof window === "undefined") return;
  if (window.innerWidth >= 1025 && mobileOpen.value) {
    closeMobile();
  }
}

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  onScroll();
  loadStoreInfo();
  checkToken();
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
});
</script>

<template>
  <header
    class="header"
    :class="{ 'header--scrolled': isScrolled }"
  >
    <div class="header__bar">
      <div class="header__inner">
        <!-- Logo -->
        <router-link to="/" class="header__logo" aria-label="홈">
          <img
            v-if="logoImage"
            :src="logoImage"
            alt="로고"
            class="header__logo-img"
          />
          <template v-else>
            <span class="header__logo-icon"></span>
            <span class="header__logo-text">{{ logoText || storeName }}</span>
          </template>
        </router-link>

        <!-- Desktop nav -->
        <nav class="header__nav" aria-label="주메뉴">
          <div
            v-for="item in navItems"
            :key="item.key"
            class="header__nav-item"
          >
            <router-link
              :to="item.href"
              class="header__nav-link"
            >
              {{ item.label }}
            </router-link>
          </div>
        </nav>

        <!-- Actions -->
        <div class="header__actions">
          <template v-if="isLoggedIn">
            <router-link to="/dashboard" class="header__member-link">{{ memberName }}님</router-link>
            <button type="button" class="header__logout-btn" @click="clearSession">로그아웃</button>
          </template>
          <router-link v-else to="/login" class="header__login-link">로그인</router-link>
          <router-link to="/reserve" class="header__cta">PT 예약</router-link>

          <button
            type="button"
            class="header__burger"
            aria-label="메뉴 열기"
            :aria-expanded="mobileOpen"
            @click="toggleMobileMenu"
          >
            <span class="header__burger-line"></span>
            <span class="header__burger-line"></span>
            <span class="header__burger-line"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile -->
    <Transition name="mobile-panel">
      <div v-if="mobileOpen" class="header__mobile">
        <div class="header__mobile-backdrop" @click="closeMobile"></div>

        <div class="header__mobile-panel">
          <div class="header__mobile-top">
            <router-link to="/" class="header__logo" aria-label="홈">
              <img
                v-if="logoImage"
                :src="logoImage"
                alt="로고"
                class="header__logo-img"
              />
              <template v-else>
                <span class="header__logo-icon"></span>
                <span class="header__logo-text">{{ logoText || storeName }}</span>
              </template>
            </router-link>

            <button
              type="button"
              class="header__mobile-close"
              aria-label="메뉴 닫기"
              @click="closeMobile"
            >
              ×
            </button>
          </div>

          <nav class="header__mobile-nav" aria-label="모바일 메뉴">
            <router-link
              v-for="item in navItems"
              :key="item.key"
              :to="item.href"
              class="header__mobile-link header__mobile-link--top"
              @click="closeMobile"
            >
              <strong>{{ item.label }}</strong>
            </router-link>
          </nav>

          <router-link to="/reserve" class="header__mobile-cta" @click="closeMobile">
            PT 예약
          </router-link>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  background: rgba(31, 42, 48, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
}

.header--scrolled {
  background: var(--brand-dark);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.06);
}

.header__bar {
  border-bottom: 1px solid transparent;
}

.header__inner {
  max-width: 1400px;
  height: 72px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 24px;
}

.header__logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.02em;
}

.header__logo:hover {
  color: #fff;
}

.header__logo-icon {
  width: 32px;
  height: 32px;
  background: var(--brand-primary);
  border-radius: 6px;
  flex-shrink: 0;
}

.header__login-link {
  display: none;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  transition: color 0.2s;
}
.header__login-link:hover { color: #fff; }

.header__member-link {
  display: none;
  font-size: 13px;
  font-weight: 600;
  color: var(--brand-primary);
  text-decoration: none;
}

.header__logout-btn {
  display: none;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255,255,255,0.5);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}
.header__logout-btn:hover { color: rgba(255,255,255,0.8); }

@media (min-width: 1025px) {
  .header__login-link,
  .header__member-link,
  .header__logout-btn { display: inline-flex; align-items: center; }
}

.header__logo-img {
  height: 36px;
  width: auto;
  max-width: 160px;
  object-fit: contain;
  flex-shrink: 0;
}

.header__nav {
  display: none;
  justify-content: center;
  align-items: center;
  gap: 6px;
}

@media (min-width: 1025px) {
  .header__nav {
    display: flex;
  }
}

.header__nav-item {
  position: relative;
}

.header__nav-link {
  display: inline-flex;
  align-items: center;
  height: 72px;
  padding: 0 16px;
  color: rgba(255, 255, 255, 0.86);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}

.header__nav-link:hover,
.header__nav-link.router-link-active {
  color: var(--brand-primary);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header__cta {
  display: none;
  padding: 10px 20px;
  background: var(--brand-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.2s ease, box-shadow 0.2s ease;
}

.header__cta:hover {
  background: var(--brand-primary-hover);
  color: #fff;
  box-shadow: 0 4px 14px rgba(26, 188, 156, 0.35);
}

@media (min-width: 1025px) {
  .header__cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}

.header__burger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

@media (min-width: 1025px) {
  .header__burger {
    display: none;
  }
}

.header__burger-line {
  width: 22px;
  height: 2px;
  background: #fff;
  border-radius: 999px;
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.header__burger[aria-expanded="true"] .header__burger-line:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.header__burger[aria-expanded="true"] .header__burger-line:nth-child(2) {
  opacity: 0;
}

.header__burger[aria-expanded="true"] .header__burger-line:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* mobile */
.header__mobile {
  position: fixed;
  inset: 0;
  z-index: 210;
  display: flex;
  justify-content: flex-end;
}

@media (min-width: 1025px) {
  .header__mobile {
    display: none;
  }
}

.header__mobile-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.54);
}

.header__mobile-panel {
  position: relative;
  width: min(380px, 92vw);
  height: 100vh;
  background: var(--brand-dark);
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px 20px 28px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.header__mobile-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.header__mobile-close {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  font-size: 24px;
  cursor: pointer;
}

.header__mobile-nav {
  padding-top: 14px;
  display: flex;
  flex-direction: column;
}

.header__mobile-link {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 12px;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.header__mobile-link span {
  color: rgba(255, 255, 255, 0.66);
  font-size: 13px;
  line-height: 1.5;
}

.header__mobile-link:hover {
  background: rgba(255, 255, 255, 0.07);
}

.header__mobile-link--top {
  margin-bottom: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 16px;
}

.header__mobile-cta {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  border-radius: 10px;
  background: var(--brand-primary);
  color: #fff;
  text-decoration: none;
  font-size: 15px;
  font-weight: 700;
}

.header__mobile-cta:hover {
  background: var(--brand-primary-hover);
  color: #fff;
}

/* transitions */
.mobile-panel-enter-active,
.mobile-panel-leave-active {
  transition: opacity 0.25s ease;
}

.mobile-panel-enter-active .header__mobile-panel,
.mobile-panel-leave-active .header__mobile-panel {
  transition: transform 0.25s ease;
}

.mobile-panel-enter-from,
.mobile-panel-leave-to {
  opacity: 0;
}

/* 모바일 패널이 사라지는 중에는 아래 페이지로 클릭이 통과 */
.mobile-panel-leave-active {
  pointer-events: none;
}

.mobile-panel-enter-from .header__mobile-panel,
.mobile-panel-leave-to .header__mobile-panel {
  transform: translateX(100%);
}
</style>
