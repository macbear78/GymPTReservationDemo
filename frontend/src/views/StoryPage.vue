<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

    <!-- Header -->
    <header class="mb-8">
      <p class="text-eyebrow font-semibold tracking-widest uppercase text-primary-500 mb-2">MEMBER STORIES</p>
      <h1 class="text-3xl sm:text-4xl font-bold text-white tracking-tight uppercase">회원 변화 스토리</h1>
      <p class="mt-2 text-slate-400">실제 회원들이 직접 전하는 변화의 이야기입니다.</p>
    </header>

    <!-- Filters -->
    <div class="mb-8 flex flex-wrap gap-2">
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

    <!-- Featured story (첫 번째 스토리 강조) -->
    <div v-if="featured" class="mb-10">
      <article
        class="rounded-2xl border border-white/10 bg-[#141414] overflow-hidden cursor-pointer hover:border-primary-500/50 transition-all duration-300"
        @click="openStory(featured)"
      >
        <div class="grid lg:grid-cols-2">
          <!-- Before/After 이미지 영역 -->
          <div class="relative flex bg-black/20 min-h-[260px] sm:min-h-[340px]">
            <div class="flex-1 flex flex-col items-center justify-center p-6 gap-2 border-r border-white/10">
              <div :class="['w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-4xl sm:text-5xl font-bold text-white shadow-lg', featured.avatarColor]">
                {{ featured.name.charAt(0) }}
              </div>
              <span class="text-xs font-semibold uppercase tracking-widest text-slate-400 mt-2">Before</span>
            </div>
            <div class="flex-1 flex flex-col items-center justify-center p-6 gap-2 bg-primary-950/30">
              <div :class="['w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center text-4xl sm:text-5xl shadow-lg ring-4 ring-primary-400', featured.avatarColor, 'opacity-100 scale-110']">
                <span class="text-4xl sm:text-5xl font-bold text-white">{{ featured.name.charAt(0) }}</span>
                <span class="absolute bottom-1 right-1 text-lg">✨</span>
              </div>
              <span class="text-xs font-semibold uppercase tracking-widest text-primary-500 mt-2">After</span>
            </div>
            <!-- 기간 배지 -->
            <div class="absolute top-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap shadow">
              {{ featured.duration }}
            </div>
          </div>

          <!-- 텍스트 -->
          <div class="p-7 sm:p-10 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-2 mb-3 flex-wrap">
                <span :class="['px-2.5 py-0.5 rounded-full text-xs font-semibold', categoryBadge(featured.category)]">
                  {{ categoryLabel(featured.category) }}
                </span>
                <span class="text-xs text-slate-400">{{ featured.date }}</span>
                <span class="ml-auto text-xs font-bold text-amber-500 flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  추천 스토리
                </span>
              </div>
              <h2 class="text-xl sm:text-2xl font-bold text-white mb-1">{{ featured.name }}</h2>
              <p class="text-sm text-primary-400 font-medium mb-4">{{ featured.subtitle }}</p>

              <!-- 변화 수치 -->
              <div class="flex flex-wrap gap-4 mb-5">
                <div v-for="stat in featured.stats" :key="stat.label" class="text-center">
                  <p class="text-xl font-bold text-white">{{ stat.value }}</p>
                  <p class="text-xs text-slate-400">{{ stat.label }}</p>
                </div>
              </div>

              <p class="text-slate-400 text-sm leading-relaxed line-clamp-3">{{ featured.summary }}</p>
            </div>
            <div class="mt-6 flex items-center gap-3">
              <button
                type="button"
                class="px-5 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600 transition"
                @click.stop="openStory(featured)"
              >
                전체 스토리 보기
              </button>
              <span class="text-xs text-slate-400">{{ featured.trainer }} 트레이너</span>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- Story grid -->
    <div v-if="rest.length" class="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="story in rest"
        :key="story.id"
        class="group rounded-2xl border border-white/10 bg-[#141414] hover:border-primary-500/50 hover:scale-[1.02] transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
        @click="openStory(story)"
      >
        <!-- Before/After 썸네일 -->
        <div class="relative flex h-36 bg-black/20">
          <div class="flex-1 flex flex-col items-center justify-center gap-1 border-r border-white/10">
            <div :class="['w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white shadow', story.avatarColor]">
              {{ story.name.charAt(0) }}
            </div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Before</span>
          </div>
          <div class="flex-1 flex flex-col items-center justify-center gap-1 bg-primary-950/30">
            <div :class="['w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white shadow ring-2 ring-primary-400', story.avatarColor]">
              {{ story.name.charAt(0) }}
            </div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-primary-500">After</span>
          </div>
          <div class="absolute top-2 left-1/2 -translate-x-1/2 bg-black/70 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow">
            {{ story.duration }}
          </div>
        </div>

        <div class="p-5 flex flex-col flex-1">
          <!-- 배지 + 날짜 -->
          <div class="flex items-center gap-2 mb-2 flex-wrap">
            <span :class="['px-2 py-0.5 rounded-full text-xs font-semibold', categoryBadge(story.category)]">
              {{ categoryLabel(story.category) }}
            </span>
            <span class="text-xs text-slate-400 ml-auto">{{ story.date }}</span>
          </div>

          <h2 class="text-base font-bold text-white">{{ story.name }}</h2>
          <p class="text-xs text-primary-400 font-medium mt-0.5 mb-3">{{ story.subtitle }}</p>

          <!-- 변화 수치 -->
          <div class="flex gap-3 mb-3">
            <div v-for="stat in story.stats" :key="stat.label" class="text-center">
              <p class="text-base font-bold text-white">{{ stat.value }}</p>
              <p class="text-[11px] text-slate-400">{{ stat.label }}</p>
            </div>
          </div>

          <p class="text-xs text-slate-400 leading-relaxed flex-1 line-clamp-3">{{ story.summary }}</p>

          <div class="mt-4 flex items-center justify-between pt-3 border-t border-white/5">
            <span class="text-xs text-slate-400">{{ story.trainer }} 트레이너</span>
            <span class="text-xs font-semibold text-primary-400 group-hover:underline">자세히 보기 →</span>
          </div>
        </div>
      </article>
    </div>

    <!-- 빈 상태 -->
    <div v-if="filteredStories.length === 0" class="rounded-2xl bg-white/5 border border-white/10 px-6 py-12 text-center text-slate-400">
      해당 카테고리의 스토리가 없습니다.
    </div>

    <!-- Bottom CTA -->
    <section class="mt-14 rounded-2xl bg-primary-500 px-6 sm:px-10 py-10 text-center text-white">
      <h2 class="text-xl sm:text-2xl font-bold mb-2">나도 변화의 주인공이 되고 싶다면?</h2>
      <p class="text-primary-100 mb-6 text-sm sm:text-base">지금 PT를 예약하고 나만의 스토리를 시작하세요.</p>
      <router-link
        to="/reserve"
        class="inline-block px-8 py-3.5 rounded-xl bg-white text-primary-600 font-semibold hover:bg-slate-100 transition"
      >
        PT 예약하기
      </router-link>
    </section>

  </div>

  <!-- 스토리 상세 모달 -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="selectedStory"
        class="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 overflow-y-auto"
        @click.self="closeStory"
      >
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="closeStory" />
        <div class="relative z-10 w-full max-w-2xl bg-[#141414] rounded-2xl shadow-2xl my-8 border border-white/10">

          <!-- 모달 헤더 -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div class="flex items-center gap-3">
              <div :class="['w-10 h-10 rounded-full flex items-center justify-center font-bold text-white', selectedStory.avatarColor]">
                {{ selectedStory.name.charAt(0) }}
              </div>
              <div>
                <p class="font-bold text-white leading-tight">{{ selectedStory.name }}</p>
                <p class="text-xs text-slate-400">{{ selectedStory.subtitle }}</p>
              </div>
            </div>
            <button type="button" class="text-slate-400 hover:text-white transition p-1" @click="closeStory">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-6 py-6 space-y-6">

            <!-- Before / After 수치 카드 -->
            <div class="grid grid-cols-2 gap-3">
              <div class="rounded-xl bg-white/5 border border-white/10 p-4">
                <p class="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Before</p>
                <div class="space-y-2">
                  <div v-for="b in selectedStory.before" :key="b.label" class="flex justify-between text-sm">
                    <span class="text-slate-400">{{ b.label }}</span>
                    <span class="font-semibold text-slate-200">{{ b.value }}</span>
                  </div>
                </div>
              </div>
              <div class="rounded-xl bg-primary-950/30 border border-primary-800/40 p-4">
                <p class="text-xs font-bold uppercase tracking-widest text-primary-400 mb-3">After</p>
                <div class="space-y-2">
                  <div v-for="a in selectedStory.after" :key="a.label" class="flex justify-between text-sm">
                    <span class="text-slate-400">{{ a.label }}</span>
                    <span class="font-semibold text-primary-400">{{ a.value }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 프로그램 정보 -->
            <div class="flex flex-wrap gap-3 text-sm">
              <div class="flex items-center gap-1.5 text-slate-400">
                <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {{ selectedStory.duration }} 진행
              </div>
              <div class="flex items-center gap-1.5 text-slate-400">
                <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                {{ selectedStory.trainer }} 트레이너
              </div>
              <span :class="['px-2.5 py-0.5 rounded-full text-xs font-semibold', categoryBadge(selectedStory.category)]">
                {{ categoryLabel(selectedStory.category) }}
              </span>
            </div>

            <!-- 인터뷰 -->
            <div class="space-y-5">
              <div v-for="qa in selectedStory.interview" :key="qa.q" class="space-y-1.5">
                <p class="text-xs font-bold text-primary-400 uppercase tracking-wide">Q. {{ qa.q }}</p>
                <p class="text-sm text-slate-300 leading-relaxed pl-3 border-l-2 border-primary-700">{{ qa.a }}</p>
              </div>
            </div>

            <!-- 한 줄 소감 -->
            <blockquote class="rounded-xl bg-white/5 border border-white/10 px-5 py-4 text-sm text-slate-300 italic leading-relaxed">
              "{{ selectedStory.quote }}"
            </blockquote>

            <div class="pt-2">
              <router-link
                to="/reserve"
                class="block w-full py-3 rounded-xl bg-primary-500 text-white text-center font-semibold hover:bg-primary-600 transition"
                @click="closeStory"
              >
                나도 시작하기
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue';

const activeCategory = ref('all');
const selectedStory = ref(null);

const categoryOptions = [
  { value: 'all',      label: '전체' },
  { value: 'diet',     label: '다이어트' },
  { value: 'strength', label: '근력 강화' },
  { value: 'rehab',    label: '재활·교정' },
  { value: 'body',     label: '바디프로필' },
  { value: 'group',    label: '그룹 PT' },
];

function categoryLabel(val) {
  return categoryOptions.find((o) => o.value === val)?.label ?? val;
}

function categoryBadge(val) {
  return {
    diet:     'bg-rose-900/50 text-rose-400',
    strength: 'bg-amber-900/50 text-amber-400',
    rehab:    'bg-teal-900/50 text-teal-400',
    body:     'bg-violet-900/50 text-violet-400',
    group:    'bg-blue-900/50 text-blue-400',
  }[val] ?? 'bg-white/5 text-slate-400';
}

const stories = [
  {
    id: 's1',
    featured: true,
    name: '김민지 (32세)',
    subtitle: '출산 후 체중 감량 · 다이어트 PT 6개월',
    category: 'diet',
    duration: '6개월',
    date: '2024년 11월',
    trainer: '이준혁',
    avatarColor: 'bg-rose-500',
    stats: [
      { label: '감량', value: '-14kg' },
      { label: '체지방률', value: '-8%' },
      { label: '허리', value: '-12cm' },
    ],
    summary: '출산 후 80kg까지 늘어난 체중을 6개월 만에 66kg으로 줄였습니다. 아이 낮잠 시간을 활용한 주 3회 PT와 식단 코칭으로 포기하지 않고 목표를 달성했어요.',
    before: [
      { label: '체중', value: '80kg' },
      { label: '체지방률', value: '38%' },
      { label: '허리 둘레', value: '88cm' },
    ],
    after: [
      { label: '체중', value: '66kg' },
      { label: '체지방률', value: '30%' },
      { label: '허리 둘레', value: '76cm' },
    ],
    interview: [
      { q: '등록 전 가장 걱정됐던 점은?', a: '아이가 어려서 시간이 불규칙한데 PT를 꾸준히 다닐 수 있을지 걱정이었어요. 그런데 트레이너님이 일정에 맞게 유연하게 시간을 조율해주셔서 6개월을 한 번도 빠지지 않았습니다.' },
      { q: '가장 힘들었던 순간은?', a: '3개월 차에 체중이 2주 동안 전혀 안 빠지는 정체기가 왔어요. 포기하고 싶었는데 트레이너님이 수치보다 체형 변화를 사진으로 보여주시며 격려해 주셔서 버텼습니다.' },
      { q: '어떤 변화가 가장 컸나요?', a: '체중 숫자보다 일상이 달라진 게 더 커요. 계단이 편해지고, 아이 안고 다닐 때도 덜 힘들고, 무엇보다 자신감이 생겼습니다.' },
    ],
    quote: '숫자가 안 빠져도 몸이 달라지고 있다는 걸 느낄 수 있었어요. 포기 안 해서 정말 다행입니다.',
  },
  {
    id: 's2',
    featured: false,
    name: '박준호 (28세)',
    subtitle: '마른 체형 벌크업 · 근력 강화 PT 10개월',
    category: 'strength',
    duration: '10개월',
    date: '2024년 10월',
    trainer: '최성훈',
    avatarColor: 'bg-blue-500',
    stats: [
      { label: '체중', value: '+11kg' },
      { label: '골격근량', value: '+6kg' },
      { label: '벤치프레스', value: '+45kg' },
    ],
    summary: '60kg 초반의 마른 체형으로 어떻게 먹어도 살이 안 쪘습니다. 10개월 체계적인 벌크업 PT로 72kg의 단단한 몸을 만들었어요.',
    before: [
      { label: '체중', value: '62kg' },
      { label: '골격근량', value: '26kg' },
      { label: '벤치프레스', value: '40kg' },
    ],
    after: [
      { label: '체중', value: '73kg' },
      { label: '골격근량', value: '32kg' },
      { label: '벤치프레스', value: '85kg' },
    ],
    interview: [
      { q: '마른 체형으로 운동이 힘들지 않았나요?', a: '처음엔 너무 가벼워서 민망할 정도였어요. 하지만 트레이너님이 절대 서두르지 말라고 하시며 기초부터 차근차근 잡아주셨고, 3개월 후부터 눈에 띄게 달라지기 시작했습니다.' },
      { q: '식단 관리가 어렵지 않았나요?', a: '하루 단백질 목표량을 정해주시고 매주 식단 피드백을 주셨어요. 억지로 먹는 게 아니라 즐기면서 먹을 수 있는 방법을 알려주신 게 가장 도움이 됐습니다.' },
    ],
    quote: '친구들이 먼저 "너 몸 달라진 거 아니야?" 라고 묻기 시작했을 때 진짜 달라졌구나 싶었어요.',
  },
  {
    id: 's3',
    featured: false,
    name: '이수연 (45세)',
    subtitle: '허리 디스크 재활 후 일상 복귀 · 4개월',
    category: 'rehab',
    duration: '4개월',
    date: '2024년 9월',
    trainer: '정다은',
    avatarColor: 'bg-teal-500',
    stats: [
      { label: '통증 점수', value: '8→2' },
      { label: '가동범위', value: '+40°' },
      { label: '일상 복귀', value: '100%' },
    ],
    summary: '허리 디스크 4번·5번 수술 후 2년간 운동을 못 했습니다. 재활 전문 트레이너와 함께 4개월 만에 통증 없이 걷고 앉을 수 있게 되었어요.',
    before: [
      { label: '통증 점수 (10점)', value: '8점' },
      { label: '허리 굴곡 각도', value: '30°' },
      { label: '보행 가능 시간', value: '10분' },
    ],
    after: [
      { label: '통증 점수 (10점)', value: '2점' },
      { label: '허리 굴곡 각도', value: '70°' },
      { label: '보행 가능 시간', value: '60분+' },
    ],
    interview: [
      { q: '수술 후 운동이 두렵지 않았나요?', a: '솔직히 처음엔 무서웠어요. 잘못하면 더 나빠지는 거 아닌가 싶어서요. 그런데 트레이너님이 MRI 결과를 직접 보시고 단계별로 안전한 동작만 짜주셔서 신뢰가 생겼습니다.' },
      { q: '재활 PT와 일반 PT의 차이점은?', a: '일반 운동처럼 땀이 나거나 힘든 게 아니라 아주 작은 근육을 깨우는 과정이에요. 지루할 수도 있는데 효과가 확실히 나타나니까 참을 수 있었습니다.' },
    ],
    quote: '운동을 다시 할 수 있다는 것 자체가 기적 같아요. 2년 만에 통증 없이 잤을 때 혼자 울었습니다.',
  },
  {
    id: 's4',
    featured: false,
    name: '최재원 (30세)',
    subtitle: '바디프로필 촬영 D-12주 집중 감량 · 3개월',
    category: 'body',
    duration: '3개월',
    date: '2024년 8월',
    trainer: '이준혁',
    avatarColor: 'bg-violet-500',
    stats: [
      { label: '체지방', value: '-9%' },
      { label: '체중', value: '-7kg' },
      { label: '근육량 유지', value: '99%' },
    ],
    summary: '30세 기념 바디프로필 촬영을 위해 12주 집중 코스에 등록했습니다. 식단 드라이아웃부터 포즈 교정까지 전 과정을 함께 했어요.',
    before: [
      { label: '체중', value: '78kg' },
      { label: '체지방률', value: '22%' },
      { label: '골격근량', value: '36kg' },
    ],
    after: [
      { label: '체중', value: '71kg' },
      { label: '체지방률', value: '13%' },
      { label: '골격근량', value: '35.6kg' },
    ],
    interview: [
      { q: '12주가 충분히 짧지 않았나요?', a: '오히려 12주가 딱 맞았어요. 너무 길면 중간에 무너지고, 짧으면 변화가 없잖아요. 주차별로 탄수화물 조절량을 다르게 가져가면서 지루하지 않게 진행했습니다.' },
      { q: '가장 힘든 구간은?', a: '마지막 2주 드라이아웃 기간이요. 소금도 줄이고 탄수화물도 극도로 제한하는데 머리가 멍해지더라고요. 그래도 트레이너님이 하루하루 컨디션 체크해주셔서 버텼습니다.' },
    ],
    quote: '평생 한 번이라고 생각했는데 1년 후에 또 찍고 싶어졌어요. 그만큼 제 자신이 달라 보였습니다.',
  },
  {
    id: 's5',
    featured: false,
    name: '정혜린·오지수 (커플)',
    subtitle: '커플 그룹 PT · 다이어트 + 체력 향상 · 5개월',
    category: 'group',
    duration: '5개월',
    date: '2024년 7월',
    trainer: '최성훈',
    avatarColor: 'bg-pink-500',
    stats: [
      { label: '정혜린 감량', value: '-8kg' },
      { label: '오지수 근력', value: '+30%' },
      { label: '출석률', value: '96%' },
    ],
    summary: '각자의 목표는 달랐지만 함께 PT를 받으며 서로의 동기부여가 됐습니다. 96% 출석률로 5개월을 완주했어요.',
    before: [
      { label: '정혜린 체중', value: '64kg' },
      { label: '오지수 스쿼트', value: '60kg' },
      { label: '주간 운동 횟수', value: '0회' },
    ],
    after: [
      { label: '정혜린 체중', value: '56kg' },
      { label: '오지수 스쿼트', value: '100kg' },
      { label: '주간 운동 횟수', value: '3회' },
    ],
    interview: [
      { q: '목표가 다른 커플 PT가 가능했나요?', a: '트레이너님이 우리 둘의 목표를 따로 분석해서 같은 운동을 다른 강도로 진행해주셨어요. 서로 옆에서 응원하면서 하니까 혼자보다 훨씬 즐거웠습니다.' },
      { q: '싸우거나 갈등은 없었나요?', a: '(웃음) 운동할 때는 싸울 여유가 없어요. 같이 힘들고 같이 뿌듯하니까 오히려 사이가 더 좋아졌어요. 주변 커플들한테도 강추합니다.' },
    ],
    quote: '운동이 취미가 될 거라곤 생각도 못 했는데, 지금은 PT 없는 날이 심심할 정도예요.',
  },
  {
    id: 's6',
    featured: false,
    name: '윤성민 (62세)',
    subtitle: '무릎 통증 개선 · 시니어 저강도 PT · 8개월',
    category: 'rehab',
    duration: '8개월',
    date: '2024년 6월',
    trainer: '정다은',
    avatarColor: 'bg-emerald-500',
    stats: [
      { label: '무릎 통증', value: '해소' },
      { label: '근력', value: '+25%' },
      { label: '체중', value: '-5kg' },
    ],
    summary: '퇴직 후 운동을 시작했지만 무릎이 안 좋아 일반 헬스장은 무리였어요. 시니어 전문 프로그램으로 8개월 만에 계단도, 등산도 가능해졌습니다.',
    before: [
      { label: '체중', value: '78kg' },
      { label: '무릎 통증 (10점)', value: '7점' },
      { label: '하지 근력 테스트', value: '42점' },
    ],
    after: [
      { label: '체중', value: '73kg' },
      { label: '무릎 통증 (10점)', value: '1점' },
      { label: '하지 근력 테스트', value: '68점' },
    ],
    interview: [
      { q: '60대에 PT를 결심한 이유는?', a: '아들이 강하게 권해서 반신반의로 왔어요. 젊은 사람들 운동법이 내 나이에 맞겠나 싶었는데, 트레이너님이 시니어에 맞는 방식으로 완전히 다르게 접근해 주셨습니다.' },
      { q: '가장 크게 달라진 점은?', a: '오래 앉아 있다 일어날 때 무릎이 안 아파요. 이게 얼마나 큰 변화인지, 겪어본 사람만 알아요. 이제 주말에 북한산 등산도 갑니다.' },
    ],
    quote: '나이가 들면 운동을 쉬어야 한다고 생각했는데, 오히려 지금이 인생에서 가장 건강한 시기입니다.',
  },
];

const filteredStories = computed(() => {
  if (activeCategory.value === 'all') return stories;
  return stories.filter((s) => s.category === activeCategory.value);
});

const featured = computed(() => filteredStories.value.find((s) => s.featured) ?? filteredStories.value[0] ?? null);
const rest = computed(() => filteredStories.value.filter((s) => s !== featured.value));

function openStory(story) {
  selectedStory.value = story;
  document.body.style.overflow = 'hidden';
}

function closeStory() {
  selectedStory.value = null;
  document.body.style.overflow = '';
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
