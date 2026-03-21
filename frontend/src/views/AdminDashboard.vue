<template>
  <div class="max-w-7xl mx-auto px-4 py-6 sm:py-8">
    <header class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">예약 관리</h1>
      <p class="mt-1 text-slate-600 text-sm sm:text-base">PT 예약을 조회하고 상태를 관리하세요.</p>
    </header>

    <!-- 통계 카드 -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div class="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <p class="text-slate-500 text-sm font-medium">오늘 예약</p>
        <p class="mt-1 text-2xl sm:text-3xl font-bold text-slate-800">{{ stats.today }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <p class="text-slate-500 text-sm font-medium">이번 주 예약</p>
        <p class="mt-1 text-2xl sm:text-3xl font-bold text-slate-800">{{ stats.week }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <p class="text-slate-500 text-sm font-medium">총 예약</p>
        <p class="mt-1 text-2xl sm:text-3xl font-bold text-slate-800">{{ stats.total }}</p>
      </div>
      <div class="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
        <p class="text-slate-500 text-sm font-medium">취소 예약</p>
        <p class="mt-1 text-2xl sm:text-3xl font-bold text-red-600">{{ stats.cancelled }}</p>
      </div>
    </div>

    <!-- 필터 & 검색 -->
    <div class="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm mb-6">
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div class="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">이름 검색</label>
            <input
              v-model="searchName"
              type="text"
              placeholder="이름"
              class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-slate-800 placeholder-slate-400"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">전화번호 검색</label>
            <input
              v-model="searchPhone"
              type="text"
              placeholder="전화번호"
              class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">트레이너</label>
          <select
            v-model="filterTrainer"
            class="w-full sm:w-40 px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-slate-800"
          >
            <option value="">전체</option>
            <option v-for="t in trainerNames" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 테이블 카드 -->
    <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div v-if="loading" class="p-12 text-center text-slate-500">불러오는 중…</div>
      <div v-else-if="error" class="p-6 text-red-600">{{ error }}</div>
      <AdminReservationsTable
        v-else
        :reservations="filteredReservations"
        @update="onUpdate"
        @cancel="onCancel"
      />
    </div>

    <!-- 빈 상태 (데이터가 전혀 없을 때만) -->
    <div
      v-if="!loading && !error && reservations.length === 0"
      class="rounded-xl border border-slate-200 bg-slate-50/50 p-12 text-center"
    >
      <p class="text-slate-500 text-lg font-medium">예약이 없습니다</p>
      <p class="mt-2 text-slate-400 text-sm">새 예약이 들어오면 여기에 표시됩니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AdminReservationsTable from '../components/AdminReservationsTable.vue';
import { getReservations, getTrainers, updateReservation, cancelReservation } from '../api';

const reservations = ref([]);
const trainerNames = ref([]);
const searchName = ref('');
const searchPhone = ref('');
const filterTrainer = ref('');
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
  };
});

const filteredReservations = computed(() => {
  let list = reservations.value;
  const name = searchName.value.trim().toLowerCase();
  const phone = searchPhone.value.trim().replace(/\s/g, '');
  if (name) list = list.filter((r) => (r.name || '').toLowerCase().includes(name));
  if (phone) list = list.filter((r) => (r.phone || '').replace(/\s/g, '').includes(phone));
  if (filterTrainer.value) list = list.filter((r) => r.trainer === filterTrainer.value);
  return list;
});

async function load() {
  loading.value = true;
  error.value = '';
  try {
    const [res, trainers] = await Promise.all([getReservations(), getTrainers()]);
    reservations.value = res;
    trainerNames.value = trainers.map((t) => t.name);
  } catch (e) {
    error.value = e.message || '예약 목록을 불러오지 못했습니다.';
  } finally {
    loading.value = false;
  }
}

async function onUpdate({ id, status, time, pt_type }) {
  try {
    await updateReservation(id, { status, time, pt_type });
    await load();
  } catch (e) {
    alert(e.message || '변경에 실패했습니다.');
  }
}

async function onCancel(id) {
  if (!confirm('이 예약을 취소하시겠습니까?')) return;
  try {
    await cancelReservation(id);
    await load();
  } catch (e) {
    alert(e.message || '취소에 실패했습니다.');
  }
}

onMounted(load);
</script>
