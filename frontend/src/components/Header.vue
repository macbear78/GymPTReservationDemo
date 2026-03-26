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
const { isLoggedIn: isAdminLoggedIn, checkToken: checkAdminToken, clearToken: clearAdminToken } = useAuth();

const memberLocked = computed(() => !isLoggedIn.value);
const adminLocked  = computed(() => !isAdminLoggedIn.value);

const mainNavItems = computed(() => navItems.filter(i => !i.hasMega || i.key === 'sns'));

const activeMenuKey = ref(null);
const mobileOpen = ref(false);
const mobileExpandedKey = ref(null);
const isScrolled = ref(false);
const headerHidden = ref(false);
let lastScrollY = 0;

function onScroll() {
  const y = window.scrollY;
  isScrolled.value = y > 20;

  if (y > lastScrollY && y > 80) {
    headerHidden.value = true;
    closeMenu();
  } else {
    headerHidden.value = false;
  }
  lastScrollY = y;
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

function adminLogout() {
  clearAdminToken();
  closeMenu();
  closeMobile();
}

function memberLogout() {
  clearSession();
  closeMenu();
  closeMobile();
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
    :class="{ 'header--scrolled': isScrolled, 'header--hidden': headerHidden }"
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

        <!-- Desktop nav (일반 링크 + SNS 메가메뉴) -->
        <nav class="header__nav" aria-label="주메뉴">
          <div
            v-for="item in mainNavItems"
            :key="item.key"
            class="header__nav-item"
            @mouseenter="item.hasMega ? openMenu(item.key) : closeMenu()"
          >
            <router-link
              v-if="item.href"
              :to="item.href"
              class="header__nav-link"
              :class="{ 'header__nav-link--white': item.key === 'story' || item.key === 'sns' }"
            >
              {{ item.label }}
            </router-link>
            <a
              v-else
              href="#"
              class="header__nav-link"
              :class="[
                { 'header__nav-link--active': activeMenuKey === item.key },
                { 'header__nav-link--white': item.key === 'sns' }
              ]"
              @click.prevent
            >
              {{ item.label }}
            </a>
          </div>
        </nav>

        <!-- Actions (회원·관리자 + 버거) -->
        <div class="header__actions">
          <div
            class="header__nav-item header__nav-item--mega"
            @mouseenter="openMenu('member')"
          >
            <a
              href="#"
              class="header__nav-action-btn"
              :class="{ 'header__nav-action-btn--active': activeMenuKey === 'member' }"
              @click.prevent
            >
              회원
            </a>
          </div>
          <div
            class="header__nav-item header__nav-item--mega"
            @mouseenter="openMenu('admin')"
          >
            <a
              href="#"
              class="header__nav-link header__nav-link--sub"
              :class="{ 'header__nav-link--active': activeMenuKey === 'admin' }"
              @click.prevent
            >
              관리자
            </a>
          </div>
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
              <div v-if="!memberLocked" class="header__mega-auth header__mega-auth--ok">
                <span class="header__mega-auth-dot"></span>
                {{ memberName }}님 로그인됨
                <button type="button" class="header__mega-auth-logout" @click="memberLogout">로그아웃</button>
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
              <div v-if="!adminLocked" class="header__mega-auth header__mega-auth--ok">
                <span class="header__mega-auth-dot"></span>
                관리자 로그인됨
                <button type="button" class="header__mega-auth-logout" @click="adminLogout">로그아웃</button>
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
            <!-- 외부 링크 (SNS 등) -->
            <a
              v-for="cat in activeMenu.categories.filter(c => c.external)"
              :key="cat.id"
              :href="cat.readMore"
              target="_blank"
              rel="noopener noreferrer"
              class="header__mega-card"
              @click="closeMenu"
            >
              <div class="header__mega-card-top">
                <h4 class="header__mega-card-title">{{ cat.title }}</h4>
                <span class="header__mega-card-arrow">↗</span>
              </div>
              <p class="header__mega-card-desc">{{ cat.description }}</p>
            </a>
            <!-- 내부 링크 -->
            <router-link
              v-for="cat in activeMenu.categories.filter(c => !c.external)"
              :key="cat.id"
              :to="(activeMenuKey === 'member' && memberLocked)
                ? '/login'
                : (activeMenuKey === 'admin' && adminLocked)
                  ? '/admin/login'
                  : cat.readMore"
              class="header__mega-card"
              :class="{
                'header__mega-card--locked':
                  (activeMenuKey === 'member' && memberLocked) ||
                  (activeMenuKey === 'admin' && adminLocked)
              }"
              @click="closeMenu"
            >
              <div class="header__mega-card-top">
                <h4 class="header__mega-card-title">{{ cat.title }}</h4>
                <span class="header__mega-card-arrow">
                  {{ (activeMenuKey === 'member' && memberLocked) || (activeMenuKey === 'admin' && adminLocked) ? '🔒' : '→' }}
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

                    <!-- 잠금 안내 (비로그인) -->
                    <div
                      v-if="(item.key === 'member' && memberLocked) || (item.key === 'admin' && adminLocked)"
                      class="header__mobile-locked-box"
                    >
                      <span>🔒</span>
                      <div>
                        <p class="header__mobile-locked-msg">
                          {{ item.key === 'admin' ? '관리자 로그인 후 이용 가능합니다' : '로그인 후 이용 가능합니다' }}
                        </p>
                        <p class="header__mobile-locked-hint">
                          {{ item.key === 'admin' ? '비밀번호: admin1234' : '010-0000-0001 / demo1234' }}
                        </p>
                      </div>
                      <router-link
                        :to="item.key === 'admin' ? '/admin/login' : '/login'"
                        class="header__mobile-locked-btn"
                        @click="closeMobile"
                      >
                        로그인
                      </router-link>
                    </div>

                    <!-- 로그인됨 안내 -->
                    <div
                      v-if="(item.key === 'member' && !memberLocked) || (item.key === 'admin' && !adminLocked)"
                      class="header__mobile-auth-box"
                    >
                      <span class="header__mobile-auth-dot"></span>
                      <span class="header__mobile-auth-text">
                        {{ item.key === 'admin' ? '관리자 로그인됨' : memberName + '님 로그인됨' }}
                      </span>
                      <button
                        type="button"
                        class="header__mobile-auth-logout"
                        @click="item.key === 'admin' ? adminLogout() : memberLogout()"
                      >
                        로그아웃
                      </button>
                    </div>

                    <!-- 외부 링크 (SNS 등) -->
                    <a
                      v-for="cat in (menuData[item.key]?.categories || []).filter(c => c.external)"
                      :key="cat.id"
                      :href="cat.readMore"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="header__mobile-link"
                      @click="closeMobile"
                    >
                      <strong>{{ cat.title }} ↗</strong>
                      <span>{{ cat.description }}</span>
                    </a>
                    <!-- 내부 링크 -->
                    <router-link
                      v-for="cat in (menuData[item.key]?.categories || []).filter(c => !c.external)"
                      :key="cat.id"
                      :to="(item.key === 'member' && memberLocked)
                        ? '/login'
                        : (item.key === 'admin' && adminLocked)
                          ? '/admin/login'
                          : cat.readMore"
                      class="header__mobile-link"
                      :class="{
                        'header__mobile-link--locked':
                          (item.key === 'member' && memberLocked) ||
                          (item.key === 'admin' && adminLocked)
                      }"
                      @click="closeMobile"
                    >
                      <strong>
                        {{ ((item.key === 'member' && memberLocked) || (item.key === 'admin' && adminLocked)) ? '🔒 ' : '' }}{{ cat.title }}
                      </strong>
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
  transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.35s ease;
}

.header--scrolled {
  background: var(--brand-dark);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.06);
}

.header--hidden {
  transform: translateY(-100%);
  pointer-events: none;
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
  padding: 0 20px;
  color: rgba(255, 255, 255, 0.86);
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-decoration: none;
  transition: color 0.2s ease;
}

.header__nav-link:hover,
.header__nav-link.router-link-active,
.header__nav-link--active {
  color: var(--brand-primary);
}

.header__nav-link.header__nav-link--white {
  color: #fff !important;
}

.header__nav-link.header__nav-link--white:hover {
  color: var(--brand-primary) !important;
}

.header__nav-link--sub {
  font-size: 15px;
}

.header__nav-item--mega {
  display: none;
  position: relative;
}

@media (min-width: 1025px) {
  .header__nav-item--mega {
    display: block;
  }
}

.header__nav-action-btn {
  display: inline-flex;
  align-items: center;
  height: 38px;
  padding: 0 18px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: rgba(255, 255, 255, 0.88);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.header__nav-action-btn:hover,
.header__nav-action-btn--active {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.28);
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

.header__mega-auth-logout {
  margin-left: auto;
  flex-shrink: 0;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.55);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.header__mega-auth-logout:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.header__mega-auth-logout--standalone {
  display: inline-block;
  margin-top: 10px;
}

/* 잠긴 카드 */
.header__mega-card--locked {
  opacity: 0.45;
  cursor: not-allowed;
  filter: grayscale(0.3);
}
.header__mega-card--locked:hover {
  transform: none;
  border-color: rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
}
.header__mega-card--locked .header__mega-card-arrow {
  font-size: 14px;
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

/* 모바일 잠금 안내 */
.header__mobile-locked-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 8px;
  font-size: 13px;
}

.header__mobile-locked-msg {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-weight: 600;
}

.header__mobile-locked-hint {
  margin: 2px 0 0;
  color: rgba(255, 255, 255, 0.35);
  font-size: 11px;
}

.header__mobile-locked-btn {
  margin-left: auto;
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: 8px;
  background: var(--brand-primary);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.header__mobile-link--locked {
  opacity: 0.45;
  pointer-events: auto;
}

/* 모바일 로그인됨 상태 */
.header__mobile-auth-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(26, 188, 156, 0.1);
  border: 1px solid rgba(26, 188, 156, 0.18);
  margin-bottom: 8px;
}

.header__mobile-auth-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand-primary);
  flex-shrink: 0;
}

.header__mobile-auth-text {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.header__mobile-auth-logout {
  margin-left: auto;
  flex-shrink: 0;
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.6);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.header__mobile-auth-logout:hover {
  background: rgba(255, 255, 255, 0.12);
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
