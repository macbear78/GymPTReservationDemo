<template>
  <div class="max-w-3xl mx-auto px-4 py-6 sm:py-10">
    <router-link
      to="/trainers"
      class="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 sm:mb-8 transition font-medium text-sm sm:text-base"
    >
      <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      트레이너 목록으로
    </router-link>

    <div v-if="loading" class="space-y-6">
      <div class="h-28 w-28 rounded-full bg-slate-200 animate-pulse mx-auto" />
      <div class="h-6 bg-slate-200 rounded w-40 mx-auto animate-pulse" />
      <div class="h-4 bg-slate-100 rounded w-56 mx-auto animate-pulse" />
    </div>

    <div v-else-if="error" class="rounded-2xl bg-red-50 border border-red-200 px-6 py-4 text-red-700">
      {{ error }}
    </div>

    <template v-else-if="trainer">
      <!-- 프로필 카드 -->
      <section class="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-6 sm:mb-8">
        <div class="p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div
            v-if="trainer.profileImage || trainer.image"
            class="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-cover bg-center ring-4 ring-slate-100 shadow-md shrink-0"
            :style="{ backgroundImage: `url(${trainer.profileImage || trainer.image})` }"
          />
          <div
            v-else
            class="w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-white shadow-md shrink-0"
            :class="avatarClass"
          >
            {{ trainer.name.charAt(0) }}
          </div>
          <div class="flex-1 text-center sm:text-left min-w-0">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-800">{{ trainer.name }}</h1>
            <p class="text-primary-600 font-semibold mt-1">{{ trainer.specialty }}</p>
            <p class="text-slate-500 text-sm mt-1">{{ trainer.experience }}</p>
            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3">
              <StarRating :value="trainer.rating ?? 0" />
              <span v-if="trainer.reviewCount != null" class="text-slate-500 text-sm">
                리뷰 {{ formatReviewCount(trainer.reviewCount) }}개
              </span>
            </div>
            <p class="mt-4 text-lg font-bold text-slate-800">
              시간당 {{ formatPrice(trainer.pricePerHour ?? 0) }}
            </p>
          </div>
        </div>
      </section>

      <!-- 트레이너 소개 -->
      <section class="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 mb-6 sm:mb-8">
        <h2 class="text-lg font-bold text-slate-800 mb-4">트레이너 소개</h2>
        <p class="text-slate-600 leading-relaxed whitespace-pre-line">
          {{ trainer.introLong || trainer.intro || '—' }}
        </p>
      </section>

      <!-- 전문 트레이닝 -->
      <section v-if="trainer.trainingAreas?.length" class="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 mb-6 sm:mb-8">
        <h2 class="text-lg font-bold text-slate-800 mb-4">전문 트레이닝</h2>
        <ul class="space-y-3">
          <li
            v-for="(area, i) in trainer.trainingAreas"
            :key="i"
            class="flex items-center gap-3 text-slate-700"
          >
            <span class="flex-shrink-0 w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span>{{ area }}</span>
          </li>
        </ul>
      </section>

      <!-- 자격 및 경력 -->
      <section v-if="trainer.certifications?.length" class="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8 mb-6 sm:mb-8">
        <h2 class="text-lg font-bold text-slate-800 mb-4">자격 및 경력</h2>
        <ul class="space-y-3">
          <li
            v-for="(cert, i) in trainer.certifications"
            :key="i"
            class="flex items-start gap-3 text-slate-700"
          >
            <span class="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center mt-0.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 00-4.438 0 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </span>
            <span>{{ cert }}</span>
          </li>
        </ul>
      </section>

      <!-- PT 프로그램 -->
      <section v-if="trainer.programs?.length" class="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-8">
        <h2 class="text-lg font-bold text-slate-800 mb-4">PT 프로그램</h2>
        <ul class="space-y-3">
          <li
            v-for="(program, i) in trainer.programs"
            :key="i"
            class="flex items-center gap-3 text-slate-700"
          >
            <span class="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </span>
            <span>{{ program }}</span>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getTrainers } from '../api';
import StarRating from '../components/StarRating.vue';

const route = useRoute();
const trainer = ref(null);
const loading = ref(true);
const error = ref('');

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

const avatarClass = computed(() => {
  if (!trainer.value) return 'bg-slate-500';
  return AVATAR_COLORS[(trainer.value.id || '').toLowerCase()] || 'bg-slate-500';
});

function formatPrice(n) {
  return new Intl.NumberFormat('ko-KR').format(n) + '원';
}

function formatReviewCount(n) {
  return new Intl.NumberFormat('ko-KR').format(n);
}

onMounted(async () => {
  try {
    const list = await getTrainers();
    const found = list.find((t) => t.id === route.params.id);
    if (found) {
      trainer.value = found;
    } else {
      error.value = '트레이너를 찾을 수 없습니다.';
    }
  } catch (e) {
    error.value = e.message || '트레이너 정보를 불러오지 못했습니다.';
  } finally {
    loading.value = false;
  }
});
</script>
