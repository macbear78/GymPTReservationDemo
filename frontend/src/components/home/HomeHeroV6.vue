<template>
  <section class="hero-v6 hero-v6--slider">
    <div
      class="hero-v6__bg"
      aria-hidden="true"
      v-scroll-animate
      data-animate="zoom-out"
      data-animate-on-load="true"
    >
      <img
        v-for="(src, i) in heroSlides"
        :key="`${src}-${i}`"
        :src="src"
        :alt="`히어로 이미지 ${i + 1}번`"
        class="hero-v6__bg-img"
        :class="{ 'is-active': i === activeSlide }"
      />
    </div>

    <h1
      class="hero-v6__title"
      v-scroll-animate
      data-animate="fade-up"
      data-delay="0"
    >
      {{ hero.title }}
    </h1>

    <div
      v-if="featuredProgram"
      v-scroll-animate
      data-animate="fade-up"
      data-delay="400"
      class="hero-v6__program-card"
    >
      <img
        :src="featuredProgram.image"
        :alt="featuredProgram.title"
        class="hero-v6__program-thumb"
        loading="lazy"
      />
      <div class="hero-v6__program-meta">
        <p class="hero-v6__program-name">{{ featuredProgram.title }}</p>
        <p class="hero-v6__program-desc">{{ featuredProgram.desc }}</p>
        <router-link to="/passes" class="hero-v6__program-link">지금 예약하기 →</router-link>
      </div>
    </div>

    <div class="hero-v6__footer">
      <p
        class="hero-v6__subtitle"
        v-scroll-animate
        data-animate="fade-up"
        data-delay="200"
      >
        {{ hero.subtitle }}
      </p>
      <div class="hero-v6__dots" role="tablist" aria-label="히어로 슬라이드">
        <button
          v-for="i in slideCount"
          :key="i"
          type="button"
          :aria-label="`슬라이드 ${i}번`"
          class="hero-v6__dot-btn"
          @click="activeSlide = i - 1; restartHeroAuto()"
        >
          <span v-if="activeSlide === i - 1" :key="heroProgressKey" class="indicator-dot active" />
          <span v-else class="indicator-dot" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  hero: { type: Object, required: true },
  heroSlides: { type: Array, required: true },
  featuredProgram: { type: Object, default: null },
});

const slideCount = computed(() => Math.max(1, props.heroSlides?.length || 0));

const activeSlide = ref(0);
const heroProgressKey = ref(0);

watch(
  () => props.heroSlides,
  () => {
    activeSlide.value = 0;
  },
  { deep: true }
);

watch(activeSlide, () => {
  heroProgressKey.value += 1;
});

let heroTimer = null;

function stopHeroAuto() {
  if (heroTimer) {
    clearInterval(heroTimer);
    heroTimer = null;
  }
}

function startHeroAuto() {
  stopHeroAuto();
  const n = slideCount.value;
  if (n < 2) return;
  heroTimer = window.setInterval(() => {
    activeSlide.value = (activeSlide.value + 1) % n;
  }, 4000);
}

function restartHeroAuto() {
  startHeroAuto();
}

onMounted(() => {
  startHeroAuto();
});

onUnmounted(() => {
  stopHeroAuto();
});
</script>

<style scoped>
.hero-v6--slider {
  position: relative;
  height: 90vh;
  overflow: hidden;
  font-family: 'Pretendard', -apple-system, sans-serif;
}

.hero-v6__bg {
  position: absolute;
  inset: 0;
}

.hero-v6__bg-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.hero-v6__bg-img.is-active {
  opacity: 1;
}

.hero-v6__title {
  position: absolute;
  top: 2.5rem;
  left: 2.5rem;
  max-width: 60%;
  margin: 0;
  color: #ffffff;
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  font-weight: 700;
  font-size: clamp(2rem, 4vw, 3.5rem);
  line-height: 1.15;
  letter-spacing: -0.01em;
  z-index: 10;
}

.hero-v6__program-card {
  position: absolute;
  bottom: 3rem;
  left: 2.5rem;
  width: 260px;
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 10;
}

.hero-v6__program-thumb {
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  object-fit: cover;
  flex-shrink: 0;
}

.hero-v6__program-meta {
  min-width: 0;
  text-align: left;
}

.hero-v6__program-name {
  margin: 0 0 0.25rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #111827;
}

.hero-v6__program-desc {
  margin: 0 0 0.4rem;
  font-size: 0.75rem;
  color: rgba(17, 24, 39, 0.65);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hero-v6__program-link {
  font-size: 0.75rem;
  text-decoration: underline;
  color: rgba(17, 24, 39, 0.9);
}

.hero-v6__footer {
  position: absolute;
  bottom: 3rem;
  right: 2.5rem;
  z-index: 10;
  text-align: right;
}

.hero-v6__subtitle {
  margin: 0 0 0.6rem;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.8rem;
  font-weight: 500;
}

.hero-v6__dots {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
}

.hero-v6__dot-btn {
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  line-height: 0;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.4);
  transition: width 0.3s ease;
  overflow: hidden;
  position: relative;
  display: inline-block;
}

.indicator-dot.active {
  width: 32px;
  background: rgba(255, 255, 255, 0.3);
}

.indicator-dot.active::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0%;
  background: #fff;
  border-radius: 4px;
  animation: progress-fill 4000ms linear forwards;
}

@keyframes progress-fill {
  from {
    width: 0%;
  }
  to {
    width: 100%;
  }
}

@media (max-width: 640px) {
  .hero-v6__title {
    top: 1.5rem;
    left: 1.25rem;
    max-width: 92%;
  }
  .hero-v6__program-card {
    display: none;
  }
  .hero-v6__footer {
    right: 1.25rem;
    left: 1.25rem;
    bottom: 1.5rem;
    text-align: left;
  }
}
</style>
