<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <!-- Header -->
    <header class="mb-8">
      <h1 class="text-3xl sm:text-4xl font-bold text-white tracking-tight uppercase">
        {{ isSingleTrainer ? '트레이너 소개' : '트레이너 목록' }}
      </h1>
      <p class="mt-2 text-slate-400">
        {{ isSingleTrainer ? 'PT 트레이너를 소개합니다.' : '전문 PT 트레이너를 만나보세요. 원하시는 트레이너를 선택해 예약할 수 있습니다.' }}
      </p>
    </header>

    <!-- Filters & Search (2명 이상일 때만) -->
    <div v-if="!isSingleTrainer" class="mb-8 space-y-4">
      <div class="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div class="relative flex-1 max-w-md">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="트레이너 이름 검색"
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#1e1e1e] text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
          />
        </div>
      </div>
      <div class="flex flex-wrap gap-3">
        <div class="flex items-center gap-2 text-sm text-slate-400 font-medium">전문분야</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="opt in specialtyOptions"
            :key="opt.value"
            type="button"
            :class="[
              'px-4 py-2 rounded-xl text-sm font-medium transition',
              filters.specialty === opt.value
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white/5 text-slate-300 hover:bg-white/10',
            ]"
            @click="filters.specialty = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
        <div class="flex items-center gap-2 text-sm text-slate-400 font-medium ml-4 sm:ml-6">가격</div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="opt in priceOptions"
            :key="opt.value"
            type="button"
            :class="[
              'px-4 py-2 rounded-xl text-sm font-medium transition',
              filters.price === opt.value
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white/5 text-slate-300 hover:bg-white/10',
            ]"
            @click="filters.price = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-if="loading" class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <TrainerCardSkeleton v-for="i in 6" :key="i" />
    </div>
    <div v-else-if="error" class="rounded-2xl bg-red-950/50 border border-red-800/50 px-6 py-4 text-red-400">
      {{ error }}
    </div>
    <div v-else-if="filteredTrainers.length === 0" class="rounded-2xl bg-white/5 border border-white/10 px-6 py-12 text-center text-slate-400">
      조건에 맞는 트레이너가 없습니다.
    </div>
    <div v-else class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="trainer in filteredTrainers"
        :key="trainer.id"
        class="trainer-card group rounded-2xl border border-white/10 bg-[#141414] p-6 sm:p-8 transition-all duration-300 hover:border-primary-500/50 hover:scale-[1.02] cursor-pointer"
        @click="goToDetail(trainer.id)"
      >
        <div class="flex flex-col h-full">
          <!-- Profile -->
          <div class="flex justify-center mb-4">
            <div
              v-if="trainer.profileImage || trainer.image"
              class="w-20 h-20 rounded-full bg-cover bg-center ring-4 ring-white/10 shadow-lg"
              :style="{ backgroundImage: `url(${trainer.profileImage || trainer.image})` }"
            />
            <div
              v-else
              class="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shrink-0"
              :class="avatarClass(trainer)"
            >
              {{ trainer.name.charAt(0) }}
            </div>
          </div>
          <h2 class="text-xl font-bold text-white text-center">{{ trainer.name }}</h2>
          <p class="text-sm text-primary-400 font-medium text-center mt-0.5">{{ trainer.specialty }}</p>
          <p class="text-xs text-slate-400 text-center mt-1">{{ trainer.experience }}</p>
          <div class="flex justify-center my-3">
            <StarRating :value="trainer.rating ?? 0" class="justify-center" />
          </div>
          <p class="text-sm text-slate-400 line-clamp-2 flex-1 min-h-[2.5rem]">{{ trainer.intro || '—' }}</p>
          <div class="mt-4 pt-4 border-t border-white/5" @click.stop>
            <router-link
              :to="{ name: 'TrainerDetail', params: { id: trainer.id } }"
              class="block w-full py-3 rounded-xl font-medium text-center bg-white/5 text-slate-300 hover:bg-primary-500 hover:text-white transition border border-white/10"
            >
              프로필 보기
            </router-link>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getTrainers } from '../api';
import StarRating from '../components/StarRating.vue';
import TrainerCardSkeleton from '../components/TrainerCardSkeleton.vue';
import { useSingleTrainerShop } from '../composables/useSingleTrainerShop';

const router = useRouter();
const route = useRoute();
const trainers = ref([]);
const { isSingleTrainer } = useSingleTrainerShop(trainers);
const loading = ref(true);
const error = ref('');
const searchQuery = ref('');
const filters = ref({
  specialty: route.query.specialty || 'all',
  price: 'all',
});

const specialtyOptions = [
  { value: 'all', label: '전체' },
  { value: 'diet', label: '다이어트' },
  { value: 'strength', label: '근력' },
  { value: 'rehab', label: '재활' },
];

const priceOptions = [
  { value: 'all', label: '전체' },
  { value: '50', label: '5만원 이하' },
  { value: '100', label: '10만원 이하' },
];

const filteredTrainers = computed(() => {
  let list = trainers.value;
  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    list = list.filter((t) => t.name.toLowerCase().includes(q));
  }
  if (filters.value.specialty !== 'all') {
    list = list.filter((t) => (t.specialtyKey || '').toLowerCase() === filters.value.specialty);
  }
  if (filters.value.price !== 'all') {
    const max = parseInt(filters.value.price, 10) * 10000;
    list = list.filter((t) => (t.pricePerHour ?? 0) <= max);
  }
  return list;
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

function goToDetail(id) {
  router.push({ name: 'TrainerDetail', params: { id } });
}

onMounted(async () => {
  try {
    const list = await getTrainers();
    trainers.value = list;
    // 1인 트레이너: 상세 페이지로 바로 리다이렉트
    if (list.length === 1) {
      router.replace({ name: 'TrainerDetail', params: { id: list[0].id } });
    }
  } catch (e) {
    error.value = e.message || '트레이너 목록을 불러오지 못했습니다.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
