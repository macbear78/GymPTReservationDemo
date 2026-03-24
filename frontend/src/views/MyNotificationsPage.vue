<template>
  <div class="max-w-2xl mx-auto px-4 py-8 sm:py-12">
    <header class="mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">알림</h1>
      <p class="mt-2 text-slate-600 text-sm sm:text-base">예약 리마인더 및 회원권 안내를 확인하세요.</p>
    </header>

    <!-- 전화번호 조회 -->
    <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-8">
      <label class="block text-sm font-medium text-slate-700 mb-2">전화번호</label>
      <div class="flex gap-3">
        <input
          v-model="phoneQuery"
          type="tel"
          placeholder="010-0000-0000"
          class="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-slate-800 placeholder-slate-400"
          @keyup.enter="search"
        />
        <button
          type="button"
          :disabled="loading"
          class="px-6 py-3 rounded-xl font-semibold bg-primary-500 text-white hover:bg-primary-600 transition shadow-sm disabled:opacity-50"
          @click="search"
        >
          {{ loading ? '조회 중…' : '조회' }}
        </button>
      </div>
      <p v-if="searchError" class="mt-2 text-red-600 text-sm">{{ searchError }}</p>
    </section>

    <!-- 알림 목록 -->
    <section v-if="searched && !loading">
      <!-- 헤더 -->
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <h2 class="text-base font-semibold text-slate-700">알림 목록</h2>
          <span
            v-if="unreadCount > 0"
            class="px-2 py-0.5 rounded-full bg-primary-500 text-white text-xs font-bold"
          >{{ unreadCount }}</span>
        </div>
        <button
          v-if="unreadCount > 0"
          type="button"
          class="text-sm text-primary-600 hover:text-primary-700 font-medium transition"
          @click="markAllRead"
        >
          전체 읽음
        </button>
      </div>

      <!-- 필터 탭 -->
      <div class="flex gap-2 mb-4">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          type="button"
          class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
          :class="
            activeTab === tab.value
              ? 'bg-primary-500 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          "
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
          <span v-if="tab.value === 'UNREAD' && unreadCount > 0" class="ml-0.5 opacity-80"
            >({{ unreadCount }})</span
          >
        </button>
      </div>

      <!-- 빈 상태 -->
      <div
        v-if="filteredNotifications.length === 0"
        class="rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center text-slate-400"
      >
        <p class="text-sm">
          {{ activeTab === 'UNREAD' ? '읽지 않은 알림이 없습니다.' : '알림이 없습니다.' }}
        </p>
      </div>

      <!-- 알림 리스트 -->
      <div v-else class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <ul class="divide-y divide-slate-100">
          <li
            v-for="n in filteredNotifications"
            :key="n.notifId"
            class="px-5 py-4 flex items-start gap-3"
            :class="{ 'bg-primary-50/40': !n.isRead }"
          >
            <!-- 타입 인디케이터 -->
            <span
              class="mt-1.5 w-2 h-2 rounded-full shrink-0"
              :class="n.isRead ? 'bg-slate-200' : 'bg-primary-500'"
            />

            <div class="flex-1 min-w-0">
              <p class="text-sm text-slate-800 leading-relaxed">{{ n.message }}</p>
              <div class="flex items-center gap-2 mt-1.5">
                <span
                  class="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium"
                  :class="typeClass(n.type)"
                  >{{ typeLabel(n.type) }}</span
                >
                <span class="text-xs text-slate-400">{{ formatTime(n.createdAt) }}</span>
              </div>
            </div>

            <button
              v-if="!n.isRead"
              type="button"
              class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-500 shrink-0 transition"
              @click="markRead(n)"
            >
              읽음
            </button>
          </li>
        </ul>
      </div>

      <!-- 총 건수 -->
      <p v-if="notifications.length > 0" class="mt-3 text-xs text-slate-400 text-right">
        총 {{ notifications.length }}건
      </p>
    </section>

    <div v-if="loading" class="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 text-sm">
      불러오는 중…
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { lookupUser, getUserNotifications, markNotificationRead } from '../api';

const STORE_ID = 'store_default';

const phoneQuery = ref('');
const searchError = ref('');
const loading = ref(false);
const searched = ref(false);
const userId = ref('');
const notifications = ref([]);
const unreadCount = ref(0);
const activeTab = ref('ALL');

const tabs = [
  { label: '전체', value: 'ALL' },
  { label: '안읽음', value: 'UNREAD' },
  { label: '읽음', value: 'READ' },
];

const filteredNotifications = computed(() => {
  if (activeTab.value === 'UNREAD') return notifications.value.filter((n) => !n.isRead);
  if (activeTab.value === 'READ') return notifications.value.filter((n) => n.isRead);
  return notifications.value;
});

async function search() {
  const phone = phoneQuery.value.trim().replace(/\s/g, '');
  if (!phone) {
    searchError.value = '전화번호를 입력해 주세요.';
    return;
  }
  searchError.value = '';
  loading.value = true;
  searched.value = true;
  notifications.value = [];
  unreadCount.value = 0;
  try {
    const userInfo = await lookupUser(STORE_ID, phone);
    if (userInfo && userInfo.userId) {
      userId.value = userInfo.userId;
      await loadNotifications();
    }
  } catch (e) {
    if (e.needsName) {
      searchError.value = '등록되지 않은 전화번호입니다.';
    } else {
      searchError.value = e.message || '조회에 실패했습니다.';
    }
  } finally {
    loading.value = false;
  }
}

async function loadNotifications() {
  const data = await getUserNotifications(userId.value);
  notifications.value = data.notifications || [];
  unreadCount.value = data.unreadCount || 0;
}

async function markRead(notif) {
  try {
    await markNotificationRead(userId.value, notif.notifId);
    notif.isRead = true;
    unreadCount.value = Math.max(0, unreadCount.value - 1);
  } catch (e) {
    alert(e.message || '읽음 처리에 실패했습니다.');
  }
}

async function markAllRead() {
  try {
    await markNotificationRead(userId.value, 'all');
    notifications.value.forEach((n) => {
      n.isRead = true;
    });
    unreadCount.value = 0;
  } catch (e) {
    alert(e.message || '읽음 처리에 실패했습니다.');
  }
}

function typeLabel(type) {
  return (
    {
      SESSION_REMINDER: '리마인더',
      LOW_SESSIONS: '잔여세션',
      REPURCHASE_PROMO: '재구매',
      INACTIVITY_ALERT: '비활동',
      MANUAL: '공지',
    }[type] || type
  );
}

function typeClass(type) {
  return (
    {
      SESSION_REMINDER: 'bg-blue-100 text-blue-700',
      LOW_SESSIONS: 'bg-amber-100 text-amber-700',
      REPURCHASE_PROMO: 'bg-red-100 text-red-700',
      INACTIVITY_ALERT: 'bg-slate-100 text-slate-600',
      MANUAL: 'bg-violet-100 text-violet-700',
    }[type] || 'bg-slate-100 text-slate-600'
  );
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
</script>
