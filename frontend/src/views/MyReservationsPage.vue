<template>
  <div class="max-w-2xl mx-auto px-4 py-8 sm:py-12">
    <header class="mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">예약 확인</h1>
      <p class="mt-2 text-slate-600 text-sm sm:text-base">예약 시 입력한 전화번호로 조회하세요.</p>
    </header>

    <!-- 전화번호 조회 -->
    <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-8">
      <label class="block text-sm font-medium text-slate-700 mb-2">전화번호</label>
      <div class="flex gap-3">
        <input
          :value="phoneQuery"
          type="tel"
          inputmode="numeric"
          autocomplete="tel"
          placeholder="010-0000-0000"
          class="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-slate-800 placeholder-slate-400"
          @input="onPhoneQueryInput"
          @keyup.enter="search"
        />
        <button
          type="button"
          class="px-6 py-3 rounded-xl font-semibold bg-primary-500 text-white hover:bg-primary-600 transition shadow-sm"
          @click="search"
        >
          조회
        </button>
      </div>
      <p v-if="searchError" class="mt-2 text-red-600 text-sm">{{ searchError }}</p>
    </section>

    <!-- 패스 현황 -->
    <section v-if="searched && !loading && passes.length > 0" class="mb-6">
      <h2 class="text-base font-semibold text-slate-700 mb-3">내 PT 패스</h2>
      <div class="grid gap-3 sm:grid-cols-2">
        <div
          v-for="pass in passes"
          :key="pass.passId"
          class="rounded-2xl border p-4 shadow-sm"
          :class="{
            'bg-emerald-50 border-emerald-200': pass.status === 'ACTIVE',
            'bg-slate-50 border-slate-200': pass.status === 'EXHAUSTED',
            'bg-red-50 border-red-200': pass.status === 'EXPIRED',
          }"
        >
          <div class="flex items-start justify-between gap-2">
            <div>
              <p
                class="text-2xl font-bold"
                :class="{
                  'text-emerald-700': pass.status === 'ACTIVE',
                  'text-slate-500': pass.status === 'EXHAUSTED',
                  'text-red-600': pass.status === 'EXPIRED',
                }"
              >
                {{ pass.remainingSessions }}
                <span class="text-base font-normal">/ {{ pass.totalSessions }}회 남음</span>
              </p>
              <p class="text-xs text-slate-500 mt-1">만료일 {{ pass.expiryDate }}</p>
              <p v-if="pass.memo" class="text-xs text-slate-400 mt-0.5">{{ pass.memo }}</p>
            </div>
            <span
              class="px-2 py-0.5 rounded-full text-xs font-semibold shrink-0"
              :class="{
                'bg-emerald-500 text-white': pass.status === 'ACTIVE',
                'bg-slate-400 text-white': pass.status === 'EXHAUSTED',
                'bg-red-400 text-white': pass.status === 'EXPIRED',
              }"
            >
              {{ { ACTIVE: '활성', EXHAUSTED: '소진', EXPIRED: '만료' }[pass.status] }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- 알림 섹션 -->
    <section v-if="searched && !loading && notifications.length > 0" class="mb-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-base font-semibold text-slate-700 flex items-center gap-2">
          알림
          <span v-if="unreadCount > 0" class="px-2 py-0.5 rounded-full bg-primary-500 text-white text-xs font-bold">{{ unreadCount }}</span>
        </h2>
        <div class="flex items-center gap-3">
          <button
            v-if="unreadCount > 0"
            type="button"
            class="text-xs text-slate-500 hover:text-slate-700 transition"
            @click="markAllNotifRead"
          >
            전체 읽음
          </button>
          <router-link
            to="/my-notifications"
            class="text-xs text-primary-600 hover:text-primary-700 font-medium transition"
          >
            전체 보기
          </router-link>
        </div>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <ul class="divide-y divide-slate-100">
          <li
            v-for="n in notifications"
            :key="n.notifId"
            class="px-4 py-3 flex items-start gap-3"
            :class="{ 'bg-primary-50/40': !n.isRead }"
          >
            <span
              class="mt-1.5 w-2 h-2 rounded-full shrink-0"
              :class="n.isRead ? 'bg-slate-200' : 'bg-primary-500'"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-slate-800">{{ n.message }}</p>
              <p class="text-xs text-slate-400 mt-0.5">{{ formatNotifTime(n.createdAt) }}</p>
            </div>
            <button
              v-if="!n.isRead"
              type="button"
              class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-500 shrink-0 transition"
              @click="markNotifRead(n)"
            >
              읽음
            </button>
          </li>
        </ul>
      </div>
    </section>

    <!-- 결과 -->
    <div v-if="searched && !loading" class="space-y-4">
      <p v-if="reservations.length === 0" class="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
        해당 전화번호로 등록된 예약이 없습니다.
      </p>
      <div v-else class="space-y-4">
        <p class="text-slate-600 text-sm">총 {{ reservations.length }}건</p>
        <article
          v-for="r in reservations"
          :key="r.id"
          class="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
        >
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <dl class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:text-base flex-1 min-w-0">
              <dt class="text-slate-500">트레이너</dt>
              <dd class="font-medium text-slate-800">{{ r.trainer }}</dd>
              <dt class="text-slate-500">날짜</dt>
              <dd class="font-medium text-slate-800">{{ formatDate(r.date) }}</dd>
              <dt class="text-slate-500">시간</dt>
              <dd class="font-medium text-slate-800">{{ r.time }}</dd>
              <dt class="text-slate-500">PT 유형</dt>
              <dd class="font-medium text-slate-800">{{ r.pt_type === '60min' ? '60분' : '30분' }}</dd>
            </dl>
            <div class="flex items-center gap-3 sm:flex-col sm:items-end">
              <span
                :class="[
                  'inline-flex px-3 py-1 rounded-full text-xs font-medium shrink-0',
                  statusClass(r.status),
                ]"
              >
                {{ statusLabel(r.status) }}
              </span>
              <button
                v-if="r.status === 'Confirmed'"
                type="button"
                class="px-4 py-2 rounded-xl text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition"
                @click="cancelReservation(r)"
              >
                예약 취소
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>

    <div v-if="loading" class="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
      조회 중…
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getReservations, cancelReservation as cancelReservationApi, lookupUser, getUserPasses, getUserNotifications, markNotificationRead } from '../api';
import { formatKoreanPhoneAsYouType } from '../utils/phoneFormat.js';

// 알림 읽음 처리 (개별)
async function markNotifRead(notif) {
  try {
    await markNotificationRead(currentUserId.value, notif.notifId);
    notif.isRead = true;
    unreadCount.value = Math.max(0, unreadCount.value - 1);
  } catch {
    // 조용히 실패
  }
}

// 알림 전체 읽음 처리
async function markAllNotifRead() {
  try {
    await markNotificationRead(currentUserId.value, 'all');
    notifications.value.forEach((n) => { n.isRead = true; });
    unreadCount.value = 0;
  } catch {
    // 조용히 실패
  }
}

const STORE_ID = 'store_default';

function onPhoneQueryInput(e) {
  phoneQuery.value = formatKoreanPhoneAsYouType(e.target.value);
}

const phoneQuery = ref('');
const reservations = ref([]);
const loading = ref(false);
const searched = ref(false);
const searchError = ref('');
const passes = ref([]);
const notifications = ref([]);
const unreadCount = ref(0);
const currentUserId = ref('');

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${y}년 ${m}월 ${d}일`;
}

function statusClass(status) {
  switch (status) {
    case 'Confirmed':
      return 'bg-emerald-100 text-emerald-800';
    case 'Completed':
      return 'bg-blue-100 text-blue-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

function statusLabel(status) {
  const map = {
    Confirmed: '확정',
    Completed: '완료',
    Cancelled: '취소',
  };
  return map[status] || status;
}

async function search() {
  const phone = phoneQuery.value.replace(/\D/g, '');
  if (!phone) {
    searchError.value = '전화번호를 입력해 주세요.';
    return;
  }
  searchError.value = '';
  loading.value = true;
  searched.value = true;
  passes.value = [];
  try {
    const [reservationData] = await Promise.all([
      getReservations(null, phone),
    ]);
    reservations.value = reservationData;

    // 패스·알림 정보 조회 (userId 필요 → lookupUser로 조회)
    try {
      const userInfo = await lookupUser(STORE_ID, phone);
      if (userInfo && userInfo.userId) {
        currentUserId.value = userInfo.userId;
        const [passData, notifData] = await Promise.allSettled([
          getUserPasses(userInfo.userId),
          getUserNotifications(userInfo.userId, { limit: 10 }),
        ]);
        passes.value = passData.status === 'fulfilled' ? (passData.value.passes || []) : [];
        notifications.value = notifData.status === 'fulfilled' ? (notifData.value.notifications || []) : [];
        unreadCount.value = notifData.status === 'fulfilled' ? (notifData.value.unreadCount || 0) : 0;
      }
    } catch {
      // 패스/알림 조회 실패는 무시 (예약 조회는 표시)
    }
  } catch (e) {
    searchError.value = e.message || '조회에 실패했습니다.';
    reservations.value = [];
  } finally {
    loading.value = false;
  }
}

function formatNotifTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

async function cancelReservation(r) {
  if (!confirm(`이 예약을 취소하시겠습니까?\n${r.trainer} · ${r.date} ${r.time}`)) return;
  try {
    await cancelReservationApi(r.id);
    reservations.value = reservations.value.filter((x) => x.id !== r.id);
  } catch (e) {
    alert(e.message || '취소에 실패했습니다.');
  }
}
</script>
