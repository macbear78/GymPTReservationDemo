<template>
  <div class="space-y-8">
    <!-- 선택된 트레이너 카드 -->
    <div v-if="selectedTrainer" class="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
      <div class="flex items-center gap-4">
        <div
          v-if="selectedTrainer.image"
          class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-cover bg-center shrink-0"
          :style="{ backgroundImage: `url(${selectedTrainer.image})` }"
        />
        <div
          v-else
          class="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white shrink-0"
          :class="avatarClass(selectedTrainer)"
        >
          {{ selectedTrainer.name.charAt(0) }}
        </div>
        <div class="min-w-0 flex-1">
          <h2 class="font-bold text-slate-800 text-lg sm:text-xl">{{ selectedTrainer.name }}</h2>
          <p class="text-primary-600 font-medium text-sm sm:text-base">{{ selectedTrainer.specialty }}</p>
          <p class="text-slate-600 font-semibold mt-1">
            시간당 {{ formatPrice(selectedTrainer.pricePerHour ?? 0) }}
          </p>
        </div>
      </div>
    </div>

    <form class="space-y-6 sm:space-y-8" @submit.prevent="onSubmit">
      <!-- 날짜 -->
      <section class="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <CalendarPicker v-model="form.date" />
      </section>

      <!-- 시간 (가능한 시간만) -->
      <section class="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <label class="block text-sm font-medium text-slate-700 mb-3">시간 선택</label>
        <p v-if="!form.date" class="text-slate-500 text-sm mb-3">먼저 날짜를 선택해 주세요.</p>
        <p v-else-if="availableSlots.length === 0" class="text-slate-500 text-sm mb-3">해당 날짜에 가능한 시간이 없습니다.</p>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          <button
            v-for="slot in availableSlots"
            :key="slot"
            type="button"
            :class="[
              'py-3 sm:py-3.5 rounded-xl font-medium transition text-sm sm:text-base',
              form.time === slot
                ? 'bg-primary-500 text-white ring-2 ring-primary-500 ring-offset-2 shadow-md'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200',
            ]"
            @click="form.time = slot"
          >
            {{ slot }}
          </button>
        </div>
      </section>

      <!-- PT 유형 -->
      <section class="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <label class="block text-sm font-medium text-slate-700 mb-2">PT 유형</label>
        <select
          v-model="form.pt_type"
          class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-slate-800"
        >
          <option value="30min">30분</option>
          <option value="60min">60분</option>
        </select>
      </section>

      <!-- 예약자 정보 -->
      <section class="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-4">
        <label class="block text-sm font-medium text-slate-700">예약자 정보</label>
        <div>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="이름"
            class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-slate-800 placeholder-slate-400"
          />
        </div>
        <div>
          <input
            v-model="form.phone"
            type="tel"
            required
            placeholder="연락처"
            class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition text-slate-800 placeholder-slate-400"
          />
        </div>
      </section>

      <!-- 예약 요약 -->
      <section
        v-if="form.date && form.time"
        class="rounded-2xl border border-primary-200 bg-primary-50/50 p-4 sm:p-6"
      >
        <h3 class="text-sm font-semibold text-slate-700 mb-3">예약 요약</h3>
        <dl class="space-y-2 text-sm sm:text-base">
          <div class="flex justify-between gap-2">
            <dt class="text-slate-600">트레이너</dt>
            <dd class="font-medium text-slate-800">{{ form.trainer }}</dd>
          </div>
          <div class="flex justify-between gap-2">
            <dt class="text-slate-600">날짜</dt>
            <dd class="font-medium text-slate-800">{{ formatDate(form.date) }}</dd>
          </div>
          <div class="flex justify-between gap-2">
            <dt class="text-slate-600">시간</dt>
            <dd class="font-medium text-slate-800">{{ form.time }}</dd>
          </div>
          <div class="flex justify-between gap-2">
            <dt class="text-slate-600">PT</dt>
            <dd class="font-medium text-slate-800">{{ form.pt_type }}</dd>
          </div>
        </dl>
      </section>

      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

      <button
        type="submit"
        :disabled="loading || !form.trainer || !form.date || !form.time || !form.name || !form.phone"
        class="w-full py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-primary-500/25 hover:shadow-xl"
      >
        {{ loading ? '예약 처리 중…' : '예약하기' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import CalendarPicker from './CalendarPicker.vue';
import { getTrainers, getAvailableSlots, createReservation } from '../api';

const router = useRouter();
const route = useRoute();
const selectedTrainer = ref(null);
const availableSlots = ref([]);
const loading = ref(false);
const error = ref('');

const form = ref({
  trainer: '',
  date: '',
  time: '',
  pt_type: '60min',
  name: '',
  phone: '',
});

const AVATAR_COLORS = {
  mike: 'bg-amber-500',
  anna: 'bg-rose-500',
  chris: 'bg-emerald-500',
  sarah: 'bg-violet-500',
  james: 'bg-blue-500',
  emma: 'bg-teal-500',
  david: 'bg-orange-500',
  lisa: 'bg-pink-500',
  ryan: 'bg-indigo-500',
  minji: 'bg-cyan-500',
  tom: 'bg-lime-600',
};

function avatarClass(trainer) {
  return AVATAR_COLORS[(trainer.id || '').toLowerCase()] || 'bg-slate-500';
}

function formatPrice(n) {
  return new Intl.NumberFormat('ko-KR').format(n) + '원';
}

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${y}년 ${m}월 ${d}일`;
}

async function loadTrainerAndSlots() {
  const name = route.query.trainer;
  if (!name) {
    router.replace('/trainers');
    return;
  }
  const list = await getTrainers();
  const found = list.find((t) => t.name === name);
  if (!found) {
    router.replace('/trainers');
    return;
  }
  selectedTrainer.value = found;
  form.value.trainer = found.name;

  if (form.value.date) {
    try {
      availableSlots.value = await getAvailableSlots(form.value.trainer, form.value.date);
      if (!availableSlots.value.includes(form.value.time)) {
        form.value.time = '';
      }
    } catch {
      availableSlots.value = [];
      form.value.time = '';
    }
  } else {
    availableSlots.value = [];
    const today = new Date().toISOString().slice(0, 10);
    form.value.date = today;
  }
}

watch(
  () => form.value.date,
  async (date) => {
    if (!date || !form.value.trainer) {
      availableSlots.value = [];
      form.value.time = '';
      return;
    }
    try {
      availableSlots.value = await getAvailableSlots(form.value.trainer, date);
      if (!availableSlots.value.includes(form.value.time)) {
        form.value.time = '';
      }
    } catch {
      availableSlots.value = [];
      form.value.time = '';
    }
  }
);

onMounted(async () => {
  await loadTrainerAndSlots();
});

async function onSubmit() {
  error.value = '';
  loading.value = true;
  try {
    const res = await createReservation({
      name: form.value.name,
      phone: form.value.phone,
      trainer: form.value.trainer,
      date: form.value.date,
      time: form.value.time,
      pt_type: form.value.pt_type,
    });
    router.push({ name: 'Complete', state: { reservation: res } });
  } catch (e) {
    error.value = e.message || '예약에 실패했습니다.';
  } finally {
    loading.value = false;
  }
}
</script>
