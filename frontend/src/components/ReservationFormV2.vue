<template>
  <div class="space-y-6">

    <!-- 선택된 트레이너 & 프로그램 안내 -->
    <section
      v-if="queryTrainer || queryProgram"
      class="rounded-2xl border border-primary-700/40 bg-primary-950/20 p-4 sm:p-6 flex items-center gap-4"
    >
      <div class="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-400 text-lg shrink-0">🏋️</div>
      <div class="min-w-0">
        <p v-if="queryProgram" class="text-primary-400 text-xs font-semibold uppercase tracking-wide">{{ queryProgram }}</p>
        <p v-if="queryTrainer" class="text-white font-bold text-base">{{ queryTrainer }} 트레이너</p>
      </div>
    </section>

    <!-- Step 1: 전화번호 입력 -->
    <section class="rounded-2xl border border-white/10 bg-[#141414] p-4 sm:p-6">
      <label class="block text-sm font-medium text-slate-300 mb-3">
        연락처
        <span class="text-slate-400 font-normal ml-1">예약 조회에 사용됩니다</span>
      </label>
      <div class="flex gap-2">
        <input
          :value="phone"
          type="tel"
          inputmode="numeric"
          autocomplete="tel"
          placeholder="010-0000-0000"
          :disabled="!!user"
          class="flex-1 px-4 py-3 rounded-xl border border-white/10 bg-[#1e1e1e] focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-white placeholder-slate-500 disabled:opacity-50"
          @input="onPhoneInput"
          @keyup.enter="lookupUser"
        />
        <button
          v-if="!user"
          type="button"
          :disabled="!phone || lookingUp"
          class="px-5 py-3 rounded-xl font-semibold bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 transition shrink-0"
          @click="lookupUser"
        >
          {{ lookingUp ? '조회 중…' : '확인' }}
        </button>
        <button
          v-else
          type="button"
          class="px-4 py-3 rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 transition shrink-0 text-sm"
          @click="resetUser"
        >
          변경
        </button>
      </div>
      <p v-if="phoneError" class="mt-2 text-red-500 text-sm">{{ phoneError }}</p>
    </section>

    <!-- Step 1-b: 신규 사용자 이름 입력 -->
    <section
      v-if="needsName && !user"
      class="rounded-2xl border border-amber-700/40 bg-amber-950/30 p-4 sm:p-6"
    >
      <p class="text-sm text-amber-400 mb-3">처음 오셨군요! 이름을 입력해주세요.</p>
      <div class="flex gap-2">
        <input
          v-model="newName"
          type="text"
          placeholder="이름"
          class="flex-1 px-4 py-3 rounded-xl border border-amber-700/40 bg-[#1e1e1e] focus:ring-2 focus:ring-amber-400 outline-none transition text-white placeholder-slate-500"
          @keyup.enter="lookupUser"
        />
        <button
          type="button"
          :disabled="!newName.trim() || lookingUp"
          class="px-5 py-3 rounded-xl font-semibold bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 transition shrink-0"
          @click="lookupUser"
        >
          등록
        </button>
      </div>
    </section>

    <!-- 사용자 확인 배지 -->
    <div
      v-if="user"
      class="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-950/40 border border-emerald-700/40"
    >
      <div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
        {{ user.name.charAt(0) }}
      </div>
      <div class="min-w-0">
        <p class="font-semibold text-emerald-400 text-sm">{{ user.name }}</p>
        <p class="text-emerald-500 text-xs">{{ user.phone }}</p>
      </div>
      <span
        v-if="user.isNew"
        class="ml-auto text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full shrink-0"
      >신규</span>
    </div>

    <!-- Step 1-c: 패스 선택 (활성 패스 있을 때만) -->
    <section
      v-if="user && activePasses.length > 0"
      class="rounded-2xl border border-white/10 bg-[#141414] p-4 sm:p-6"
    >
      <div class="flex items-center justify-between mb-3">
        <label class="text-sm font-medium text-slate-300">PT 패스 사용</label>
        <span class="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">선택사항</span>
      </div>
      <div class="space-y-2">
        <!-- 패스 미사용 옵션 -->
        <button
          type="button"
          :class="[
            'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition text-left',
            !form.passId
              ? 'border-primary-500 bg-primary-950/30'
              : 'border-white/10 hover:border-white/20',
          ]"
          @click="form.passId = null"
        >
          <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <span class="text-slate-400 text-xs font-bold">-</span>
          </div>
          <div>
            <p class="font-medium text-slate-300 text-sm">패스 미사용</p>
            <p class="text-slate-500 text-xs">이번 예약에 패스를 사용하지 않습니다</p>
          </div>
        </button>
        <!-- 활성 패스 목록 -->
        <button
          v-for="pass in activePasses"
          :key="pass.passId"
          type="button"
          :class="[
            'w-full flex items-center gap-3 p-3 rounded-xl border-2 transition text-left',
            form.passId === pass.passId
              ? 'border-emerald-500 bg-emerald-950/30'
              : 'border-white/10 hover:border-white/20',
          ]"
          @click="form.passId = pass.passId"
        >
          <div class="w-8 h-8 rounded-full bg-emerald-900/50 flex items-center justify-center shrink-0">
            <span class="text-emerald-400 text-xs font-bold">{{ pass.remainingSessions }}</span>
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-medium text-slate-300 text-sm">잔여 {{ pass.remainingSessions }}회 / {{ pass.totalSessions }}회</p>
            <p class="text-slate-500 text-xs">만료일 {{ pass.expiryDate }}{{ pass.memo ? ` · ${pass.memo}` : '' }}</p>
          </div>
          <span v-if="form.passId === pass.passId" class="text-emerald-400 text-xs font-semibold shrink-0">선택됨</span>
        </button>
      </div>
    </section>

    <template v-if="user">
      <!-- Step 2: 날짜 -->
      <section class="rounded-2xl border border-white/10 bg-[#141414] p-4 sm:p-6">
        <CalendarPicker v-model="form.date" />
      </section>

      <!-- Step 3: 시간 -->
      <section class="rounded-2xl border border-white/10 bg-[#141414] p-4 sm:p-6">
        <label class="block text-sm font-medium text-slate-300 mb-3">시간 선택</label>
        <p v-if="!form.date" class="text-slate-500 text-sm">먼저 날짜를 선택해 주세요.</p>
        <p v-else-if="slotsLoading" class="text-slate-400 text-sm">시간 조회 중…</p>
        <p v-else-if="availableSlots.length === 0" class="text-slate-400 text-sm">해당 날짜에 예약 가능한 시간이 없습니다.</p>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          <button
            v-for="slot in availableSlots"
            :key="slot"
            type="button"
            :class="[
              'py-3 sm:py-3.5 rounded-xl font-medium transition text-sm sm:text-base',
              form.time === slot
                ? 'bg-primary-500 text-white ring-2 ring-primary-500 ring-offset-2 shadow-md'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10',
            ]"
            @click="form.time = slot"
          >
            {{ slot }}
          </button>
        </div>
      </section>

      <!-- 예약 요약 -->
      <section
        v-if="form.date && form.time"
        class="rounded-2xl border border-primary-700/40 bg-primary-950/20 p-4 sm:p-6"
      >
        <h3 class="text-sm font-semibold text-white mb-3">예약 요약</h3>
        <dl class="space-y-2 text-sm sm:text-base">
          <div class="flex justify-between gap-2">
            <dt class="text-slate-400">예약자</dt>
            <dd class="font-medium text-white">{{ user.name }}</dd>
          </div>
          <div class="flex justify-between gap-2">
            <dt class="text-slate-400">날짜</dt>
            <dd class="font-medium text-white">{{ formatDate(form.date) }}</dd>
          </div>
          <div class="flex justify-between gap-2">
            <dt class="text-slate-400">시간</dt>
            <dd class="font-medium text-white">{{ form.time }}</dd>
          </div>
          <div v-if="queryTrainer" class="flex justify-between gap-2">
            <dt class="text-slate-400">트레이너</dt>
            <dd class="font-medium text-white">{{ queryTrainer }}</dd>
          </div>
          <div v-if="queryProgram" class="flex justify-between gap-2">
            <dt class="text-slate-400">프로그램</dt>
            <dd class="font-medium text-white">{{ queryProgram }}</dd>
          </div>
          <div v-if="form.passId" class="flex justify-between gap-2">
            <dt class="text-slate-400">패스 차감</dt>
            <dd class="font-medium text-emerald-400">
              {{ activePasses.find(p => p.passId === form.passId)?.remainingSessions }}회 →
              {{ (activePasses.find(p => p.passId === form.passId)?.remainingSessions || 1) - 1 }}회
            </dd>
          </div>
        </dl>
      </section>

      <p v-if="submitError" class="text-red-600 text-sm">{{ submitError }}</p>

      <button
        type="button"
        :disabled="submitting || !form.date || !form.time"
        class="w-full py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-primary-500/25"
        @click="onSubmit"
      >
        {{ submitting ? '예약 처리 중…' : '예약하기' }}
      </button>
    </template>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import CalendarPicker from './CalendarPicker.vue';
import { lookupUser as lookupUserApi, getAvailableSlotsV2, createReservationV2, getTrainers, getUserPasses } from '../api';
import { formatKoreanPhoneAsYouType } from '../utils/phoneFormat.js';

const STORE_ID = 'store_default';

const router = useRouter();
const route = useRoute();

const queryTrainer = computed(() => route.query.trainer || '');
const queryProgram = computed(() => route.query.program || '');

function onPhoneInput(e) {
  phone.value = formatKoreanPhoneAsYouType(e.target.value);
}

// --- 사용자 상태 ---
const phone     = ref('');
const newName   = ref('');
const user      = ref(null);
const lookingUp = ref(false);
const needsName = ref(false);
const phoneError = ref('');

// --- 패스 ---
const passes = ref([]);
const activePasses = computed(() => passes.value.filter((p) => p.status === 'ACTIVE'));

// --- 예약 폼 ---
const form = ref({ date: new Date().toISOString().slice(0, 10), time: '', trainerId: null, ptType: '60min', passId: null });
const availableSlots = ref([]);
const slotsLoading   = ref(false);
const trainers       = ref([]);
const submitting     = ref(false);
const submitError    = ref('');

const selectedTrainer = computed(() => trainers.value.find((t) => t.id === form.value.trainerId) || null);

const AVATAR_COLORS = ['bg-amber-500','bg-rose-500','bg-emerald-500','bg-violet-500','bg-blue-500','bg-teal-500','bg-orange-500','bg-pink-500'];
function avatarColor(id) {
  const idx = (id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${y}년 ${m}월 ${d}일`;
}

async function lookupUser() {
  phoneError.value = '';
  const rawPhone = phone.value.replace(/[\s\-\.]/g, '');
  if (rawPhone.length < 9) { phoneError.value = '올바른 전화번호를 입력해주세요.'; return; }

  lookingUp.value = true;
  try {
    const result = await lookupUserApi(STORE_ID, rawPhone, needsName.value ? newName.value : undefined);
    user.value = result;
    needsName.value = false;
    // 트레이너 목록 + 패스 병렬 로드
    const [trainerList, passData] = await Promise.allSettled([
      getTrainers(),
      getUserPasses(result.userId),
    ]);
    const list = trainerList.status === 'fulfilled' ? trainerList.value : [];
    trainers.value = list;
    // 쿼리 파라미터로 전달된 트레이너 자동 선택
    const qTrainer = route.query.trainer;
    if (qTrainer && list.length > 1) {
      const match = list.find(t => t.name === qTrainer);
      if (match) form.value.trainerId = match.id;
    }
    // 1인 트레이너 샵: 자동 선택
    if (list.length === 1) {
      form.value.trainerId = list[0].id;
    }
  } catch (e) {
    if (e.needsName) {
      needsName.value = true;
    } else {
      phoneError.value = e.message || '조회에 실패했습니다.';
    }
  } finally {
    lookingUp.value = false;
  }
}

function resetUser() {
  user.value = null;
  needsName.value = false;
  newName.value = '';
  phoneError.value = '';
  passes.value = [];
  form.value = { date: new Date().toISOString().slice(0, 10), time: '', trainerId: null, ptType: '60min', passId: null };
  availableSlots.value = [];
}

function selectTrainer(t) {
  form.value.trainerId = t.id;
}

async function loadSlots() {
  if (!form.value.date) { availableSlots.value = []; return; }
  slotsLoading.value = true;
  try {
    const res = await getAvailableSlotsV2(STORE_ID, form.value.date, form.value.trainerId);
    availableSlots.value = res.availableSlots || [];
    if (!availableSlots.value.includes(form.value.time)) form.value.time = '';
  } catch {
    availableSlots.value = [];
  } finally {
    slotsLoading.value = false;
  }
}

watch(() => form.value.date, loadSlots);
watch(() => form.value.trainerId, loadSlots);

async function onSubmit() {
  submitError.value = '';
  submitting.value = true;
  try {
    const res = await createReservationV2(STORE_ID, {
      userId: user.value.userId,
      date: form.value.date,
      time: form.value.time,
      trainerId: form.value.trainerId || undefined,
      ptType: form.value.ptType,
      ...(form.value.passId && { passId: form.value.passId }),
    });
    router.push({
      name: 'Complete',
      state: {
        reservation: {
          ...res,
          name: user.value.name,
          phone: phone.value,
          date: form.value.date,
          time: form.value.time,
          trainer: queryTrainer.value || undefined,
          program: queryProgram.value || undefined,
        },
      },
    });
  } catch (e) {
    submitError.value = e.message || '예약에 실패했습니다.';
  } finally {
    submitting.value = false;
  }
}
</script>
