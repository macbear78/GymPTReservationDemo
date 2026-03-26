<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { navItems, menuData } from "../data/menuData.js";

defineProps({
  /** Portfolio demo banner height — header sits below fixed banner */
  topOffset: { type: Number, default: 0 },
});
import { useStoreInfo }   from "../composables/useStoreInfo.js";
import { useMemberAuth }  from "../composables/useMemberAuth.js";
import { useAuth }        from "../composables/useAuth.js";

const { storeName, logoImage, logoText, load: loadStoreInfo } = useStoreInfo();
const { isLoggedIn, name: memberName, clearSession, checkToken } = useMemberAuth();
const { isLoggedIn: isAdminLoggedIn, checkToken: checkAdminToken } = useAuth();

const activeMenuKey = ref(null);
const mobileOpen = ref(false);
const mobileExpandedKey = ref(null);
const isScrolled = ref(false);

function onScroll() {
  isScrolled.value = window.scrollY > 20;
}

function openMenu(key) {
  activeMenuKey.value = key;
}

function closeMenu() {
  activeMenuKey.value = null;
}

const activeMenu = computed(() => {
  if (!activeMenuKey.value) return null;
  return menuData[activeMenuKey.value] || null;
});

function toggleMobileMenu() {
  mobileOpen.value = !mobileOpen.value;
  if (!mobileOpen.value) mobileExpandedKey.value = null;
}

function toggleMobileExpand(key) {
  mobileExpandedKey.value = mobileExpandedKey.value === key ? null : key;
}

function closeMobile() {
  mobileOpen.value = false;
  mobileExpandedKey.value = null;
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
  checkAdminToken();
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
    :style="{ top: `${topOffset}px` }"
    @mouseleave="closeMenu"
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
            @mouseenter="item.hasMega ? openMenu(item.key) : closeMenu()"
          >
            <router-link
              v-if="item.href"
              :to="item.href"
              class="header__nav-link"
            >
              {{ item.label }}
            </router-link>
            <a
              v-else
              href="#"
              class="header__nav-link"
              :class="{ 'header__nav-link--active': activeMenuKey === item.key }"
              @click.prevent
            >
              {{ item.label }}
            </a>
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

          <router-link to="/admin/login" class="header__admin-btn" aria-label="관리자">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </router-link>

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

    <!-- Desktop Mega Menu -->
    <Transition name="mega-fade">
      <div v-if="activeMenu" class="header__mega" :aria-hidden="!activeMenu">
        <div class="header__mega-inner">
          <div class="header__mega-side">
            <p class="header__mega-eyebrow">{{ activeMenu.eyebrow }}</p>
            <h3 class="header__mega-title">{{ activeMenu.title }}</h3>
            <p class="header__mega-desc">{{ activeMenu.description }}</p>

            <!-- 회원 메뉴: 로그인 상태 표시 -->
            <template v-if="activeMenuKey === 'member'">
              <div v-if="isLoggedIn" class="header__mega-auth header__mega-auth--ok">
                <span class="header__mega-auth-dot"></span>
                {{ memberName }}님 로그인됨
              </div>
              <div v-else class="header__mega-auth header__mega-auth--locked">
                <span>🔒</span>
                <div>
                  <p class="header__mega-auth-msg">로그인 후 이용 가능합니다</p>
                  <p class="header__mega-auth-hint">010-0000-0001 / demo1234</p>
                </div>
                <router-link to="/login" class="header__mega-auth-btn" @click="closeMenu">로그인</router-link>
              </div>
            </template>

            <!-- 관리자 메뉴: 로그인 상태 표시 -->
            <template v-if="activeMenuKey === 'admin'">
              <div v-if="isAdminLoggedIn" class="header__mega-auth header__mega-auth--ok">
                <span class="header__mega-auth-dot"></span>
                관리자 로그인됨
              </div>
              <div v-else class="header__mega-auth header__mega-auth--locked">
                <span>🔒</span>
                <div>
                  <p class="header__mega-auth-msg">관리자 로그인 후 이용 가능합니다</p>
                  <p class="header__mega-auth-hint">비밀번호: admin1234</p>
                </div>
                <router-link to="/admin/login" class="header__mega-auth-btn" @click="closeMenu">로그인</router-link>
              </div>
            </template>

            <router-link
              v-if="activeMenu.overviewLink"
              :to="activeMenu.overviewLink"
              class="header__mega-overview"
              @click="closeMenu"
            >
              전체 보기 →
            </router-link>
          </div>
          <div class="header__mega-grid">
            <router-link
              v-for="cat in activeMenu.categories"
              :key="cat.id"
              :to="(activeMenuKey === 'member' && !isLoggedIn) || (activeMenuKey === 'admin' && !isAdminLoggedIn)
                ? (activeMenuKey === 'admin' ? '/admin/login' : '/login')
                : cat.readMore"
              class="header__mega-card"
              :class="{
                'header__mega-card--locked':
                  (activeMenuKey === 'member' && !isLoggedIn) ||
                  (activeMenuKey === 'admin' && !isAdminLoggedIn)
              }"
              @click="closeMenu"
            >
              <div class="header__mega-card-top">
                <h4 class="header__mega-card-title">{{ cat.title }}</h4>
                <span class="header__mega-card-arrow">
                  {{ (activeMenuKey === 'member' && !isLoggedIn) || (activeMenuKey === 'admin' && !isAdminLoggedIn) ? '🔒' : '→' }}
                </span>
              </div>
              <p class="header__mega-card-desc">{{ cat.description }}</p>
            </router-link>
          </div>
        </div>
      </div>
    </Transition>

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
            <div v-for="item in navItems" :key="item.key" class="header__mobile-item">
              <!-- 단순 링크 -->
              <router-link
                v-if="!item.hasMega && item.href"
                :to="item.href"
                class="header__mobile-link header__mobile-link--top"
                @click="closeMobile"
              >
                <strong>{{ item.label }}</strong>
              </router-link>
              <!-- 아코디언 (hasMega) -->
              <template v-else>
                <button
                  type="button"
                  class="header__mobile-trigger"
                  :aria-expanded="mobileExpandedKey === item.key"
                  @click="toggleMobileExpand(item.key)"
                >
                  <span>{{ item.label }}</span>
                  <span class="header__mobile-chevron" :class="{ 'is-open': mobileExpandedKey === item.key }">+</span>
                </button>
                <Transition name="accordion">
                  <div v-if="mobileExpandedKey === item.key" class="header__mobile-drop">
                    <p class="header__mobile-desc">{{ menuData[item.key]?.description }}</p>
                    <router-link
                      v-for="cat in menuData[item.key]?.categories || []"
                      :key="cat.id"
                      :to="cat.readMore"
                      class="header__mobile-link"
                      @click="closeMobile"
                    >
                      <strong>{{ cat.title }}</strong>
                      <span>{{ cat.description }}</span>
                    </router-link>
                  </div>
                </Transition>
              </template>
            </div>
          </nav>

          <router-link to="/reserve" class="header__mobile-cta" @click="closeMobile">
            지금 무료 상담 받기
          </router-link>

          <router-link to="/admin/login" class="header__mobile-admin" @click="closeMobile">
            🔒 관리자 로그인
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
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  text-decoration: none;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  padding: 8px 16px;
  transition: background 0.2s, color 0.2s;
}
.header__login-link:hover {
  background: rgba(255,255,255,0.18);
  color: #fff;
}

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

/* desktop mega */
.header__mega {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: 0 24px 20px;
}
.header__mega-inner {
  max-width: 1400px;
  margin: 0 auto;
  background: rgba(31, 42, 48, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
  display: grid;
  grid-template-columns: 320px 1fr;
  overflow: hidden;
}
.header__mega-side {
  padding: 32px 28px;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
}
.header__mega-eyebrow {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 700;
  color: var(--brand-primary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.header__mega-title {
  margin: 0 0 12px;
  color: #fff;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 700;
}
.header__mega-desc {
  margin: 0;
  color: rgba(255, 255, 255, 0.74);
  font-size: 14px;
  line-height: 1.7;
}
.header__mega-overview {
  display: inline-block;
  margin-top: 20px;
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}
.header__mega-overview:hover { color: var(--brand-primary); }

/* 인증 상태 배지 */
.header__mega-auth {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 13px;
}
.header__mega-auth--ok {
  background: rgba(26, 188, 156, 0.12);
  border: 1px solid rgba(26, 188, 156, 0.25);
  color: #1abc9c;
  font-weight: 600;
}
.header__mega-auth-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1abc9c;
  flex-shrink: 0;
}
.header__mega-auth--locked {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
}
.header__mega-auth--locked > span:first-child { font-size: 16px; flex-shrink: 0; }
.header__mega-auth--locked > div { flex: 1; min-width: 0; }
.header__mega-auth-msg { margin: 0; font-size: 12px; font-weight: 600; }
.header__mega-auth-hint { margin: 2px 0 0; font-size: 11px; color: rgba(255,255,255,0.4); }
.header__mega-auth-btn {
  flex-shrink: 0;
  padding: 5px 12px;
  border-radius: 8px;
  background: var(--brand-primary);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s;
}
.header__mega-auth-btn:hover { background: var(--brand-primary-hover); }

/* 잠긴 카드 */
.header__mega-card--locked {
  opacity: 0.55;
  cursor: default;
}
.header__mega-card--locked:hover {
  transform: none;
  border-color: rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
}
.header__mega-grid {
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.header__mega-card {
  display: block;
  padding: 18px;
  border-radius: 16px;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: transform 0.2s, border-color 0.2s, background 0.2s;
}
.header__mega-card:hover {
  transform: translateY(-2px);
  border-color: rgba(26, 188, 156, 0.45);
  background: rgba(255, 255, 255, 0.05);
}
.header__mega-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
}
.header__mega-card-title {
  margin: 0;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
}
.header__mega-card-arrow { color: var(--brand-primary); font-size: 16px; flex-shrink: 0; }
.header__mega-card-desc {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 13px;
  line-height: 1.6;
}

/* mega transition */
.mega-fade-enter-active,
.mega-fade-leave-active { transition: opacity 0.22s ease, transform 0.22s ease; }
.mega-fade-enter-from,
.mega-fade-leave-to { opacity: 0; transform: translateY(-6px); }
.mega-fade-leave-active { pointer-events: none; }

/* mobile accordion */
.header__mobile-item { border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.header__mobile-trigger {
  width: 100%;
  padding: 16px 0;
  background: transparent;
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
.header__mobile-chevron {
  font-size: 22px;
  line-height: 1;
  opacity: 0.7;
  transition: transform 0.2s ease;
}
.header__mobile-chevron.is-open { transform: rotate(45deg); }
.header__mobile-drop {
  padding: 0 0 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.header__mobile-desc {
  margin: 0 0 2px;
  color: rgba(255, 255, 255, 0.58);
  font-size: 13px;
  line-height: 1.6;
}
.accordion-enter-active,
.accordion-leave-active { transition: all 0.2s ease; overflow: hidden; }
.accordion-enter-from,
.accordion-leave-to { opacity: 0; transform: translateY(-4px); }

/* 관리자 아이콘 버튼 */
.header__admin-btn {
  display: none;
  width: 36px;
  height: 36px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.35);
  text-decoration: none;
  transition: color 0.2s, background 0.2s;
  flex-shrink: 0;
}
.header__admin-btn svg {
  width: 16px;
  height: 16px;
}
.header__admin-btn:hover {
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.08);
}
@media (min-width: 1025px) {
  .header__admin-btn { display: inline-flex; }
}

/* 모바일 관리자 링크 */
.header__mobile-admin {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  transition: color 0.2s;
}
.header__mobile-admin:hover {
  color: rgba(255, 255, 255, 0.6);
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
