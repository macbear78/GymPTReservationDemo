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
          v-model="phoneQuery"
          type="tel"
          placeholder="010-0000-0000"
          class="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-slate-800 placeholder-slate-400"
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
import { getReservations, cancelReservation as cancelReservationApi } from '../api';

const phoneQuery = ref('');
const reservations = ref([]);
const loading = ref(false);
const searched = ref(false);
const searchError = ref('');

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
  const phone = phoneQuery.value.trim().replace(/\s/g, '');
  if (!phone) {
    searchError.value = '전화번호를 입력해 주세요.';
    return;
  }
  searchError.value = '';
  loading.value = true;
  searched.value = true;
  try {
    reservations.value = await getReservations(null, phone);
  } catch (e) {
    searchError.value = e.message || '조회에 실패했습니다.';
    reservations.value = [];
  } finally {
    loading.value = false;
  }
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
