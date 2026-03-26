<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

    <!-- Header -->
    <header class="mb-8">
      <p class="text-eyebrow font-semibold tracking-widest uppercase text-primary-500 mb-2">PROGRAM</p>
      <h1 class="text-3xl sm:text-4xl font-bold text-white tracking-tight uppercase">강좌 안내</h1>
      <p class="mt-2 text-slate-400">목표에 맞는 PT 프로그램을 선택하고 전문 트레이너와 함께 시작해보세요.</p>
    </header>

    <!-- Filters -->
    <div class="mb-8 space-y-4">
      <!-- Category -->
      <div class="flex flex-wrap gap-2 items-center">
        <span class="text-sm text-slate-400 font-medium w-12">카테고리</span>
        <button
          v-for="opt in categoryOptions"
          :key="opt.value"
          type="button"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition',
            activeCategory === opt.value
              ? 'bg-primary-500 text-white shadow-md'
              : 'bg-white/5 text-slate-300 hover:bg-white/10',
          ]"
          @click="activeCategory = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
      <!-- Level -->
      <div class="flex flex-wrap gap-2 items-center">
        <span class="text-sm text-slate-400 font-medium w-12">레벨</span>
        <button
          v-for="opt in levelOptions"
          :key="opt.value"
          type="button"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition',
            activeLevel === opt.value
              ? 'bg-primary-500 text-white shadow-md'
              : 'bg-white/5 text-slate-300 hover:bg-white/10',
          ]"
          @click="activeLevel = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- Result count -->
    <p v-if="filteredClasses.length > 0" class="text-sm text-slate-500 mb-5">
      총 <strong class="text-white">{{ filteredClasses.length }}</strong>개 강좌
    </p>

    <!-- Empty state -->
    <div
      v-if="filteredClasses.length === 0"
      class="rounded-2xl bg-white/5 border border-white/10 px-6 py-12 text-center text-slate-400"
    >
      조건에 맞는 강좌가 없습니다.
    </div>

    <!-- Cards grid -->
    <div v-else class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="cls in filteredClasses"
        :key="cls.id"
        class="group rounded-2xl border border-white/10 bg-[#141414] transition-all duration-300 hover:border-primary-500/50 hover:scale-[1.02] flex flex-col overflow-hidden"
      >
        <!-- Color band -->
        <div :class="['h-2', cls.color]" />

        <div class="p-6 sm:p-7 flex flex-col flex-1">
          <!-- Badges -->
          <div class="flex items-center gap-2 mb-3">
            <span :class="['px-2.5 py-0.5 rounded-full text-xs font-semibold', cls.categoryBadge]">
              {{ cls.categoryLabel }}
            </span>
            <span :class="['px-2.5 py-0.5 rounded-full text-xs font-semibold', levelBadgeClass(cls.level)]">
              {{ levelLabel(cls.level) }}
            </span>
          </div>

          <!-- Icon + Title -->
          <div class="flex items-start gap-3 mb-3">
            <span class="text-3xl leading-none mt-0.5">{{ cls.icon }}</span>
            <div>
              <h2 class="text-lg font-bold text-white leading-snug">{{ cls.title }}</h2>
              <p class="text-sm text-primary-400 font-medium mt-0.5">{{ cls.subtitle }}</p>
            </div>
          </div>

          <p class="text-sm text-slate-400 leading-relaxed flex-1">{{ cls.description }}</p>

          <!-- Meta info -->
          <ul class="mt-4 space-y-1.5 text-sm text-slate-400">
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ cls.duration }}
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-4 h-4 text-primary-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ cls.groupSize }}
            </li>
            <li v-if="cls.tags && cls.tags.length" class="flex flex-wrap gap-1 pt-0.5">
              <span
                v-for="tag in cls.tags"
                :key="tag"
                class="px-2 py-0.5 rounded bg-white/5 text-slate-400 text-xs"
              >
                #{{ tag }}
              </span>
            </li>
          </ul>

          <!-- 담당 트레이너 → 예약 -->
          <div class="mt-5 pt-4 border-t border-white/5">
            <div class="flex items-center justify-between mb-2">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">담당 트레이너</p>
              <p class="text-xs text-primary-500 font-medium">트레이너 선택 시 바로 예약</p>
            </div>
            <div v-if="trainersLoading" class="flex gap-2">
              <div v-for="i in 2" :key="i" class="h-10 w-28 rounded-xl bg-white/5 animate-pulse" />
            </div>
            <div v-else-if="matchedTrainers(cls).length === 0" class="text-xs text-slate-400">
              트레이너 정보를 불러오는 중입니다.
            </div>
            <div v-else class="flex flex-wrap gap-2">
              <button
                v-for="trainer in matchedTrainers(cls)"
                :key="trainer.id"
                type="button"
                class="group/btn flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 text-xs font-medium hover:bg-primary-500 hover:text-white hover:border-primary-500 transition-all"
                @click="reserveWithTrainer(trainer, cls)"
              >
                <span
                  class="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                  :class="avatarColor(trainer.id)"
                >{{ trainer.name.charAt(0) }}</span>
                <span class="flex flex-col items-start leading-tight">
                  <span>{{ trainer.name }}</span>
                  <span class="text-[10px] text-slate-500 group-hover/btn:text-white/70">세션당 {{ formatPrice(trainer.pricePerHour ?? 0) }}</span>
                </span>
                <svg class="w-3 h-3 opacity-0 group-hover/btn:opacity-100 -ml-0.5 transition-opacity shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getTrainers } from '../api';

const router = useRouter();
const activeCategory = ref('all');
const activeLevel = ref('all');
const trainers = ref([]);
const trainersLoading = ref(true);

const categoryOptions = [
  { value: 'all', label: '전체' },
  { value: 'diet', label: '다이어트' },
  { value: 'strength', label: '근력 강화' },
  { value: 'rehab', label: '재활·교정' },
  { value: 'body', label: '바디프로필' },
  { value: 'group', label: '그룹 PT' },
];

const levelOptions = [
  { value: 'all', label: '전체' },
  { value: 'beginner', label: '입문' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
];

// 강좌 카테고리 → 트레이너 specialtyKey 매핑
const CATEGORY_SPECIALTY = {
  diet:     'diet',
  strength: 'strength',
  rehab:    'rehab',
  body:     'body',
  group:    'group',
};

const classes = [
  {
    id: 'c1',
    title: '다이어트 PT',
    subtitle: '체지방 감소 · 유산소 복합 훈련',
    description: '유산소와 웨이트를 결합한 서킷 트레이닝으로 체지방을 효과적으로 줄입니다. 식단 가이드와 함께 지속 가능한 다이어트를 돕습니다.',
    category: 'diet',
    categoryLabel: '다이어트',
    categoryBadge: 'bg-rose-900/50 text-rose-400',
    color: 'bg-rose-400',
    level: 'beginner',
    icon: '🔥',
    duration: '60분 / 세션',
    groupSize: '1:1 개인 PT',
    tags: ['유산소', '서킷', '식단'],
  },
  {
    id: 'c2',
    title: '근력 강화 PT',
    subtitle: '코어 · 하체 · 상체 분할 훈련',
    description: '3분할 프로그램으로 전신 근력을 체계적으로 키웁니다. 기초 자세 교정부터 고중량 훈련까지 단계적으로 진행합니다.',
    category: 'strength',
    categoryLabel: '근력 강화',
    categoryBadge: 'bg-amber-900/50 text-amber-400',
    color: 'bg-amber-400',
    level: 'intermediate',
    icon: '💪',
    duration: '60분 / 세션',
    groupSize: '1:1 개인 PT',
    tags: ['웨이트', '분할운동', '코어'],
  },
  {
    id: 'c3',
    title: '재활 · 교정 PT',
    subtitle: '체형 교정 · 통증 완화 케어',
    description: '잘못된 자세와 근육 불균형을 분석하여 통증 없이 건강한 몸을 만듭니다. 오피스워커, 허리·어깨 불편감이 있는 분께 추천합니다.',
    category: 'rehab',
    categoryLabel: '재활·교정',
    categoryBadge: 'bg-teal-900/50 text-teal-400',
    color: 'bg-teal-400',
    level: 'beginner',
    icon: '🧘',
    duration: '50분 / 세션',
    groupSize: '1:1 개인 PT',
    tags: ['체형교정', '허리', '자세'],
  },
  {
    id: 'c4',
    title: '바디프로필 PT',
    subtitle: '단기 집중 체형 완성 프로그램',
    description: '촬영 D-12주를 기준으로 식단·훈련·컨디셔닝을 종합 관리합니다. 감량, 증량, 드라이아웃까지 전 과정을 함께합니다.',
    category: 'body',
    categoryLabel: '바디프로필',
    categoryBadge: 'bg-violet-900/50 text-violet-400',
    color: 'bg-violet-400',
    level: 'advanced',
    icon: '📸',
    duration: '70분 / 세션',
    groupSize: '1:1 개인 PT',
    tags: ['다이어트', '증량', '컨디셔닝'],
  },
  {
    id: 'c5',
    title: '그룹 PT',
    subtitle: '소규모 팀 트레이닝 (2~4명)',
    description: '친구·커플·가족과 함께하는 소그룹 PT입니다. 팀워크와 경쟁 심리를 활용해 더 재미있고 꾸준하게 운동할 수 있습니다.',
    category: 'group',
    categoryLabel: '그룹 PT',
    categoryBadge: 'bg-blue-900/50 text-blue-400',
    color: 'bg-blue-400',
    level: 'beginner',
    icon: '🤝',
    duration: '60분 / 세션',
    groupSize: '2~4명 그룹',
    tags: ['커플', '친구', '그룹'],
  },
  {
    id: 'c6',
    title: '시니어 · 저강도 PT',
    subtitle: '안전하고 즐거운 건강 운동',
    description: '50대 이상, 운동 경험이 없거나 관절이 불편한 분을 위한 저충격 프로그램입니다. 균형감각·유연성·근지구력을 향상시킵니다.',
    category: 'rehab',
    categoryLabel: '재활·교정',
    categoryBadge: 'bg-teal-900/50 text-teal-400',
    color: 'bg-emerald-400',
    level: 'beginner',
    icon: '🌿',
    duration: '50분 / 세션',
    groupSize: '1:1 개인 PT',
    tags: ['시니어', '저강도', '유연성'],
  },
];

const filteredClasses = computed(() => {
  return classes.filter((cls) => {
    const catMatch = activeCategory.value === 'all' || cls.category === activeCategory.value;
    const lvlMatch = activeLevel.value === 'all' || cls.level === activeLevel.value;
    return catMatch && lvlMatch;
  });
});

function levelLabel(level) {
  return { beginner: '입문', intermediate: '중급', advanced: '고급' }[level] ?? level;
}

function levelBadgeClass(level) {
  return {
    beginner: 'bg-green-900/50 text-green-400',
    intermediate: 'bg-orange-900/50 text-orange-400',
    advanced: 'bg-red-900/50 text-red-400',
  }[level] ?? 'bg-white/5 text-slate-400';
}

const AVATAR_COLORS = [
  'bg-amber-500', 'bg-rose-500', 'bg-emerald-500', 'bg-violet-500',
  'bg-blue-500', 'bg-teal-500', 'bg-orange-500', 'bg-pink-500',
  'bg-indigo-500', 'bg-cyan-500',
];

function formatPrice(n) {
  return new Intl.NumberFormat('ko-KR').format(n) + '원';
}

function avatarColor(id) {
  const index = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function matchedTrainers(cls) {
  const specialtyKey = CATEGORY_SPECIALTY[cls.category];
  if (specialtyKey === null) return trainers.value;
  return trainers.value.filter(
    (t) => (t.specialtyKey || '').toLowerCase() === specialtyKey
  );
}

function reserveWithTrainer(trainer, cls) {
  router.push({
    path: '/reserve',
    query: { trainer: trainer.name, program: cls.title },
  });
}

onMounted(async () => {
  try {
    trainers.value = await getTrainers();
  } catch {
    // 트레이너 로드 실패 시 빈 배열 유지 — 카드는 그대로 표시
  } finally {
    trainersLoading.value = false;
  }
});
</script>
