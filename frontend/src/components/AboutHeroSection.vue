<template>
  <section
    class="relative overflow-x-hidden bg-white px-4 py-24 text-center"
    aria-labelledby="about-hero-heading"
  >
    <!-- 배경 워터마크: 섹션 중앙 상단, 본문 뒤(z-0) -->
    <p
      class="pointer-events-none absolute left-1/2 top-6 z-0 -translate-x-1/2 select-none whitespace-nowrap font-bold text-[clamp(3.5rem,12vw,8rem)] leading-none text-neutral-900/[0.09] sm:top-10"
      aria-hidden="true"
    >
      소개
    </p>

    <div class="relative z-10 mx-auto flex max-w-4xl flex-col items-center">
      <h2
        id="about-hero-heading"
        class="max-w-3xl text-4xl font-black leading-tight text-neutral-900 sm:text-5xl"
      >
        우리는 단순한 헬스장이 아니라, 하나의 공동체입니다.
      </h2>

      <p
        class="mt-6 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg"
      >
        운동만이 아니라 생활 전반이 함께 바뀌는 공간입니다. 회원 한 분 한 분의
        목표를 존중하고, 편안하게 머무를 수 있는 커뮤니티를 지향합니다.
      </p>

      <div
        class="mt-10 flex w-full max-w-md flex-col items-stretch justify-center gap-4 sm:max-w-none sm:flex-row sm:items-center"
      >
        <router-link
          to="/passes"
          class="inline-flex items-center justify-center rounded-lg bg-black px-10 py-4 text-center text-base font-semibold text-white transition hover:brightness-90"
        >
          지금 구독하세요
        </router-link>
        <router-link
          to="/trainers"
          class="inline-flex items-center justify-center rounded-lg border border-black bg-transparent px-10 py-4 text-center text-base font-semibold text-black transition hover:bg-black hover:text-white"
        >
          강좌 찾아보기
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
/**
 * 소개 히어로 섹션 — 밝은 배경 + 워터마크 타이포 + 이중 CTA
 */
</script>
