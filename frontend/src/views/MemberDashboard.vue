<template>
  <div class="max-w-3xl mx-auto px-4 py-6 sm:py-10">

    <!-- ─────────────────── 로그인 전 ─────────────────── -->
    <template v-if="!userId">
      <div class="text-center py-20">
        <div class="w-16 h-16 rounded-2xl bg-primary-500 mx-auto mb-4 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-slate-800 mb-2">내 PT · 예약</h1>
        <p class="text-slate-500 text-sm mb-8">로그인 후 PT 현황과 예약 정보를 확인할 수 있어요</p>
        <router-link
          to="/login?redirect=/dashboard"
          class="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition"
        >
          로그인 / 회원가입
        </router-link>
      </div>
    </template>

    <!-- ─────────────────── 대시보드 ─────────────────── -->
    <template v-else>

      <!-- 사용자 헤더 -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
            {{ (userName || '?').charAt(0) }}
          </div>
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-slate-800">{{ userName }}님</h1>
            <p class="text-sm text-slate-400">{{ formatKoreanPhoneDisplay(userPhone) }}</p>
          </div>
        </div>
        <button
          type="button"
          class="text-sm text-slate-400 hover:text-slate-600 transition"
          @click="logout"
        >
          로그아웃
        </button>
      </div>

      <!-- 로딩 -->
      <div v-if="dataLoading" class="py-20 text-center text-slate-400">불러오는 중…</div>

      <template v-else>

        <!-- ── 스탯 카드 ── -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p class="text-xs text-slate-500 font-medium">이번 달 완료</p>
            <p class="text-3xl font-bold text-slate-800 mt-1 leading-none">{{ stats.thisMonth }}</p>
            <p class="text-xs text-slate-400 mt-1">회</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p class="text-xs text-slate-500 font-medium">누적 운동</p>
            <p class="text-3xl font-bold text-slate-800 mt-1 leading-none">{{ stats.totalCompleted }}</p>
            <p class="text-xs text-slate-400 mt-1">회</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p class="text-xs text-slate-500 font-medium">연속 출석</p>
            <p class="text-3xl font-bold mt-1 leading-none"
               :class="stats.streak >= 4 ? 'text-emerald-600' : stats.streak >= 2 ? 'text-amber-500' : 'text-slate-800'">
              {{ stats.streak }}
            </p>
            <p class="text-xs text-slate-400 mt-1">주</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p class="text-xs text-slate-500 font-medium">완료율</p>
            <p class="text-3xl font-bold mt-1 leading-none"
               :class="stats.completionRate >= 80 ? 'text-emerald-600' : stats.completionRate >= 60 ? 'text-amber-500' : 'text-red-500'">
              {{ stats.completionRate }}
            </p>
            <p class="text-xs text-slate-400 mt-1">%</p>
          </div>
        </div>

        <!-- ── 활성 패스 ── -->
        <div v-if="activePasses.length > 0" class="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 mb-6">
          <h2 class="text-sm font-semibold text-emerald-800 mb-3">활성 패스</h2>
          <div v-for="pass in activePasses" :key="pass.passId" class="space-y-1.5 mb-3 last:mb-0">
            <div class="flex items-center justify-between text-sm">
              <span class="font-semibold text-emerald-800">{{ pass.remainingSessions }}회 남음</span>
              <span class="text-emerald-600 text-xs">{{ pass.totalSessions }}회 중 {{ pass.totalSessions - pass.remainingSessions }}회 사용 · 만료 {{ pass.expiryDate }}</span>
            </div>
            <div class="h-2.5 rounded-full bg-emerald-200 overflow-hidden">
              <div
                class="h-full rounded-full bg-emerald-500 transition-all"
                :style="{ width: `${Math.round(((pass.totalSessions - pass.remainingSessions) / pass.totalSessions) * 100)}%` }"
              />
            </div>
            <p v-if="pass.memo" class="text-xs text-emerald-600">{{ pass.memo }}</p>
          </div>
        </div>

        <!-- 패스 없음 안내 -->
        <div v-else-if="passes.length === 0" class="rounded-2xl border border-amber-200 bg-amber-50 p-4 mb-6 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
          </svg>
          <p class="text-sm text-amber-700">활성 패스가 없습니다. PT 패스를 구매하면 예약할 수 있어요.</p>
        </div>

        <!-- ── 다가오는 예약 ── -->
        <div v-if="upcomingReservations.length > 0" class="rounded-2xl border border-blue-200 bg-blue-50 p-5 mb-6">
          <h2 class="text-sm font-semibold text-blue-800">다가오는 예약 ({{ upcomingReservations.length }})</h2>
          <p class="text-xs text-blue-700/90 mt-1 mb-3">로그인한 회원은 확정 예약을 여기서 직접 취소할 수 있어요.</p>
          <div class="space-y-2">
            <div
              v-for="r in upcomingReservations"
              :key="r.id"
              class="flex flex-col gap-3 sm:flex-row sm:items-center bg-white rounded-xl px-4 py-3 border border-blue-100"
            >
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-blue-500 flex flex-col items-center justify-center text-white shrink-0">
                  <p class="text-[10px] leading-none font-medium">{{ r.date.slice(5, 7) }}월</p>
                  <p class="text-base font-bold leading-none">{{ r.date.slice(8, 10) }}</p>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-slate-800">{{ formatDateFull(r.date) }}</p>
                  <p class="text-xs text-slate-500">{{ r.time }} · {{ r.trainerName || r.trainer || 'PT 세션' }}</p>
                </div>
              </div>
              <div class="flex items-center justify-end gap-2 shrink-0 sm:ml-auto">
                <span class="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full">예약 확정</span>
                <button
                  type="button"
                  :disabled="cancelingId === r.id"
                  class="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 disabled:opacity-50 disabled:pointer-events-none transition"
                  @click="cancelUpcoming(r)"
                >
                  {{ cancelingId === r.id ? '처리 중…' : '예약 취소' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── 월별 캘린더 ── -->
        <div class="rounded-2xl border border-slate-200 bg-white p-5 mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold text-slate-800">{{ calendarYear }}년 {{ calendarMonth }}월 운동 달력</h2>
            <div class="flex items-center gap-1">
              <button
                type="button"
                class="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition"
                @click="prevMonth"
              >←</button>
              <button
                type="button"
                class="px-2 py-1 rounded-lg hover:bg-slate-100 text-xs text-slate-500 transition"
                @click="goToday"
              >오늘</button>
              <button
                type="button"
                class="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition"
                @click="nextMonth"
              >→</button>
            </div>
          </div>

          <!-- 요일 헤더 -->
          <div class="grid grid-cols-7 mb-1">
            <div
              v-for="(d, i) in ['일','월','화','수','목','금','토']"
              :key="d"
              class="text-center text-xs font-medium py-1.5"
              :class="i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-400'"
            >{{ d }}</div>
          </div>

          <!-- 날짜 그리드 -->
          <div class="grid grid-cols-7 gap-1">
            <div
              v-for="cell in calendarCells"
              :key="cell.key"
              class="aspect-square flex items-center justify-center rounded-xl text-xs sm:text-sm font-medium transition"
              :class="cellClass(cell)"
            >
              <span v-if="cell.day">{{ cell.day }}</span>
            </div>
          </div>

          <!-- 범례 -->
          <div class="flex items-center gap-4 mt-4 text-xs text-slate-500 flex-wrap">
            <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-lg bg-emerald-500"></div> 완료</div>
            <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-lg bg-blue-400"></div> 예약</div>
            <div class="flex items-center gap-1.5"><div class="w-3 h-3 rounded-lg bg-red-200"></div> 노쇼/취소</div>
            <div class="ml-auto text-slate-400">이번 달 {{ stats.thisMonth }}회 완료</div>
          </div>
        </div>

        <!-- ── 운동 이력 ── -->
        <div class="rounded-2xl border border-slate-200 bg-white p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-semibold text-slate-800">운동 이력</h2>
            <span class="text-xs text-slate-400">최근 {{ historyList.length }}건</span>
          </div>

          <div v-if="historyList.length === 0" class="py-8 text-center text-slate-400 text-sm">
            아직 완료된 운동 기록이 없습니다.
          </div>

          <!-- 월별 그룹 -->
          <div v-else class="space-y-6">
            <div v-for="group in historyByMonth" :key="group.label">
              <p class="text-xs font-semibold text-slate-400 uppercase mb-2">{{ group.label }}</p>
              <div class="space-y-1">
                <div
                  v-for="r in group.items"
                  :key="r.id"
                  class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition"
                >
                  <div class="w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0"
                    :class="r.normalStatus === 'COMPLETED' ? 'bg-emerald-100' : r.normalStatus === 'NO_SHOW' ? 'bg-red-100' : 'bg-slate-100'"
                  >
                    <p class="text-[10px] leading-none font-medium"
                      :class="r.normalStatus === 'COMPLETED' ? 'text-emerald-600' : r.normalStatus === 'NO_SHOW' ? 'text-red-400' : 'text-slate-400'">
                      {{ r.date.slice(5, 7) }}월
                    </p>
                    <p class="text-sm font-bold leading-none"
                      :class="r.normalStatus === 'COMPLETED' ? 'text-emerald-700' : r.normalStatus === 'NO_SHOW' ? 'text-red-500' : 'text-slate-500'">
                      {{ r.date.slice(8, 10) }}
                    </p>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-slate-800">
                      {{ formatDateFull(r.date) }}
                      <span class="font-normal text-slate-500">{{ r.time }}</span>
                    </p>
                    <p class="text-xs text-slate-400">{{ r.trainerName || r.trainer || 'PT 세션' }} · {{ r.ptType === '30min' ? '30분' : '60분' }}</p>
                  </div>
                  <span
                    class="px-2 py-0.5 rounded-full text-xs font-medium shrink-0"
                    :class="{
                      'bg-emerald-100 text-emerald-700': r.normalStatus === 'COMPLETED',
                      'bg-red-100 text-red-600': r.normalStatus === 'NO_SHOW',
                      'bg-slate-100 text-slate-500': r.normalStatus === 'CAD',
                    }"
                  >
                    {{ { COMPLETED: '완료', NO_SHOW: '노쇼', CAD: '취소' }[r.normalStatus] || r.normalStatus }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </template>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  getUserReservations,
  getReservations,
  getUserPasses,
  getTrainers,
  cancelMemberReservationV2,
  cancelReservation,
} from '../api';
import { formatKoreanPhoneDisplay } from '../utils/phoneFormat';
import { useMemberAuth } from '../composables/useMemberAuth';

const STORE_ID = 'store_default';

// ── 인증 상태 ──
const { userId: authUserId, name: authName, phone: authPhone, checkToken, clearSession } = useMemberAuth();
const userId    = ref('');
const userName  = ref('');
const userPhone = ref('');

// ── 데이터 ──
const dataLoading  = ref(false);
const cancelingId  = ref('');
const reservations = ref([]);  // 정규화된 전체 예약
const passes       = ref([]);
const trainerMap   = ref({});  // trainerId → name

// ── 캘린더 상태 ──
const today = new Date();
const calViewYear  = ref(today.getFullYear());
const calViewMonth = ref(today.getMonth() + 1);  // 1-based

const calendarYear  = computed(() => calViewYear.value);
const calendarMonth = computed(() => calViewMonth.value);

// ── 복원 ──
onMounted(async () => {
  const ok = await checkToken();
  if (ok) {
    userId.value    = authUserId.value;
    userName.value  = authName.value;
    userPhone.value = authPhone.value;
    loadData();
  }
});

function logout() {
  clearSession();
  userId.value    = '';
  userName.value  = '';
  userPhone.value = '';
  reservations.value = [];
  passes.value       = [];
}

// ── 데이터 로드 ──
async function loadData() {
  dataLoading.value = true;
  try {
    const phoneDigits = String(userPhone.value || '').replace(/\D/g, '');
    const [trainers, passData, resV2Data, resV1Data] = await Promise.allSettled([
      getTrainers(),
      getUserPasses(userId.value),
      getUserReservations(userId.value, { limit: 100 }),
      // 관리자 대시보드와 동일하게 v1도 함께 조회해 누락을 방지
      getReservations(null, phoneDigits),
    ]);

    // 트레이너 맵
    if (trainers.status === 'fulfilled') {
      const map = {};
      for (const t of trainers.value) map[t.id] = t.name;
      trainerMap.value = map;
    }

    // 패스
    passes.value = passData.status === 'fulfilled' ? (passData.value.passes || []) : [];

    // 예약 정규화 (v2 + v1 병합)
    const v2List = resV2Data.status === 'fulfilled'
      ? (resV2Data.value.reservations || []).map((r) => normalizeV2(r))
      : [];
    const v1List = resV1Data.status === 'fulfilled'
      ? (resV1Data.value || []).map((r) => normalizeV1(r))
      : [];

    const merged = [...v2List, ...v1List];
    const dedup = new Map();
    for (const r of merged) {
      const key = r.id || `${r.date}|${r.time}|${r.normalStatus}|${r.trainerName || r.trainer || ''}`;
      // 동일 key 충돌 시 v2 우선
      if (!dedup.has(key) || r.source === 'v2') dedup.set(key, r);
    }
    reservations.value = Array.from(dedup.values());
  } finally {
    dataLoading.value = false;
  }
}

async function cancelUpcoming(r) {
  const label = `${r.trainerName || r.trainer || 'PT'} · ${r.date} ${r.time}`;
  if (!confirm(`이 예약을 취소할까요?\n${label}`)) return;
  cancelingId.value = r.id;
  try {
    if (r.source === 'v2') {
      await cancelMemberReservationV2(STORE_ID, r.id, {
        date: r.date,
        time: r.time,
        trainerId: r.trainerId || 'any',
      });
    } else {
      await cancelReservation(r.id);
    }
    await loadData();
  } catch (e) {
    alert(e.message || '취소에 실패했습니다.');
  } finally {
    cancelingId.value = '';
  }
}

function normalizeV2(r) {
  const statusMap = { BOOKED: 'BOOKED', COMPLETED: 'COMPLETED', CAD: 'CAD', NO_SHOW: 'NO_SHOW' };
  return {
    id: r.reservationId,
    date: r.date || r.datetime?.slice(0, 10) || '',
    time: r.time || r.datetime?.slice(11, 16) || '',
    status: r.status,
    normalStatus: statusMap[r.status] || r.status,
    trainerId: r.trainerId,
    trainerName: r.trainerId ? (trainerMap.value[r.trainerId] || r.trainerId) : '',
    trainer: '',
    ptType: r.ptType || '60min',
    source: 'v2',
  };
}

function normalizeV1(r) {
  const statusMap = { Confirmed: 'BOOKED', Completed: 'COMPLETED', Cancelled: 'CAD', 'No-show': 'NO_SHOW' };
  return {
    id: r.id,
    date: r.date || '',
    time: r.time || '',
    status: r.status,
    normalStatus: statusMap[r.status] || r.status,
    trainerId: '',
    trainerName: r.trainer || '',
    trainer: r.trainer || '',
    ptType: r.pt_type || '60min',
    source: 'v1',
  };
}

// ── 파생 데이터 ──
const activePasses = computed(() =>
  passes.value.filter((p) => p.status === 'ACTIVE')
);

const todayStr = today.toISOString().slice(0, 10);

const upcomingReservations = computed(() =>
  reservations.value
    .filter((r) => r.normalStatus === 'BOOKED' && r.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
    .slice(0, 5)
);

const historyList = computed(() =>
  reservations.value
    .filter((r) => ['COMPLETED', 'NO_SHOW', 'CAD'].includes(r.normalStatus))
    .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time))
);

// 월별 그룹
const historyByMonth = computed(() => {
  const groups = [];
  let current = null;
  for (const r of historyList.value) {
    const label = r.date.slice(0, 7).replace('-', '년 ') + '월';
    if (!current || current.label !== label) {
      current = { label, items: [] };
      groups.push(current);
    }
    current.items.push(r);
  }
  return groups;
});

// ── 통계 ──
const stats = computed(() => {
  const all = reservations.value;
  const completed = all.filter((r) => r.normalStatus === 'COMPLETED');

  // 이번 달
  const thisMonthPfx = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const thisMonth = completed.filter((r) => r.date.startsWith(thisMonthPfx)).length;

  // 완료율 (완료 / (완료+노쇼+취소))
  const concluded = all.filter((r) => ['COMPLETED', 'NO_SHOW', 'CAD'].includes(r.normalStatus)).length;
  const completionRate = concluded > 0 ? Math.round((completed.length / concluded) * 100) : 0;

  // 연속 출석 주 (일~토 기준)
  const completedDates = new Set(completed.map((r) => r.date));
  let streak = 0;
  const ref = new Date(today);
  for (let w = 0; w < 52; w++) {
    const sunOffset = ref.getDay();
    const sun = new Date(ref); sun.setDate(ref.getDate() - sunOffset - w * 7);
    const sat = new Date(sun); sat.setDate(sun.getDate() + 6);
    let hit = false;
    for (let d = new Date(sun); d <= sat; d.setDate(d.getDate() + 1)) {
      if (completedDates.has(d.toISOString().slice(0, 10))) { hit = true; break; }
    }
    if (hit) streak++;
    else break;
  }

  return { thisMonth, totalCompleted: completed.length, completionRate, streak };
});

// ── 캘린더 ──
const calendarCells = computed(() => {
  const y = calViewYear.value;
  const m = calViewMonth.value;
  const firstDay = new Date(y, m - 1, 1).getDay(); // 0=일
  const lastDate = new Date(y, m, 0).getDate();

  // 이달 예약 날짜 맵
  const prefix = `${y}-${String(m).padStart(2, '0')}`;
  const dayStatusMap = {};
  for (const r of reservations.value) {
    if (!r.date.startsWith(prefix)) continue;
    const d = parseInt(r.date.slice(8, 10));
    const prev = dayStatusMap[d];
    // 완료 > 예약 > 노쇼 > 취소 우선순위
    const priority = { COMPLETED: 4, BOOKED: 3, NO_SHOW: 2, CAD: 1 };
    if (!prev || (priority[r.normalStatus] || 0) > (priority[prev] || 0)) {
      dayStatusMap[d] = r.normalStatus;
    }
  }

  const cells = [];
  // 빈 칸 (앞)
  for (let i = 0; i < firstDay; i++) {
    cells.push({ key: `empty-${i}`, day: null, status: null, isToday: false });
  }
  // 날짜
  const todayY = today.getFullYear();
  const todayM = today.getMonth() + 1;
  const todayD = today.getDate();
  for (let d = 1; d <= lastDate; d++) {
    const isToday = y === todayY && m === todayM && d === todayD;
    cells.push({
      key: `day-${d}`,
      day: d,
      status: dayStatusMap[d] || null,
      isToday,
    });
  }
  return cells;
});

function cellClass(cell) {
  if (!cell.day) return 'invisible';
  const base = cell.isToday ? 'ring-2 ring-primary-400 ' : '';
  if (cell.status === 'COMPLETED') return base + 'bg-emerald-500 text-white font-bold';
  if (cell.status === 'BOOKED')    return base + 'bg-blue-400 text-white font-semibold';
  if (cell.status === 'NO_SHOW')   return base + 'bg-red-200 text-red-500';
  if (cell.status === 'CAD')       return base + 'bg-slate-100 text-slate-400 line-through';
  return base + (cell.isToday ? 'text-primary-600 font-bold' : 'text-slate-600');
}

function prevMonth() {
  if (calViewMonth.value === 1) { calViewYear.value--; calViewMonth.value = 12; }
  else calViewMonth.value--;
}
function nextMonth() {
  if (calViewMonth.value === 12) { calViewYear.value++; calViewMonth.value = 1; }
  else calViewMonth.value++;
}
function goToday() {
  calViewYear.value  = today.getFullYear();
  calViewMonth.value = today.getMonth() + 1;
}

// ── 날짜 포맷 ──
function formatDateFull(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  const dow = ['일','월','화','수','목','금','토'][new Date(iso).getDay()];
  return `${y}년 ${parseInt(m)}월 ${parseInt(d)}일 (${dow})`;
}
</script>
