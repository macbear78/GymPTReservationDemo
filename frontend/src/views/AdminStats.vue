<template>
  <div class="max-w-6xl mx-auto px-4 py-6 sm:py-8">
    <header class="mb-6 sm:mb-8 flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">통계</h1>
        <p class="mt-1 text-slate-500 text-sm sm:text-base">예약·회원·패스 현황을 확인합니다.</p>
      </div>
      <!-- 월 선택 -->
      <div class="flex items-center gap-2">
        <button type="button" class="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition" @click="changeMonth(-1)">←</button>
        <span class="text-slate-700 font-medium text-sm w-24 text-center">{{ selectedYear }}년 {{ selectedMonth }}월</span>
        <button type="button" class="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition" @click="changeMonth(1)">→</button>
      </div>
    </header>

    <div v-if="loading" class="text-center text-slate-400 py-16">불러오는 중…</div>
    <div v-else-if="error" class="text-center text-red-500 py-16">{{ error }}</div>

    <template v-else-if="stats">
      <!-- KPI 카드 -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-slate-500 text-xs font-medium">총 예약</p>
          <p class="mt-1 text-3xl font-bold text-slate-800">{{ stats.reservations.total }}</p>
          <p class="mt-1 text-xs text-slate-400">완료 {{ stats.reservations.completionRate }}%</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-slate-500 text-xs font-medium">완료</p>
          <p class="mt-1 text-3xl font-bold text-emerald-600">{{ stats.reservations.completed }}</p>
          <p class="mt-1 text-xs text-slate-400">취소 {{ stats.reservations.cancelled }}건</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-slate-500 text-xs font-medium">전체 회원</p>
          <p class="mt-1 text-3xl font-bold text-sky-600">{{ stats.members.total }}</p>
          <p class="mt-1 text-xs text-slate-400">신규 {{ stats.members.newThisMonth }}명</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-slate-500 text-xs font-medium">활성 패스</p>
          <p class="mt-1 text-3xl font-bold text-violet-600">{{ stats.passes.active }}</p>
          <p class="mt-1 text-xs text-slate-400">이달 발급 {{ stats.passes.issuedThisMonth }}건</p>
        </div>
      </div>

      <!-- 상태 분포 + 월별 트렌드 -->
      <div class="grid lg:grid-cols-2 gap-6 mb-6">
        <!-- 예약 상태 분포 -->
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="font-semibold text-slate-800 mb-4 text-sm">예약 상태 분포</h2>
          <div class="space-y-3">
            <div v-for="item in statusItems" :key="item.label" class="flex items-center gap-3">
              <span class="w-16 text-xs text-slate-500 shrink-0">{{ item.label }}</span>
              <div class="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="item.color"
                  :style="{ width: statusBarWidth(item.count) }"
                />
              </div>
              <span class="w-8 text-xs font-semibold text-slate-700 text-right shrink-0">{{ item.count }}</span>
            </div>
          </div>
        </div>

        <!-- 최근 6개월 트렌드 (완료/취소/노쇼 스택) -->
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="font-semibold text-slate-800 mb-1 text-sm">최근 6개월 예약 추이</h2>
          <div class="flex items-center gap-3 mb-4 text-[10px] text-slate-500">
            <span class="flex items-center gap-1"><span class="inline-block w-2.5 h-2.5 rounded-sm bg-emerald-400"></span>완료</span>
            <span class="flex items-center gap-1"><span class="inline-block w-2.5 h-2.5 rounded-sm bg-red-300"></span>취소</span>
            <span class="flex items-center gap-1"><span class="inline-block w-2.5 h-2.5 rounded-sm bg-slate-300"></span>노쇼</span>
            <span class="flex items-center gap-1"><span class="inline-block w-2.5 h-2.5 rounded-sm bg-amber-300"></span>예약</span>
          </div>
          <div class="flex items-end gap-2 h-32">
            <div
              v-for="m in stats.monthlyTrend"
              :key="m.month"
              class="flex-1 flex flex-col items-center gap-1"
            >
              <span class="text-[10px] text-slate-500 font-medium">{{ m.total }}</span>
              <div class="w-full flex flex-col-reverse rounded-t-sm overflow-hidden" :style="{ height: trendBarHeight(m.total) }">
                <div class="w-full bg-emerald-400 transition-all" :style="{ flexBasis: stackPct(m, 'completed') }"></div>
                <div class="w-full bg-red-300 transition-all" :style="{ flexBasis: stackPct(m, 'cancelled') }"></div>
                <div class="w-full bg-slate-300 transition-all" :style="{ flexBasis: stackPct(m, 'noShow') }"></div>
                <div class="w-full bg-amber-300 transition-all" :style="{ flexBasis: stackPct(m, 'booked') }"></div>
              </div>
              <span class="text-[9px] text-slate-400 truncate w-full text-center">{{ m.month.slice(5) }}월</span>
            </div>
          </div>
          <p v-if="stats.monthlyTrend.every(m => m.total === 0)" class="text-center text-slate-400 text-xs mt-2">데이터 없음</p>
        </div>
      </div>

      <!-- 요일별 분포 + 시간대별 분포 -->
      <div class="grid lg:grid-cols-2 gap-6 mb-6">
        <!-- 요일별 분포 -->
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="font-semibold text-slate-800 mb-4 text-sm">요일별 예약 분포</h2>
          <div v-if="stats.dowDist && stats.dowDist.some(d => d.count > 0)" class="space-y-2">
            <div v-for="d in stats.dowDist" :key="d.dow" class="flex items-center gap-3">
              <span class="w-5 text-xs text-slate-500 shrink-0 text-center font-medium">{{ d.label }}</span>
              <div class="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                <div
                  class="h-full rounded-full bg-sky-400 transition-all duration-500"
                  :style="{ width: dowBarWidth(d.count) }"
                />
              </div>
              <span class="w-6 text-xs font-semibold text-slate-700 text-right shrink-0">{{ d.count }}</span>
            </div>
          </div>
          <p v-else class="text-center text-slate-400 text-sm py-6">데이터 없음</p>
        </div>

        <!-- 시간대별 인기 -->
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="font-semibold text-slate-800 mb-4 text-sm">시간대별 예약 분포</h2>
          <div v-if="stats.timeSlotDist && stats.timeSlotDist.length > 0" class="space-y-2 max-h-52 overflow-y-auto pr-1">
            <div v-for="t in stats.timeSlotDist" :key="t.time" class="flex items-center gap-3">
              <span class="w-12 text-xs text-slate-500 shrink-0 font-mono">{{ t.time }}</span>
              <div class="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                <div
                  class="h-full rounded-full bg-violet-400 transition-all duration-500"
                  :style="{ width: timeBarWidth(t.count) }"
                />
              </div>
              <span class="w-6 text-xs font-semibold text-slate-700 text-right shrink-0">{{ t.count }}</span>
            </div>
          </div>
          <p v-else class="text-center text-slate-400 text-sm py-6">데이터 없음</p>
        </div>
      </div>

      <!-- 트레이너별 실적 -->
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm mb-6">
        <h2 class="font-semibold text-slate-800 mb-4 text-sm">트레이너별 실적</h2>
        <div v-if="stats.trainerStats && stats.trainerStats.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-100">
                <th class="text-left py-2 pr-4 text-xs font-medium text-slate-500">트레이너</th>
                <th class="text-right py-2 px-3 text-xs font-medium text-slate-500">총 예약</th>
                <th class="text-right py-2 px-3 text-xs font-medium text-slate-500">완료</th>
                <th class="text-right py-2 px-3 text-xs font-medium text-slate-500">취소</th>
                <th class="text-right py-2 px-3 text-xs font-medium text-slate-500">노쇼</th>
                <th class="text-right py-2 pl-3 text-xs font-medium text-slate-500">완료율</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="t in stats.trainerStats" :key="t.trainerId" class="hover:bg-slate-50">
                <td class="py-2.5 pr-4 font-medium text-slate-800">{{ t.trainerName }}</td>
                <td class="py-2.5 px-3 text-right text-slate-700">{{ t.total }}</td>
                <td class="py-2.5 px-3 text-right text-emerald-600 font-medium">{{ t.completed }}</td>
                <td class="py-2.5 px-3 text-right text-red-400">{{ t.cancelled }}</td>
                <td class="py-2.5 px-3 text-right text-slate-400">{{ t.noShow }}</td>
                <td class="py-2.5 pl-3 text-right">
                  <span
                    class="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                    :class="t.completionRate >= 80 ? 'bg-emerald-100 text-emerald-700' : t.completionRate >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'"
                  >{{ t.completionRate }}%</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-center text-slate-400 text-sm py-6">데이터 없음</p>
      </div>

      <!-- 기간 상세 -->
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="font-semibold text-slate-800 mb-3 text-sm">{{ selectedYear }}년 {{ selectedMonth }}월 상세</h2>
        <dl class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <dt class="text-slate-500 text-xs">예약 완료율</dt>
            <dd class="font-bold text-emerald-600 text-lg">{{ stats.reservations.completionRate }}%</dd>
          </div>
          <div>
            <dt class="text-slate-500 text-xs">취소율</dt>
            <dd class="font-bold text-red-500 text-lg">{{ stats.reservations.cancellationRate }}%</dd>
          </div>
          <div>
            <dt class="text-slate-500 text-xs">노쇼</dt>
            <dd class="font-bold text-slate-700 text-lg">{{ stats.reservations.noShow }}건</dd>
          </div>
          <div>
            <dt class="text-slate-500 text-xs">대기 중</dt>
            <dd class="font-bold text-amber-600 text-lg">{{ stats.reservations.booked }}건</dd>
          </div>
        </dl>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { getStoreStats } from '../api';

const STORE_ID = 'store_default';

const now = new Date();
const selectedYear  = ref(now.getFullYear());
const selectedMonth = ref(now.getMonth() + 1);
const loading = ref(false);
const error   = ref('');
const stats   = ref(null);

const statusItems = computed(() => {
  if (!stats.value) return [];
  const r = stats.value.reservations;
  return [
    { label: '완료',   count: r.completed, color: 'bg-emerald-500' },
    { label: '예약',   count: r.booked,    color: 'bg-amber-400' },
    { label: '취소',   count: r.cancelled, color: 'bg-red-400' },
    { label: '노쇼',   count: r.noShow,    color: 'bg-slate-400' },
  ];
});

function statusBarWidth(count) {
  if (!stats.value) return '0%';
  const max = stats.value.reservations.total || 1;
  return `${Math.round((count / max) * 100)}%`;
}

function trendBarHeight(total) {
  if (!stats.value) return '0px';
  const max = Math.max(...stats.value.monthlyTrend.map((m) => m.total), 1);
  return `${Math.max(Math.round((total / max) * 96), total > 0 ? 4 : 0)}px`;
}

function stackPct(m, field) {
  if (!m.total) return '0%';
  return `${Math.round((m[field] / m.total) * 100)}%`;
}

function dowBarWidth(count) {
  if (!stats.value?.dowDist) return '0%';
  const max = Math.max(...stats.value.dowDist.map(d => d.count), 1);
  return `${Math.round((count / max) * 100)}%`;
}

function timeBarWidth(count) {
  if (!stats.value?.timeSlotDist) return '0%';
  const max = Math.max(...stats.value.timeSlotDist.map(t => t.count), 1);
  return `${Math.round((count / max) * 100)}%`;
}

function changeMonth(delta) {
  let m = selectedMonth.value + delta;
  let y = selectedYear.value;
  if (m > 12) { m = 1; y++; }
  if (m < 1)  { m = 12; y--; }
  selectedMonth.value = m;
  selectedYear.value  = y;
}

async function loadStats() {
  loading.value = true;
  error.value = '';
  try {
    stats.value = await getStoreStats(STORE_ID, { year: selectedYear.value, month: selectedMonth.value });
  } catch (e) {
    error.value = e.message || '통계 조회에 실패했습니다.';
  } finally {
    loading.value = false;
  }
}

watch([selectedYear, selectedMonth], loadStats);
onMounted(loadStats);
</script>
