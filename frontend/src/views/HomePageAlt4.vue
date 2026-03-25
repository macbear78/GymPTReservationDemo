<template>
  <div class="v4-site">
    <!-- ① Hero — Cinematic gradient -->
    <section class="v4-hero">
      <div class="v4-hero__bg" :style="{ backgroundImage: `url('${hero.image}')` }" />
      <div class="v4-hero__glow" />
      <div class="v4-hero__overlay" />

      <!-- 중앙 콘텐츠 -->
      <div class="v4-hero__center">
        <div class="v4-hero__pill">✦ Premium Personal Training</div>
        <h1 class="v4-hero__title">
          <span class="v4-hero__title-main">{{ hero.title }}</span>
          <span class="v4-hero__title-gradient">내일부터 달라집니다.</span>
        </h1>
        <p class="v4-hero__sub">{{ hero.subtitle }}</p>
        <div class="v4-hero__actions">
          <button type="button" class="v4-glass-btn v4-glass-btn--accent" @click="inquiryOpen = true">
            <span>무료 상담 신청</span>
          </button>
          <router-link to="/reserve" class="v4-glass-btn">
            <span>PT 예약하기</span>
          </router-link>
        </div>
      </div>

      <!-- 하단 stats 바 -->
      <div class="v4-hero__stats-bar">
        <div v-for="s in stats" :key="s.label" class="v4-hero__stat">
          <span class="v4-hero__stat-n">{{ s.value }}</span>
          <span class="v4-hero__stat-l">{{ s.label }}</span>
        </div>
      </div>
    </section>

    <!-- ② About — glass cards on dark -->
    <section class="v4-about-section">
      <div class="v4-about-section__glow" />
      <div class="v4-about-card" v-for="(a, i) in aboutSections" :key="a.title" :class="{ 'v4-about-card--alt': i === 1 }">
        <div class="v4-about-card__img">
          <img :src="a.image" :alt="a.title" loading="lazy" />
        </div>
        <div class="v4-about-card__body">
          <span class="v4-micro-label">{{ i === 0 ? 'ABOUT' : 'METHOD' }}</span>
          <h2 class="v4-about-card__title">{{ a.title }}</h2>
          <p class="v4-about-card__text">{{ a.body }}</p>
          <button v-if="i === 0" type="button" class="v4-text-btn" @click="inquiryOpen = true">상담 신청 →</button>
        </div>
      </div>
    </section>

    <!-- ③ Programs — hexagonal/card grid -->
    <section class="v4-programs">
      <div class="v4-section-head">
        <span class="v4-micro-label">PROGRAMS</span>
        <h2 class="v4-section-title">프로그램</h2>
      </div>
      <div class="v4-programs__grid">
        <div v-for="(p, i) in programs" :key="p.title" class="v4-prog-card" :style="{ '--accent': accentColors[i % accentColors.length] }">
          <div class="v4-prog-card__img">
            <img :src="p.image" :alt="p.title" loading="lazy" />
          </div>
          <div class="v4-prog-card__glass">
            <span class="v4-prog-card__num">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="v4-prog-card__name">{{ p.title }}</h3>
            <p class="v4-prog-card__desc">{{ p.desc }}</p>
          </div>
        </div>
      </div>
      <div style="text-align:center;margin-top:3rem">
        <button type="button" class="v4-glass-btn v4-glass-btn--accent" @click="inquiryOpen = true">
          <span>프로그램 상담 신청</span>
        </button>
      </div>
    </section>

    <!-- ④ Pricing — gradient cards -->
    <section class="v4-pricing">
      <div class="v4-pricing__bg-glow" />
      <div class="v4-section-head">
        <span class="v4-micro-label">PRICING</span>
        <h2 class="v4-section-title">요금 안내</h2>
      </div>
      <div class="v4-pricing__row">
        <div v-for="plan in plans" :key="plan.name" class="v4-plan" :class="{ 'v4-plan--hot': plan.featured }">
          <div v-if="plan.featured" class="v4-plan__glow-ring" />
          <span v-if="plan.featured" class="v4-plan__tag">BEST</span>
          <p class="v4-plan__tier">{{ plan.name }}</p>
          <p class="v4-plan__amount">{{ plan.price }}</p>
          <p class="v4-plan__sessions">{{ plan.period }}</p>
          <hr class="v4-plan__divider" />
          <ul class="v4-plan__perks">
            <li v-for="item in plan.items" :key="item">✦ {{ item }}</li>
          </ul>
          <button type="button" class="v4-plan__cta" @click="inquiryOpen = true">시작하기</button>
        </div>
      </div>
    </section>

    <!-- ⑤ Reviews -->
    <section class="v4-reviews">
      <div class="v4-section-head">
        <span class="v4-micro-label">TESTIMONIALS</span>
        <h2 class="v4-section-title">회원 후기</h2>
      </div>
      <div class="v4-reviews__masonry">
        <div v-for="r in reviews" :key="r.name" class="v4-review-glass">
          <div class="v4-review-glass__stars">★★★★★</div>
          <p class="v4-review-glass__text">"{{ r.text }}"</p>
          <p class="v4-review-glass__who">— {{ r.name }}</p>
        </div>
      </div>
    </section>

    <!-- ⑥ CTA -->
    <section class="v4-final-cta">
      <div class="v4-final-cta__glow" />
      <h2 class="v4-final-cta__title">오늘이 첫 번째 날입니다</h2>
      <p class="v4-final-cta__sub">첫 상담은 무료 · 지금 바로 시작하세요</p>
      <button type="button" class="v4-glass-btn v4-glass-btn--accent v4-glass-btn--lg" @click="inquiryOpen = true">
        <span>무료 상담 신청</span>
      </button>
    </section>

    <!-- ⑦ Contact -->
    <section id="contact" class="v4-contact">
      <div class="v4-section-head">
        <span class="v4-micro-label">LOCATION</span>
        <h2 class="v4-section-title">오시는 길 · 문의</h2>
      </div>
      <div class="v4-contact__inner">
        <div class="v4-contact__map">
          <iframe title="위치" :src="googleMapEmbedUrl" style="border:0;width:100%;height:100%" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" />
        </div>
        <div class="v4-contact__cards">
          <a :href="googleMapLinkUrl" target="_blank" rel="noopener" class="v4-contact-card">
            <span class="v4-contact-card__icon">📍</span>
            <span class="v4-contact-card__label">위치</span>
            <span class="v4-contact-card__value">{{ storeAddress }}</span>
          </a>
          <a :href="storePhoneHref" class="v4-contact-card">
            <span class="v4-contact-card__icon">📞</span>
            <span class="v4-contact-card__label">전화</span>
            <span class="v4-contact-card__value">{{ storePhoneDisplay }}</span>
          </a>
          <a href="https://pf.kakao.com/_example" target="_blank" rel="noopener" class="v4-contact-card">
            <span class="v4-contact-card__icon">💬</span>
            <span class="v4-contact-card__label">카카오톡</span>
            <span class="v4-contact-card__value">1:1 문의하기</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="v4-footer">
      <p>© 2025 {{ storeName }} · 프리미엄 퍼스널 트레이닝</p>
      <div class="v4-footer__nav">
        <router-link to="/trainers">트레이너</router-link>
        <router-link to="/reserve">예약</router-link>
        <router-link to="/dashboard">내 PT</router-link>
      </div>
    </footer>

    <InquiryModal v-model="inquiryOpen" />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { getStoreInfo } from '../api';
import { formatKoreanPhoneDisplayOrDash } from '../utils/phoneFormat';
import InquiryModal from '../components/InquiryModal.vue';

const inquiryOpen = ref(false);
const STORE_ID = 'store_default';
const storeName = ref('Gym PT');
const storeAddress = ref('서울시 강남구 테헤란로 123');
const storePhoneRaw = ref('02-0000-0000');
const accentColors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

const hero = ref({
  image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=85',
  title: '지금 시작하세요',
  subtitle: '당신의 몸을 바꿀 시간입니다',
});
const aboutSections = ref([
  { image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=85', title: '당신만의 변화가 시작되는 곳', body: '프리미엄 환경에서 1:1 맞춤 트레이닝을 경험하세요. 전문 트레이너가 목표에 맞는 프로그램을 설계하고, 안전하고 지속 가능한 변화를 이끌어 드립니다.' },
  { image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=85', title: '목표에 맞춘 PT 루틴', body: '체중 감량, 근력 향상, 자세 교정까지 회원님의 목표를 기준으로 세션을 구성합니다. 운동 강도와 진행 속도를 매 수업마다 조정해 무리 없이 꾸준히 이어갈 수 있습니다.' },
]);
const stats = [
  { value: '7년+', label: '전문 경력' }, { value: '500명+', label: '누적 회원' },
  { value: '98%', label: '회원 만족도' }, { value: '1:1', label: '맞춤 PT' },
];
const plans = [
  { name: 'BASIC', price: '30만원', period: '10회권', items: ['1:1 맞춤 트레이닝', '기초 체력 평가', '운동 루틴 설계'], featured: false },
  { name: 'STANDARD', price: '55만원', period: '20회권', items: ['1:1 맞춤 트레이닝', '체성분 분석', '식단 가이드', '주 2~3회 권장'], featured: true },
  { name: 'PREMIUM', price: '90만원', period: '36회권', items: ['1:1 맞춤 트레이닝', '체성분 분석 월1회', '식단+생활 코칭', '주 3회 권장'], featured: false },
];
const reviews = [
  { name: '김○○ 회원', text: '3개월 만에 10kg 감량, 트레이너님 덕분에 습관이 완전히 바뀌었어요.' },
  { name: '이○○ 회원', text: '자세 교정 목적으로 왔는데 어깨 통증이 사라졌습니다. 강력 추천해요!' },
  { name: '박○○ 회원', text: '1:1 맞춤 관리가 확실히 다릅니다. 지루할 틈이 없어요.' },
  { name: '정○○ 회원', text: '헬스 초보였는데 기초부터 친절하게 알려주셔서 자신감이 생겼어요.' },
];
const DEFAULT_PROGRAMS = [
  { title: '다이어트 PT', desc: '체지방 감소와 건강한 습관을 위한 맞춤 프로그램', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80' },
  { title: '근력 증가', desc: '기초부터 탄탄히, 안전한 근력 트레이닝', image: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=600&q=80' },
  { title: '체형 교정', desc: '자세와 움직임 개선으로 일상이 편해집니다', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80' },
  { title: 'HIIT · 유산소', desc: '짧고 강렬한 인터벌로 효율을 높이는 트레이닝', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80' },
  { title: '재활 트레이닝', desc: '부상 후 몸 회복과 통증 해결 중심의 재활', image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&q=80' },
  { title: '바디프로필 준비', desc: '목표 날짜에 맞춘 집중 컷팅 & 포즈 트레이닝', image: 'https://images.unsplash.com/photo-1606889464198-fcb18894cf50?w=600&q=80' },
];
const programs = ref(DEFAULT_PROGRAMS);

const storePhoneDisplay = computed(() => formatKoreanPhoneDisplayOrDash(storePhoneRaw.value));
const storePhoneHref = computed(() => { const d = String(storePhoneRaw.value || '').replace(/\D/g, ''); return d ? `tel:${d}` : 'tel:'; });
const googleMapQuery = computed(() => encodeURIComponent(storeAddress.value || '서울시 강남구'));
const googleMapEmbedUrl = computed(() => `https://maps.google.com/maps?q=${googleMapQuery.value}&z=16&output=embed`);
const googleMapLinkUrl = computed(() => `https://www.google.com/maps/search/?api=1&query=${googleMapQuery.value}`);

async function loadStoreInfoForHome() {
  try {
    const store = await getStoreInfo(STORE_ID);
    storeName.value = store.name || storeName.value;
    storeAddress.value = store.address || storeAddress.value;
    storePhoneRaw.value = store.phone || storePhoneRaw.value;
    if (Array.isArray(store.programs) && store.programs.length > 0) programs.value = store.programs;
    if (store.hero?.title) hero.value = store.hero;
    if (Array.isArray(store.aboutSections) && store.aboutSections.length === 2) aboutSections.value = store.aboutSections;
  } catch {}
}
onMounted(loadStoreInfoForHome);
</script>

<style scoped>
/* BASE */
.v4-site { background: #050508; color: #fff; font-family: 'Pretendard', sans-serif; overflow-x: hidden; }
.v4-micro-label { font-size: .62rem; font-weight: 700; letter-spacing: .22em; color: rgba(255,255,255,.35); display: block; margin-bottom: .6rem; }
.v4-section-head { text-align: center; margin-bottom: 3.5rem; }
.v4-section-title { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 700; }
.v4-text-btn { background: none; border: none; color: rgba(255,255,255,.5); font-size: .85rem; cursor: pointer; margin-top: 1.5rem; transition: color .2s; padding: 0; }
.v4-text-btn:hover { color: #a78bfa; }

/* GLASS BUTTONS */
.v4-glass-btn { display: inline-flex; align-items: center; gap: .5rem; padding: .85rem 2rem; border-radius: 2rem; font-size: .88rem; font-weight: 600; cursor: pointer; text-decoration: none; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.15); color: #fff; backdrop-filter: blur(8px); transition: all .25s; }
.v4-glass-btn:hover { background: rgba(255,255,255,.14); transform: translateY(-1px); }
.v4-glass-btn--accent { background: linear-gradient(135deg, #6366f1, #8b5cf6); border-color: transparent; box-shadow: 0 8px 30px rgba(99,102,241,.35); }
.v4-glass-btn--accent:hover { background: linear-gradient(135deg, #7c3aed, #6366f1); box-shadow: 0 12px 36px rgba(99,102,241,.45); }
.v4-glass-btn--lg { padding: 1.1rem 2.8rem; font-size: .95rem; }

/* HERO */
.v4-hero { position: relative; height: 100vh; min-height: 720px; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; }
.v4-hero__bg { position: absolute; inset: 0; background-size: cover; background-position: center; filter: brightness(.35) saturate(.8); }
.v4-hero__glow { position: absolute; top: -20%; left: 20%; width: 60vw; height: 60vw; background: radial-gradient(ellipse, rgba(99,102,241,.25) 0%, transparent 70%); pointer-events: none; }
.v4-hero__overlay { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 30%, rgba(5,5,8,.9) 100%); }
.v4-hero__center { position: relative; z-index: 2; text-align: center; padding: 0 5vw; }
.v4-hero__pill { display: inline-flex; align-items: center; gap: .5rem; background: rgba(99,102,241,.15); border: 1px solid rgba(99,102,241,.4); border-radius: 2rem; padding: .4rem 1.2rem; font-size: .72rem; color: #a5b4fc; margin-bottom: 2rem; letter-spacing: .08em; }
.v4-hero__title { display: flex; flex-direction: column; gap: .25rem; margin-bottom: 1.5rem; }
.v4-hero__title-main { font-size: clamp(2.5rem, 6vw, 5.5rem); font-weight: 800; letter-spacing: -.02em; }
.v4-hero__title-gradient { font-size: clamp(2.5rem, 6vw, 5.5rem); font-weight: 800; letter-spacing: -.02em; background: linear-gradient(135deg, #a78bfa, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.v4-hero__sub { font-size: 1rem; color: rgba(255,255,255,.5); margin-bottom: 2.5rem; }
.v4-hero__actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.v4-hero__stats-bar { position: absolute; bottom: 0; left: 0; right: 0; z-index: 2; display: grid; grid-template-columns: repeat(4, 1fr); border-top: 1px solid rgba(255,255,255,.07); backdrop-filter: blur(12px); background: rgba(5,5,8,.5); }
.v4-hero__stat { padding: 1.75rem 2rem; text-align: center; border-right: 1px solid rgba(255,255,255,.05); }
.v4-hero__stat:last-child { border-right: none; }
.v4-hero__stat-n { display: block; font-size: clamp(1.5rem, 2.5vw, 2rem); font-weight: 800; background: linear-gradient(135deg, #a78bfa, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.v4-hero__stat-l { display: block; font-size: .65rem; color: rgba(255,255,255,.35); margin-top: .3rem; letter-spacing: .1em; }

/* ABOUT */
.v4-about-section { position: relative; background: #07070a; padding: 6rem 6vw; overflow: hidden; }
.v4-about-section__glow { position: absolute; bottom: 0; right: 0; width: 50vw; height: 50vw; background: radial-gradient(ellipse, rgba(139,92,246,.12) 0%, transparent 70%); pointer-events: none; }
.v4-about-card { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; max-width: 1100px; margin: 0 auto 5rem; align-items: center; }
.v4-about-card--alt { direction: rtl; }
.v4-about-card--alt > * { direction: ltr; }
.v4-about-card__img { border-radius: 1.5rem; overflow: hidden; aspect-ratio: 4/3; }
.v4-about-card__img img { width: 100%; height: 100%; object-fit: cover; transition: transform .7s; }
.v4-about-card__img:hover img { transform: scale(1.04); }
.v4-about-card__title { font-size: clamp(1.5rem, 2.8vw, 2.1rem); font-weight: 700; margin: .5rem 0 1rem; }
.v4-about-card__text { font-size: .9rem; color: rgba(255,255,255,.5); line-height: 1.85; }

/* PROGRAMS */
.v4-programs { background: #050508; padding: 6rem 6vw; }
.v4-programs__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 1100px; margin: 0 auto; }
.v4-prog-card { position: relative; border-radius: 1.25rem; overflow: hidden; border: 1px solid rgba(255,255,255,.06); cursor: default; }
.v4-prog-card__img { aspect-ratio: 4/3; overflow: hidden; }
.v4-prog-card__img img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.55) saturate(.9); transition: transform .5s, filter .5s; }
.v4-prog-card:hover .v4-prog-card__img img { transform: scale(1.06); filter: brightness(.45); }
.v4-prog-card__glass { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.5rem; background: linear-gradient(to top, rgba(5,5,8,.95), transparent); }
.v4-prog-card__num { font-size: .65rem; color: var(--accent); font-weight: 700; letter-spacing: .15em; }
.v4-prog-card__name { font-size: 1rem; font-weight: 700; margin: .25rem 0 .4rem; }
.v4-prog-card__desc { font-size: .75rem; color: rgba(255,255,255,.5); line-height: 1.5; }

/* PRICING */
.v4-pricing { position: relative; background: #07070a; padding: 7rem 6vw; overflow: hidden; }
.v4-pricing__bg-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60vw; height: 60vw; background: radial-gradient(ellipse, rgba(99,102,241,.08) 0%, transparent 70%); pointer-events: none; }
.v4-pricing__row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 900px; margin: 0 auto; }
.v4-plan { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.08); border-radius: 1.5rem; padding: 2.5rem; position: relative; display: flex; flex-direction: column; }
.v4-plan--hot { background: rgba(99,102,241,.1); border-color: rgba(99,102,241,.4); }
.v4-plan__glow-ring { position: absolute; inset: -1px; border-radius: 1.5rem; border: 1px solid transparent; background: linear-gradient(135deg, #6366f1, #ec4899) border-box; -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0); -webkit-mask-composite: destination-out; mask-composite: exclude; }
.v4-plan__tag { position: absolute; top: -1rem; left: 50%; transform: translateX(-50%); background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; font-size: .6rem; font-weight: 700; padding: .3rem .9rem; border-radius: 1rem; letter-spacing: .12em; white-space: nowrap; }
.v4-plan__tier { font-size: .65rem; letter-spacing: .2em; color: rgba(255,255,255,.4); margin-bottom: .75rem; }
.v4-plan__amount { font-size: 2.2rem; font-weight: 800; }
.v4-plan--hot .v4-plan__amount { background: linear-gradient(135deg, #a78bfa, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.v4-plan__sessions { font-size: .8rem; color: rgba(255,255,255,.35); margin-bottom: 1.5rem; }
.v4-plan__divider { border: none; border-top: 1px solid rgba(255,255,255,.07); margin-bottom: 1.25rem; }
.v4-plan__perks { list-style: none; padding: 0; margin: 0 0 2rem; flex: 1; display: flex; flex-direction: column; gap: .6rem; font-size: .82rem; color: rgba(255,255,255,.55); }
.v4-plan__cta { display: block; width: 100%; padding: .85rem; border-radius: .75rem; font-size: .85rem; font-weight: 600; cursor: pointer; text-align: center; background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.15); color: #fff; transition: all .2s; }
.v4-plan--hot .v4-plan__cta { background: linear-gradient(135deg, #6366f1, #8b5cf6); border-color: transparent; }
.v4-plan__cta:hover { opacity: .85; }

/* REVIEWS */
.v4-reviews { background: #050508; padding: 6rem 6vw; }
.v4-reviews__masonry { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; max-width: 900px; margin: 0 auto; }
.v4-review-glass { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); border-radius: 1.25rem; padding: 2rem; backdrop-filter: blur(8px); }
.v4-review-glass__stars { font-size: .85rem; margin-bottom: .75rem; background: linear-gradient(135deg, #a78bfa, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.v4-review-glass__text { font-size: .88rem; color: rgba(255,255,255,.65); line-height: 1.75; margin-bottom: .75rem; }
.v4-review-glass__who { font-size: .72rem; color: rgba(255,255,255,.3); }

/* FINAL CTA */
.v4-final-cta { position: relative; background: #07070a; padding: 8rem 6vw; text-align: center; overflow: hidden; }
.v4-final-cta__glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 70vw; height: 40vw; background: radial-gradient(ellipse, rgba(99,102,241,.18) 0%, transparent 70%); pointer-events: none; }
.v4-final-cta__title { font-size: clamp(2rem, 5vw, 4rem); font-weight: 800; margin-bottom: .75rem; position: relative; }
.v4-final-cta__sub { font-size: .95rem; color: rgba(255,255,255,.45); margin-bottom: 2.5rem; position: relative; }

/* CONTACT */
.v4-contact { background: #050508; padding: 6rem 6vw; border-top: 1px solid rgba(255,255,255,.05); }
.v4-contact__inner { display: grid; grid-template-columns: 1.5fr 1fr; gap: 2.5rem; max-width: 1100px; margin: 0 auto; }
.v4-contact__map { height: 380px; border-radius: 1.25rem; overflow: hidden; border: 1px solid rgba(255,255,255,.07); }
.v4-contact__cards { display: flex; flex-direction: column; gap: 1rem; }
.v4-contact-card { display: flex; flex-direction: column; gap: .4rem; background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); border-radius: 1rem; padding: 1.5rem; text-decoration: none; color: inherit; transition: border-color .2s, background .2s; }
.v4-contact-card:hover { border-color: rgba(99,102,241,.4); background: rgba(99,102,241,.06); }
.v4-contact-card__icon { font-size: 1.2rem; }
.v4-contact-card__label { font-size: .65rem; color: rgba(255,255,255,.35); letter-spacing: .12em; }
.v4-contact-card__value { font-size: .88rem; color: rgba(255,255,255,.75); }

/* FOOTER */
.v4-footer { background: #030305; border-top: 1px solid rgba(255,255,255,.05); padding: 1.75rem 6vw; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
.v4-footer p { font-size: .75rem; color: rgba(255,255,255,.2); margin: 0; }
.v4-footer__nav { display: flex; gap: 1.5rem; }
.v4-footer__nav a { font-size: .75rem; color: rgba(255,255,255,.3); text-decoration: none; }
.v4-footer__nav a:hover { color: rgba(255,255,255,.7); }

@media (max-width: 900px) {
  .v4-hero__stats-bar { grid-template-columns: repeat(2, 1fr); }
  .v4-about-card, .v4-about-card--alt { grid-template-columns: 1fr; direction: ltr; }
  .v4-programs__grid { grid-template-columns: repeat(2, 1fr); }
  .v4-pricing__row { grid-template-columns: 1fr; }
  .v4-reviews__masonry { grid-template-columns: 1fr; }
  .v4-contact__inner { grid-template-columns: 1fr; }
}
</style>
