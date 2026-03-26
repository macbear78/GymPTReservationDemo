<template>
  <div>
    <div v-if="demoBannerVisible" class="demo-notice-banner">
      <span>🎯 이 화면은 포트폴리오 데모입니다. 실제 데이터가 아닙니다.</span>
      <button type="button" class="demo-notice-banner__close" aria-label="닫기" @click="demoBannerVisible = false">×</button>
    </div>
  <div class="max-w-7xl mx-auto px-4 py-6 sm:py-8">
    <header class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">예약 관리</h1>
      <p class="mt-1 text-slate-300 text-sm sm:text-base">PT 예약을 조회하고 상태를 관리하세요.</p>
    </header>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div class="rounded-xl border border-white/10 bg-[#141414] p-4 sm:p-5">
        <p class="text-slate-400 text-sm font-medium">오늘 예약</p>
        <p class="mt-1 text-2xl sm:text-3xl font-bold text-white">{{ stats.today }}</p>
      </div>
      <div class="rounded-xl border border-white/10 bg-[#141414] p-4 sm:p-5">
        <p class="text-slate-400 text-sm font-medium">이번 주 예약</p>
        <p class="mt-1 text-2xl sm:text-3xl font-bold text-white">{{ stats.week }}</p>
      </div>
      <div class="rounded-xl border border-white/10 bg-[#141414] p-4 sm:p-5">
        <p class="text-slate-400 text-sm font-medium">총 예약</p>
        <p class="mt-1 text-2xl sm:text-3xl font-bold text-white">{{ stats.total }}</p>
      </div>
      <div class="rounded-xl border border-amber-700/40 bg-amber-950/30 p-4 sm:p-5">
        <p class="text-amber-400 text-sm font-medium">승인 대기</p>
        <p class="mt-1 text-2xl sm:text-3xl font-bold text-yellow-600">{{ stats.pending }}</p>
      </div>
      <div class="rounded-xl border border-white/10 bg-[#141414] p-4 sm:p-5">
        <p class="text-slate-400 text-sm font-medium">취소 예약</p>
        <p class="mt-1 text-2xl sm:text-3xl font-bold text-red-600">{{ stats.cancelled }}</p>
      </div>
    </div>

    <!-- 필터 & 검색 -->
    <div class="rounded-xl border border-white/10 bg-[#141414] p-4 sm:p-6 mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">이름 검색</label>
            <input
              v-model="searchName"
              type="text"
              placeholder="이름"
              class="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1e1e1e] text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none placeholder-slate-400"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">전화번호 검색</label>
            <input
              :value="searchPhone"
              type="tel"
              placeholder="010-0000-0000"
              class="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1e1e1e] text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none placeholder-slate-400"
              @input="searchPhone = formatKoreanPhoneAsYouType($event.target.value)"
            />
          </div>
        </div>
        <div v-if="trainerNames.length > 1">
          <label class="block text-sm font-medium text-slate-300 mb-1">트레이너</label>
          <select
            v-model="filterTrainer"
            class="w-full sm:w-40 px-3 py-2 rounded-lg border border-white/10 bg-[#1e1e1e] text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          >
            <option value="">전체</option>
            <option v-for="t in trainerNames" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <div class="flex items-center gap-2 pt-1 sm:pt-5">
          <input
            id="showCancelled"
            v-model="showCancelled"
            type="checkbox"
            class="w-4 h-4 rounded border-white/10 text-primary-600 focus:ring-primary-500 cursor-pointer"
          />
          <label for="showCancelled" class="text-sm font-medium text-slate-300 cursor-pointer select-none whitespace-nowrap">
            취소 예약 포함
          </label>
        </div>
      </div>
    </div>

    <!-- 테이블 카드 -->
    <div class="rounded-xl border border-white/10 bg-[#141414] overflow-hidden">
      <div v-if="loading" class="p-12 text-center text-slate-400">불러오는 중…</div>
      <div v-else-if="error" class="p-6 text-red-600">{{ error }}</div>
      <AdminReservationsTable
        v-else
        :reservations="filteredReservations"
        :hide-trainer-column="trainerNames.length === 1"
        @update="onUpdate"
        @cancel="onCancel"
      />
    </div>

    <!-- 빈 상태 (데이터가 전혀 없을 때만) -->
    <div
      v-if="!loading && !error && reservations.length === 0"
      class="rounded-xl border border-white/10 bg-white/5 p-12 text-center"
    >
      <p class="text-slate-400 text-lg font-medium">예약이 없습니다</p>
      <p class="mt-2 text-slate-400 text-sm">새 예약이 들어오면 여기에 표시됩니다.</p>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
const demoBannerVisible = ref(true);
import AdminReservationsTable from '../components/AdminReservationsTable.vue';
import {
  getReservations,
  getReservationsV2,
  getTrainers,
  updateReservation,
  updateReservationV2,
  cancelReservation,
} from '../api';
import { formatKoreanPhoneAsYouType } from '../utils/phoneFormat';

const STORE_ID = 'store_default';

const reservations = ref([]);
const trainerNames = ref([]);
const searchName = ref('');
const searchPhone = ref('');
const filterTrainer = ref('');
const showCancelled = ref(false);
const loading = ref(true);
const error = ref('');

const todayStr = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

const weekRange = () => {
  const d = new Date();
  const day = d.getDay();
  const mon = new Date(d);
  mon.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  return {
    start: mon.toISOString().slice(0, 10),
    end: sun.toISOString().slice(0, 10),
  };
};

const stats = computed(() => {
  const list = reservations.value;
  const today = todayStr();
  const { start, end } = weekRange();
  return {
    today: list.filter((r) => r.date === today && r.status !== 'Cancelled').length,
    week: list.filter((r) => r.date >= start && r.date <= end && r.status !== 'Cancelled').length,
    total: list.length,
    cancelled: list.filter((r) => r.status === 'Cancelled').length,
    pending: list.filter((r) => r.status === 'Pending').length,
  };
});

/** 관리자 UI 상태 → v2 API status */
function mapUiStatusToV2(status) {
  const m = {
    Pending: 'PENDING',
    Confirmed: 'BOOKED',
    Completed: 'COMPLETED',
    Cancelled: 'CAD',
    'No-show': 'NO_SHOW',
  };
  return m[status] || status;
}

const filteredReservations = computed(() => {
  let list = reservations.value;
  if (!showCancelled.value) list = list.filter((r) => r.status !== 'Cancelled');
  const name = searchName.value.trim().toLowerCase();
  const phoneDigits = searchPhone.value.replace(/\D/g, '');
  if (name) list = list.filter((r) => (r.name || '').toLowerCase().includes(name));
  if (phoneDigits) {
    list = list.filter((r) =>
      (r.phone || '').replace(/\D/g, '').includes(phoneDigits)
    );
  }
  if (filterTrainer.value) list = list.filter((r) => r.trainer === filterTrainer.value);
  return list;
});

async function load() {
  loading.value = true;
  error.value = '';
  try {
    const [v2data, v1, trainers] = await Promise.all([
      getReservationsV2(STORE_ID),
      getReservations().catch(() => []),
      getTrainers(),
    ]);
    const v2List = Array.isArray(v2data?.reservations) ? v2data.reservations : [];
    const legacy = Array.isArray(v1) ? v1 : [];
    const merged = [
      ...v2List,
      ...legacy.map((r) => ({ ...r, source: 'v1', _v2: false })),
    ].sort((a, b) => {
      const d = (b.date || '').localeCompare(a.date || '');
      return d !== 0 ? d : (b.time || '').localeCompare(a.time || '');
    });
    reservations.value = merged;
    trainerNames.value = trainers.map((t) => t.name);
  } catch (e) {
    error.value = e.message || '예약 목록을 불러오지 못했습니다.';
  } finally {
    loading.value = false;
  }
}

async function onUpdate({ id, status, time, pt_type }) {
  const row = reservations.value.find((r) => r.id === id);
  if (!row) return;

  if (row._v2) {
    if (time != null || pt_type != null) {
      alert('신규 예약(v2)은 이 화면에서 시간·PT 유형 변경은 지원하지 않습니다. 상태만 변경할 수 있습니다.');
      return;
    }
    if (status == null) return;
    try {
      await updateReservationV2(STORE_ID, row.reservationId, {
        status: mapUiStatusToV2(status),
        date: row.date,
        time: row.time,
        trainerId: row.trainerKey || 'any',
      });
      await load();
    } catch (e) {
      alert(e.message || '변경에 실패했습니다.');
    }
    return;
  }

  try {
    await updateReservation(id, { status, time, pt_type });
    await load();
  } catch (e) {
    alert(e.message || '변경에 실패했습니다.');
  }
}

async function onCancel(id) {
  if (!confirm('이 예약을 취소하시겠습니까?')) return;
  const row = reservations.value.find((r) => r.id === id);
  if (!row) return;

  try {
    if (row._v2) {
      await updateReservationV2(STORE_ID, row.reservationId, {
        status: 'CAD',
        date: row.date,
        time: row.time,
        trainerId: row.trainerKey || 'any',
      });
    } else {
      await cancelReservation(id);
    }
    await load();
  } catch (e) {
    alert(e.message || '취소에 실패했습니다.');
  }
}

onMounted(load);
</script>

<style scoped>
.demo-notice-banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 40px 8px 8px;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
}

.demo-notice-banner__close {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #94a3b8;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.15s;
}

.demo-notice-banner__close:hover {
  background: rgba(0, 0, 0, 0.06);
  color: #475569;
}
</style>
