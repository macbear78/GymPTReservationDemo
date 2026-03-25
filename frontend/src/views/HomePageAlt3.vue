<template>
  <div class="v3-site">
    <!-- ① Hero — 화이트 미니멀 -->
    <section class="v3-hero">
      <div class="v3-hero__media">
        <img :src="hero.image" alt="" class="v3-hero__img" />
        <div class="v3-hero__img-overlay" />
      </div>
      <div class="v3-hero__content">
        <div class="v3-hero__badge">PREMIUM PT · 1:1 맞춤 트레이닝</div>
        <h1 class="v3-hero__title">{{ hero.title }}<br /><em>내일부터 달라집니다.</em></h1>
        <p class="v3-hero__sub">{{ hero.subtitle }}</p>
        <div class="v3-hero__btns">
          <button type="button" class="v3-btn v3-btn--primary" @click="inquiryOpen = true">무료 상담 신청</button>
          <router-link to="/reserve" class="v3-btn v3-btn--outline">PT 예약하기</router-link>
        </div>
      </div>
    </section>

    <!-- ② Stats 띠 -->
    <section class="v3-ribbon">
      <div v-for="s in stats" :key="s.label" class="v3-ribbon__item">
        <span class="v3-ribbon__val">{{ s.value }}</span>
        <span class="v3-ribbon__key">{{ s.label }}</span>
      </div>
    </section>

    <!-- ③ About 1 -->
    <section class="v3-about">
      <div class="v3-about__text-col">
        <span class="v3-label">ABOUT US</span>
        <h2 class="v3-h2">{{ aboutSections[0].title }}</h2>
        <p class="v3-body">{{ aboutSections[0].body }}</p>
        <button type="button" class="v3-btn v3-btn--link" @click="inquiryOpen = true">상담 신청하기 →</button>
      </div>
      <div class="v3-about__img-col">
        <img :src="aboutSections[0].image" alt="" class="v3-about__img" loading="lazy" />
      </div>
    </section>

    <!-- ④ About 2 -->
    <section class="v3-about v3-about--alt">
      <div class="v3-about__img-col">
        <img :src="aboutSections[1].image" alt="" class="v3-about__img" loading="lazy" />
      </div>
      <div class="v3-about__text-col">
        <span class="v3-label">OUR METHOD</span>
        <h2 class="v3-h2">{{ aboutSections[1].title }}</h2>
        <p class="v3-body">{{ aboutSections[1].body }}</p>
      </div>
    </section>

    <!-- ⑤ Programs — 카드 그리드 -->
    <section class="v3-programs">
      <div class="v3-programs__head">
        <span class="v3-label">PROGRAMS</span>
        <h2 class="v3-h2">프로그램</h2>
        <p class="v3-body" style="max-width:480px">목표에 맞는 전문 프로그램으로 안전하고 효과적인 변화를 경험하세요.</p>
      </div>
      <div class="v3-programs__grid">
        <div v-for="p in programs" :key="p.title" class="v3-program-card">
          <div class="v3-program-card__thumb">
            <img :src="p.image" :alt="p.title" loading="lazy" />
          </div>
          <div class="v3-program-card__body">
            <h3 class="v3-program-card__name">{{ p.title }}</h3>
            <p class="v3-program-card__desc">{{ p.desc }}</p>
          </div>
        </div>
      </div>
      <div class="v3-programs__cta">
        <button type="button" class="v3-btn v3-btn--primary" @click="inquiryOpen = true">프로그램 상담 신청</button>
      </div>
    </section>

    <!-- ⑥ Pricing -->
    <section class="v3-pricing">
      <div class="v3-pricing__head">
        <span class="v3-label" style="color:#fff">PRICING</span>
        <h2 class="v3-h2 v3-h2--white">요금 안내</h2>
      </div>
      <div class="v3-pricing__cards">
        <div v-for="plan in plans" :key="plan.name" class="v3-plan" :class="{ 'v3-plan--featured': plan.featured }">
          <span v-if="plan.featured" class="v3-plan__badge">인기</span>
          <p class="v3-plan__name">{{ plan.name }}</p>
          <p class="v3-plan__price">{{ plan.price }}</p>
          <p class="v3-plan__period">{{ plan.period }}</p>
          <ul class="v3-plan__items">
            <li v-for="item in plan.items" :key="item">✓ {{ item }}</li>
          </ul>
          <button type="button" class="v3-btn" :class="plan.featured ? 'v3-btn--primary-dark' : 'v3-btn--outline-dark'" @click="inquiryOpen = true">시작하기</button>
        </div>
      </div>
    </section>

    <!-- ⑦ Reviews -->
    <section class="v3-reviews">
      <div class="v3-reviews__head">
        <span class="v3-label">REVIEWS</span>
        <h2 class="v3-h2">회원 후기</h2>
      </div>
      <div class="v3-reviews__grid">
        <blockquote v-for="r in reviews" :key="r.name" class="v3-review">
          <p class="v3-review__stars">★★★★★</p>
          <p class="v3-review__text">"{{ r.text }}"</p>
          <footer class="v3-review__author">{{ r.name }}</footer>
        </blockquote>
      </div>
    </section>

    <!-- ⑧ Contact -->
    <section id="contact" class="v3-contact">
      <div class="v3-contact__grid">
        <div class="v3-contact__info">
          <span class="v3-label">LOCATION</span>
          <h2 class="v3-h2">오시는 길 · 문의</h2>
          <div class="v3-contact__list">
            <div class="v3-contact__row">
              <span class="v3-contact__key">위치</span>
              <a :href="googleMapLinkUrl" target="_blank" rel="noopener" class="v3-contact__val">{{ storeAddress }}</a>
            </div>
            <div class="v3-contact__row">
              <span class="v3-contact__key">전화</span>
              <a :href="storePhoneHref" class="v3-contact__val">{{ storePhoneDisplay }}</a>
            </div>
            <div class="v3-contact__row">
              <span class="v3-contact__key">카카오</span>
              <a href="https://pf.kakao.com/_example" target="_blank" rel="noopener" class="v3-contact__val">1:1 문의하기</a>
            </div>
          </div>
          <button type="button" class="v3-btn v3-btn--primary" style="margin-top:2rem" @click="inquiryOpen = true">무료 상담 신청</button>
        </div>
        <div class="v3-contact__map">
          <iframe title="위치" :src="googleMapEmbedUrl" style="border:0;width:100%;height:100%" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" />
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="v3-footer">
      <p>© 2025 {{ storeName }} · 프리미엄 퍼스널 트레이닝</p>
      <div class="v3-footer__nav">
        <router-link to="/trainers">트레이너 소개</router-link>
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
  { value: '98%', label: '회원 만족도' }, { value: '1:1', label: '맞춤 트레이닝' },
];
const plans = [
  { name: '베이직', price: '30만원', period: '/ 10회', items: ['1:1 맞춤 트레이닝', '기초 체력 평가', '운동 루틴 설계'], featured: false },
  { name: '스탠다드', price: '55만원', period: '/ 20회', items: ['1:1 맞춤 트레이닝', '정밀 체성분 분석', '식단 가이드', '주 2~3회 권장'], featured: true },
  { name: '프리미엄', price: '90만원', period: '/ 36회', items: ['1:1 맞춤 트레이닝', '체성분 분석 월1회', '식단+생활 습관 코칭', '주 3회 권장'], featured: false },
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
/* BASE — light theme */
.v3-site { background: #fafaf8; color: #1a1a1a; font-family: 'Pretendard', sans-serif; }
.v3-label { font-size: .65rem; font-weight: 700; letter-spacing: .2em; color: #888; display: block; margin-bottom: .6rem; }
.v3-h2 { font-size: clamp(1.7rem, 3vw, 2.4rem); font-weight: 700; line-height: 1.2; margin-bottom: 1.25rem; }
.v3-h2--white { color: #fff; }
.v3-body { font-size: .95rem; color: #666; line-height: 1.85; }
.v3-h2 em { font-style: italic; font-weight: 400; color: #888; }

/* BUTTONS */
.v3-btn { display: inline-flex; align-items: center; justify-content: center; padding: .85rem 2rem; font-size: .88rem; font-weight: 600; border-radius: 2rem; cursor: pointer; text-decoration: none; transition: all .2s; border: none; }
.v3-btn--primary { background: #1a1a1a; color: #fff; }
.v3-btn--primary:hover { background: #333; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,.15); }
.v3-btn--outline { background: transparent; border: 1.5px solid #1a1a1a; color: #1a1a1a; }
.v3-btn--outline:hover { background: #1a1a1a; color: #fff; }
.v3-btn--link { background: none; padding: 0; font-size: .88rem; color: #1a1a1a; text-decoration: underline; text-underline-offset: 3px; }
.v3-btn--primary-dark { background: #fff; color: #1a1a1a; border: none; }
.v3-btn--primary-dark:hover { background: #f0f0f0; }
.v3-btn--outline-dark { background: transparent; border: 1.5px solid rgba(255,255,255,.4); color: #fff; }
.v3-btn--outline-dark:hover { background: rgba(255,255,255,.1); }

/* HERO */
.v3-hero { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; }
.v3-hero__media { position: relative; overflow: hidden; }
.v3-hero__img { width: 100%; height: 100%; object-fit: cover; display: block; }
.v3-hero__img-overlay { position: absolute; inset: 0; background: rgba(26,26,26,.25); }
.v3-hero__content { display: flex; flex-direction: column; justify-content: center; padding: 6rem 6vw; background: #fafaf8; }
.v3-hero__badge { display: inline-block; background: #f0ede6; color: #888; font-size: .68rem; font-weight: 600; letter-spacing: .15em; padding: .4rem 1rem; border-radius: 1rem; margin-bottom: 2rem; }
.v3-hero__title { font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 700; line-height: 1.15; margin-bottom: 1rem; }
.v3-hero__sub { font-size: .95rem; color: #888; margin-bottom: 2.5rem; max-width: 360px; line-height: 1.7; }
.v3-hero__btns { display: flex; gap: .75rem; flex-wrap: wrap; }

/* RIBBON */
.v3-ribbon { background: #1a1a1a; display: grid; grid-template-columns: repeat(4, 1fr); }
.v3-ribbon__item { padding: 2.5rem; text-align: center; border-right: 1px solid rgba(255,255,255,.06); }
.v3-ribbon__item:last-child { border-right: none; }
.v3-ribbon__val { display: block; font-size: clamp(1.8rem, 3vw, 2.8rem); font-weight: 800; color: #fff; }
.v3-ribbon__key { display: block; font-size: .7rem; color: rgba(255,255,255,.4); letter-spacing: .1em; margin-top: .4rem; }

/* ABOUT */
.v3-about { display: grid; grid-template-columns: 1fr 1fr; }
.v3-about--alt { background: #f3f0ea; }
.v3-about__img-col { overflow: hidden; }
.v3-about__img { width: 100%; height: 100%; object-fit: cover; display: block; min-height: 500px; transition: transform .7s ease; }
.v3-about__img-col:hover .v3-about__img { transform: scale(1.03); }
.v3-about__text-col { padding: 5rem 5vw; display: flex; flex-direction: column; justify-content: center; }

/* PROGRAMS */
.v3-programs { padding: 7rem 6vw; background: #fff; }
.v3-programs__head { max-width: 600px; margin-bottom: 3.5rem; }
.v3-programs__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 1100px; }
.v3-program-card { border-radius: 1rem; overflow: hidden; border: 1px solid #e8e8e8; background: #fff; transition: transform .25s, box-shadow .25s; }
.v3-program-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,.08); }
.v3-program-card__thumb { height: 200px; overflow: hidden; }
.v3-program-card__thumb img { width: 100%; height: 100%; object-fit: cover; }
.v3-program-card__body { padding: 1.25rem; }
.v3-program-card__name { font-size: 1rem; font-weight: 700; margin-bottom: .4rem; }
.v3-program-card__desc { font-size: .8rem; color: #888; line-height: 1.6; }
.v3-programs__cta { margin-top: 3rem; }

/* PRICING */
.v3-pricing { background: #1a1a1a; padding: 7rem 6vw; }
.v3-pricing__head { text-align: center; margin-bottom: 3.5rem; }
.v3-pricing__cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; max-width: 900px; margin: 0 auto; }
.v3-plan { background: #2a2a2a; border: 1px solid rgba(255,255,255,.08); border-radius: 1.25rem; padding: 2.5rem; position: relative; display: flex; flex-direction: column; }
.v3-plan--featured { background: #fff; border-color: #fff; }
.v3-plan--featured .v3-plan__name, .v3-plan--featured .v3-plan__price, .v3-plan--featured .v3-plan__period { color: #1a1a1a; }
.v3-plan--featured .v3-plan__items { color: #444; }
.v3-plan__badge { position: absolute; top: -1rem; left: 50%; transform: translateX(-50%); background: #c8973a; color: #fff; font-size: .65rem; font-weight: 700; letter-spacing: .1em; padding: .3rem .9rem; border-radius: 1rem; white-space: nowrap; }
.v3-plan__name { font-size: .8rem; font-weight: 600; color: rgba(255,255,255,.5); letter-spacing: .1em; margin-bottom: .75rem; }
.v3-plan__price { font-size: 2.2rem; font-weight: 800; color: #fff; }
.v3-plan__period { font-size: .8rem; color: rgba(255,255,255,.4); margin-bottom: 1.5rem; }
.v3-plan__items { list-style: none; padding: 0; margin: 0 0 2rem; flex: 1; display: flex; flex-direction: column; gap: .6rem; font-size: .83rem; color: rgba(255,255,255,.6); }
.v3-plan .v3-btn { width: 100%; justify-content: center; }

/* REVIEWS */
.v3-reviews { background: #fafaf8; padding: 7rem 6vw; }
.v3-reviews__head { margin-bottom: 3rem; }
.v3-reviews__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; max-width: 900px; }
.v3-review { background: #fff; border: 1px solid #e8e8e8; border-radius: 1rem; padding: 2rem; margin: 0; }
.v3-review__stars { color: #c8973a; font-size: .9rem; margin-bottom: .75rem; }
.v3-review__text { font-size: .9rem; color: #555; line-height: 1.7; margin-bottom: .75rem; }
.v3-review__author { font-size: .75rem; color: #aaa; }

/* CONTACT */
.v3-contact { background: #fff; padding: 7rem 6vw; border-top: 1px solid #e8e8e8; }
.v3-contact__grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 4rem; max-width: 1100px; margin: 0 auto; align-items: start; }
.v3-contact__list { display: flex; flex-direction: column; gap: 1.25rem; margin-top: 2rem; }
.v3-contact__row { display: grid; grid-template-columns: 60px 1fr; gap: 1rem; align-items: baseline; }
.v3-contact__key { font-size: .72rem; font-weight: 600; color: #aaa; letter-spacing: .1em; }
.v3-contact__val { font-size: .9rem; color: #333; text-decoration: none; transition: color .2s; }
.v3-contact__val:hover { color: #c8973a; }
.v3-contact__map { height: 420px; border-radius: 1rem; overflow: hidden; border: 1px solid #e8e8e8; }

/* FOOTER */
.v3-footer { background: #1a1a1a; padding: 1.75rem 6vw; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
.v3-footer p { font-size: .78rem; color: rgba(255,255,255,.3); margin: 0; }
.v3-footer__nav { display: flex; gap: 1.5rem; }
.v3-footer__nav a { font-size: .78rem; color: rgba(255,255,255,.4); text-decoration: none; }
.v3-footer__nav a:hover { color: rgba(255,255,255,.8); }

@media (max-width: 900px) {
  .v3-hero, .v3-about, .v3-about--alt, .v3-contact__grid { grid-template-columns: 1fr; }
  .v3-hero__content { order: -1; padding: 4rem 5vw; }
  .v3-hero__media { min-height: 50vh; }
  .v3-ribbon { grid-template-columns: repeat(2, 1fr); }
  .v3-programs__grid { grid-template-columns: repeat(2, 1fr); }
  .v3-pricing__cards { grid-template-columns: 1fr; }
  .v3-reviews__grid { grid-template-columns: 1fr; }
}
</style>
