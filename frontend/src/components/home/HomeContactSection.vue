<template>
  <section id="contact" class="py-20 sm:py-28 bg-zinc-900">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <h2
        v-scroll-animate
        data-animate="fade-up"
        data-delay="0"
        class="text-3xl sm:text-4xl font-bold text-white text-center mb-14"
      >
        오시는 길 · 문의
      </h2>
      <div
        v-scroll-animate
        data-animate="fade-up"
        data-delay="200"
        class="rounded-2xl overflow-hidden border border-zinc-700 mb-8"
      >
        <iframe
          title="스토어 위치 지도"
          :src="mapEmbedUrl"
          class="w-full h-[320px] sm:h-[420px]"
          style="border: 0"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen
        />
      </div>
      <div
        v-scroll-animate
        data-animate="fade-up"
        data-delay="400"
        class="flex flex-col sm:flex-row gap-8 sm:gap-12 justify-center items-center sm:items-start text-zinc-400"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-400 shrink-0"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div class="text-left">
            <p class="text-white font-medium mb-1">위치</p>
            <a
              :href="mapLinkUrl"
              target="_blank"
              rel="noopener"
              class="hover:text-amber-400 transition"
            >
              {{ address }}
            </a>
          </div>
        </div>
        <a :href="phoneHref" class="flex items-center gap-4 hover:text-amber-400 transition">
          <div
            class="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-400 shrink-0"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <div class="text-left">
            <p class="text-white font-medium mb-1">전화</p>
            <p>{{ phoneDisplay }}</p>
          </div>
        </a>
        <a
          :href="kakaoUrl"
          target="_blank"
          rel="noopener"
          class="flex items-center gap-4 hover:text-amber-400 transition"
        >
          <div
            class="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-400 shrink-0"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.328-1.18.24-1.556-.223l-.002-.003-1.014-1.589a8.18 8.18 0 0 1-1.793-.96C3.967 15.49 1.5 12.358 1.5 8.185 1.5 3.664 6.201 0 12 0Z"
              />
            </svg>
          </div>
          <div class="text-left">
            <p class="text-white font-medium mb-1">카카오톡</p>
            <p>{{ kakaoLabel }}</p>
          </div>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  address: { type: String, required: true },
  phoneDisplay: { type: String, required: true },
  phoneHref: { type: String, required: true },
  mapEmbedUrl: { type: String, required: true },
  mapLinkUrl: { type: String, required: true },
  kakaoUrl: {
    type: String,
    default: 'https://pf.kakao.com/_example',
  },
  kakaoLabel: {
    type: String,
    default: '1:1 문의하기',
  },
});
</script>
