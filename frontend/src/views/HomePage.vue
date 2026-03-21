<template>
  <div class="gym-site">
    <!-- 1. Hero -->
    <section class="relative min-h-[90vh] flex items-end sm:items-center justify-center overflow-hidden bg-zinc-950">
      <div
        class="absolute inset-0 bg-cover bg-center"
        style="background-image: url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=85');"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/40" />
      <div class="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-20 sm:pb-0 text-center">
        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-5 animate-fade-in">
          지금 시작하세요
        </h1>
        <p class="text-xl sm:text-2xl text-zinc-300 mb-10 sm:mb-12 max-w-2xl mx-auto animate-fade-in animation-delay-150">
          당신의 몸을 바꿀 시간입니다
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-300">
          <a
            href="#contact"
            class="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border-2 border-white text-white hover:bg-white hover:text-zinc-950 transition-all duration-300"
          >
            무료 상담
          </a>
          <router-link
            to="/reserve"
            class="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/25 hover:scale-[1.02]"
          >
            PT 예약하기
          </router-link>
        </div>
      </div>
    </section>

    <!-- 2. About / Gym Intro -->
    <section class="py-20 sm:py-28 bg-zinc-900">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div class="order-2 lg:order-1 section-enter">
            <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">
              당신만의 변화가 시작되는 곳
            </h2>
            <p class="text-zinc-400 text-lg leading-relaxed mb-6">
              프리미엄 환경에서 1:1 맞춤 트레이닝을 경험하세요. 전문 트레이너가 목표에 맞는 프로그램을 설계하고, 안전하고 지속 가능한 변화를 이끌어 드립니다.
            </p>
            <p class="text-zinc-500 leading-relaxed">
              넓고 쾌적한 공간, 최신 장비, 그리고 당신에게만 집중하는 시간. 지금 바로 찾아오세요.
            </p>
          </div>
          <div class="order-1 lg:order-2 grid grid-cols-2 gap-3 sm:gap-4">
            <img
              src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80"
              alt="헬스장 내부"
              class="rounded-2xl object-cover w-full aspect-[4/5] shadow-2xl section-enter"
              loading="lazy"
            />
            <img
              src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80"
              alt="PT 트레이닝"
              class="rounded-2xl object-cover w-full aspect-[4/5] mt-8 sm:mt-12 shadow-2xl section-enter"
              style="animation-delay: 0.1s"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 3. Trainers -->
    <section class="py-20 sm:py-28 bg-zinc-950">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 class="text-3xl sm:text-4xl font-bold text-white text-center mb-4 section-enter">
          전문 트레이너를 만나보세요
        </h2>
        <p class="text-zinc-500 text-center mb-14 max-w-xl mx-auto section-enter">
          목표에 맞는 트레이너와 함께하면 결과가 달라집니다
        </p>
        <div v-if="trainersLoading" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="i in 6" :key="i" class="rounded-2xl bg-zinc-800/80 h-80 animate-pulse" />
        </div>
        <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(t, i) in displayedTrainers"
            :key="t.id"
            class="group rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-zinc-600 transition-all duration-300 section-enter"
            :style="{ animationDelay: `${i * 80}ms` }"
          >
            <div class="aspect-[3/4] relative overflow-hidden bg-zinc-800">
              <img
                v-if="t.profileImage || t.image"
                :src="t.profileImage || t.image"
                :alt="t.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center text-4xl font-bold text-white bg-gradient-to-br from-zinc-700 to-zinc-800"
              >
                {{ (t.name || '?').charAt(0) }}
              </div>
            </div>
            <div class="p-5 sm:p-6">
              <h3 class="text-xl font-semibold text-white mb-1">{{ t.name }}</h3>
              <p class="text-amber-400/90 text-sm font-medium mb-2">{{ t.specialty }}</p>
              <p class="text-zinc-500 text-sm">{{ t.experience }}</p>
              <p v-if="t.intro" class="text-zinc-400 text-sm mt-2 line-clamp-2">{{ t.intro }}</p>
              <router-link
                :to="{ path: '/reserve', query: { trainer: t.name } }"
                class="inline-block mt-4 text-amber-400 text-sm font-medium hover:text-amber-300 transition"
              >
                예약하기 →
              </router-link>
            </div>
          </div>
        </div>
        <div v-if="trainers.length > 6" class="text-center mt-10 section-enter">
          <router-link
            to="/trainers"
            class="inline-flex items-center px-6 py-3 rounded-xl font-medium border border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-500 transition"
          >
            트레이너 전체 보기
          </router-link>
        </div>
      </div>
    </section>

    <!-- 4. Transformation -->
    <section class="py-20 sm:py-28 bg-zinc-900">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 class="text-3xl sm:text-4xl font-bold text-white text-center mb-4 section-enter">
          함께한 변화
        </h2>
        <p class="text-zinc-500 text-center mb-14 max-w-xl mx-auto section-enter">
          꾸준함과 맞춤 프로그램이 만들어 낸 결과입니다
        </p>
        <div class="grid md:grid-cols-2 gap-8">
          <div class="rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-800/50 section-enter">
            <div class="grid grid-cols-2 gap-0">
              <div class="aspect-square bg-zinc-700/80 flex items-center justify-center p-4">
                <span class="text-zinc-500 text-sm font-medium">Before</span>
              </div>
              <div class="aspect-square bg-zinc-700/80 flex items-center justify-center p-4">
                <span class="text-amber-400/90 text-sm font-medium">After</span>
              </div>
            </div>
            <div class="p-5 border-t border-zinc-700">
              <p class="text-zinc-400 text-sm">다이어트 · 12주 프로그램</p>
              <p class="text-white font-medium mt-1">"목표 체중 달성하고 유지까지 성공했어요."</p>
            </div>
          </div>
          <div class="rounded-2xl overflow-hidden border border-zinc-700 bg-zinc-800/50 section-enter" style="animation-delay: 0.1s">
            <div class="grid grid-cols-2 gap-0">
              <div class="aspect-square bg-zinc-700/80 flex items-center justify-center p-4">
                <span class="text-zinc-500 text-sm font-medium">Before</span>
              </div>
              <div class="aspect-square bg-zinc-700/80 flex items-center justify-center p-4">
                <span class="text-amber-400/90 text-sm font-medium">After</span>
              </div>
            </div>
            <div class="p-5 border-t border-zinc-700">
              <p class="text-zinc-400 text-sm">근력 증가 · 체형 교정</p>
              <p class="text-white font-medium mt-1">"자세가 바뀌고 일상이 편해졌습니다."</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 5. Programs -->
    <section class="py-20 sm:py-28 bg-zinc-950">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 class="text-3xl sm:text-4xl font-bold text-white text-center mb-4 section-enter">
          프로그램
        </h2>
        <p class="text-zinc-500 text-center mb-14 section-enter">
          목표에 맞는 프로그램을 선택하세요
        </p>
        <div class="grid sm:grid-cols-3 gap-6">
          <div
            v-for="(p, i) in programs"
            :key="p.title"
            class="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 transition-all duration-300 text-center section-enter"
            :style="{ animationDelay: `${i * 100}ms` }"
          >
            <div class="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mx-auto mb-5">
              <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="p.iconPath" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-white mb-2">{{ p.title }}</h3>
            <p class="text-zinc-500 text-sm">{{ p.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Reviews -->
    <section class="py-20 sm:py-28 bg-zinc-900">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 class="text-3xl sm:text-4xl font-bold text-white text-center mb-14 section-enter">
          회원 후기
        </h2>
        <div class="grid sm:grid-cols-2 gap-6">
          <div
            v-for="(r, i) in reviews"
            :key="i"
            class="p-6 sm:p-8 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 section-enter"
            :style="{ animationDelay: `${i * 80}ms` }"
          >
            <p class="text-zinc-300 leading-relaxed mb-6">"{{ r.text }}"</p>
            <p class="text-amber-400/90 font-medium">{{ r.name }}</p>
            <p class="text-zinc-600 text-sm">{{ r.program }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. Reservation CTA -->
    <section class="py-20 sm:py-28 bg-zinc-950">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4 section-enter">
          지금 바로 예약하세요
        </h2>
        <p class="text-zinc-500 mb-10 section-enter">
          첫 PT부터 함께합니다. 간단한 예약으로 시작하세요.
        </p>
        <router-link
          to="/reserve"
          class="inline-flex items-center justify-center px-10 py-4 rounded-xl font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/25 hover:scale-[1.02] section-enter"
        >
          예약하기
        </router-link>
      </div>
    </section>

    <!-- 8. Contact -->
    <section id="contact" class="py-20 sm:py-28 bg-zinc-900">
      <div class="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 class="text-3xl sm:text-4xl font-bold text-white text-center mb-14 section-enter">
          오시는 길 · 문의
        </h2>
        <div class="flex flex-col sm:flex-row gap-8 sm:gap-12 justify-center items-center sm:items-start text-zinc-400 section-enter">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div class="text-left">
              <p class="text-white font-medium mb-1">위치</p>
              <p>서울시 강남구 테헤란로 123</p>
            </div>
          </div>
          <a href="tel:02-0000-0000" class="flex items-center gap-4 hover:text-amber-400 transition">
            <div class="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div class="text-left">
              <p class="text-white font-medium mb-1">전화</p>
              <p>02-0000-0000</p>
            </div>
          </a>
          <a href="https://pf.kakao.com/_example" target="_blank" rel="noopener" class="flex items-center gap-4 hover:text-amber-400 transition">
            <div class="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.328-1.18.24-1.556-.223l-.002-.003-1.014-1.589a8.18 8.18 0 0 1-1.793-.96C3.967 15.49 1.5 12.358 1.5 8.185 1.5 3.664 6.201 0 12 0Z" />
              </svg>
            </div>
            <div class="text-left">
              <p class="text-white font-medium mb-1">카카오톡</p>
              <p>1:1 문의하기</p>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- 9. Footer -->
    <footer class="py-10 bg-zinc-950 border-t border-zinc-800">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-zinc-600 text-sm">
          Gym PT · 프리미엄 퍼스널 트레이닝
        </p>
        <div class="flex gap-6 text-zinc-500 text-sm">
          <router-link to="/trainers" class="hover:text-zinc-300 transition">트레이너</router-link>
          <router-link to="/reserve" class="hover:text-zinc-300 transition">예약</router-link>
          <router-link to="/my-reservations" class="hover:text-zinc-300 transition">예약 확인</router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getTrainers } from '../api';

const trainers = ref([]);
const trainersLoading = ref(true);

const displayedTrainers = computed(() => {
  const list = trainers.value || [];
  return list.slice(0, 6);
});

const programs = [
  {
    title: '다이어트',
    desc: '목표 체중과 건강한 습관을 위한 맞춤 프로그램',
    iconPath: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  },
  {
    title: '근력 증가',
    desc: '기초부터 탄탄히, 안전한 근력 트레이닝',
    iconPath: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    title: '체형 교정',
    desc: '자세와 움직임 개선으로 일상이 편해집니다',
    iconPath: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
];

const reviews = [
  { text: '처음엔 부담스러웠는데, 트레이너님이 목표에 맞게 잡아주셔서 3개월 만에 결과가 보였어요.', name: '김○○', program: '다이어트 프로그램' },
  { text: '운동을 제대로 배우고 싶어서 시작했는데, 자세와 호흡까지 세심하게 봐주셔서 만족스러워요.', name: '이○○', program: '근력 · 체형 교정' },
];

onMounted(async () => {
  try {
    trainers.value = await getTrainers();
  } catch {
    trainers.value = [];
  } finally {
    trainersLoading.value = false;
  }
});
</script>

<style scoped>
.gym-site {
  background: #09090b;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animation-delay-150 {
  animation-delay: 0.15s;
  opacity: 0;
}

.animation-delay-300 {
  animation-delay: 0.3s;
  opacity: 0;
}

.section-enter {
  opacity: 0;
  transform: translateY(20px);
  animation: fade-in 0.6s ease-out forwards;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .section-enter {
    animation: none;
    opacity: 1;
    transform: none;
  }
  .animation-delay-150,
  .animation-delay-300 {
    opacity: 1;
  }
}
</style>
