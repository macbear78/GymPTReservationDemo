<template>
  <div class="v1-site">
    <!-- ① Hero — 풀스크린 에디토리얼 -->
    <section class="v1-hero">
      <div class="v1-hero__bg" :style="{ backgroundImage: `url('${hero.image}')` }" />
      <div class="v1-hero__overlay" />
      <div class="v1-hero__content">
        <p class="v1-hero__eyebrow">PREMIUM PERSONAL TRAINING</p>
        <h1 class="v1-hero__title">{{ hero.title }}<br />내일부터<br />달라집니다.</h1>
        <div class="v1-hero__actions">
          <button type="button" class="v1-btn v1-btn--ghost" @click="inquiryOpen = true">무료 상담</button>
          <router-link to="/reserve" class="v1-btn v1-btn--gold">PT 예약하기</router-link>
        </div>
      </div>
      <div class="v1-hero__scroll">
        <span>SCROLL</span>
        <div class="v1-hero__scroll-line" />
      </div>
    </section>

    <!-- ② Stats 배지 -->
    <section class="v1-stats">
      <div class="v1-stats__inner">
        <div v-for="s in stats" :key="s.label" class="v1-stats__item">
          <span class="v1-stats__num">{{ s.value }}</span>
          <span class="v1-stats__label">{{ s.label }}</span>
        </div>
      </div>
    </section>

    <!-- ③ About 1 -->
    <section class="v1-about">
      <div class="v1-about__img-wrap">
        <img :src="aboutSections[0].image" :alt="aboutSections[0].title" class="v1-about__img" loading="lazy" />
      </div>
      <div class="v1-about__body">
        <span class="v1-section-label">ABOUT</span>
        <h2 class="v1-about__title">{{ aboutSections[0].title }}</h2>
        <p class="v1-about__text">{{ aboutSections[0].body }}</p>
        <button type="button" class="v1-btn v1-btn--ghost-sm" @click="inquiryOpen = true">상담 신청하기 →</button>
      </div>
    </section>

    <!-- ④ About 2 (반전) -->
    <section class="v1-about v1-about--reverse">
      <div class="v1-about__img-wrap">
        <img :src="aboutSections[1].image" :alt="aboutSections[1].title" class="v1-about__img" loading="lazy" />
      </div>
      <div class="v1-about__body">
        <span class="v1-section-label">METHOD</span>
        <h2 class="v1-about__title">{{ aboutSections[1].title }}</h2>
        <p class="v1-about__text">{{ aboutSections[1].body }}</p>
      </div>
    </section>

    <!-- ⑤ Programs -->
    <section class="v1-programs">
      <div class="v1-programs__head">
        <span class="v1-section-label">PROGRAMS</span>
        <h2 class="v1-programs__title">프로그램</h2>
      </div>
      <div class="v1-programs__grid">
        <div v-for="p in programs" :key="p.title" class="v1-program-card">
          <div class="v1-program-card__img-wrap">
            <img :src="p.image" :alt="p.title" class="v1-program-card__img" loading="lazy" />
            <div class="v1-program-card__overlay">
              <h3 class="v1-program-card__name">{{ p.title }}</h3>
              <p class="v1-program-card__desc">{{ p.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑥ Review 슬라이더 -->
    <section class="v1-reviews">
      <div class="v1-reviews__inner">
        <span class="v1-section-label">REVIEWS</span>
        <h2 class="v1-reviews__title">회원 후기</h2>
        <div class="v1-reviews__track">
          <div v-for="r in reviews" :key="r.name" class="v1-review-card">
            <div class="v1-review-card__stars">★★★★★</div>
            <p class="v1-review-card__text">"{{ r.text }}"</p>
            <p class="v1-review-card__name">— {{ r.name }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑦ CTA 풀 배너 -->
    <section class="v1-cta">
      <h2 class="v1-cta__title">지금 바로 시작하세요</h2>
      <p class="v1-cta__sub">첫 상담은 무료입니다. 부담 없이 문의해 주세요.</p>
      <button type="button" class="v1-btn v1-btn--gold v1-btn--lg" @click="inquiryOpen = true">무료 상담 신청</button>
    </section>

    <!-- ⑧ Contact -->
    <section id="contact" class="v1-contact">
      <div class="v1-contact__inner">
        <span class="v1-section-label">LOCATION</span>
        <h2 class="v1-contact__title">오시는 길 · 문의</h2>
        <div class="v1-contact__map">
          <iframe title="위치" :src="googleMapEmbedUrl" style="border:0;width:100%;height:100%" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" />
        </div>
        <div class="v1-contact__info">
          <div class="v1-contact__item">
            <span class="v1-contact__icon">📍</span>
            <div>
              <p class="v1-contact__key">위치</p>
              <a :href="googleMapLinkUrl" target="_blank" rel="noopener" class="v1-contact__val">{{ storeAddress }}</a>
            </div>
          </div>
          <div class="v1-contact__item">
            <span class="v1-contact__icon">📞</span>
            <div>
              <p class="v1-contact__key">전화</p>
              <a :href="storePhoneHref" class="v1-contact__val">{{ storePhoneDisplay }}</a>
            </div>
          </div>
          <div class="v1-contact__item">
            <span class="v1-contact__icon">💬</span>
            <div>
              <p class="v1-contact__key">카카오톡</p>
              <a href="https://pf.kakao.com/_example" target="_blank" rel="noopener" class="v1-contact__val">1:1 문의하기</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="v1-footer">
      <p class="v1-footer__copy">© 2025 {{ storeName }}. 프리미엄 퍼스널 트레이닝</p>
      <div class="v1-footer__links">
        <router-link to="/trainers">트레이너 소개</router-link>
        <router-link to="/reserve">예약</router-link>
        <router-link to="/dashboard">내 PT · 예약</router-link>
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
  { value: '7년+', label: '전문 경력' },
  { value: '500명+', label: '누적 회원' },
  { value: '98%', label: '회원 만족도' },
  { value: '1:1', label: '맞춤 트레이닝' },
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
/* ===== BASE ===== */
.v1-site { background: #080808; color: #fff; font-family: 'Pretendard', sans-serif; }

/* ===== HERO ===== */
.v1-hero { position: relative; height: 100vh; min-height: 700px; display: flex; align-items: flex-end; overflow: hidden; }
.v1-hero__bg { position: absolute; inset: 0; background-size: cover; background-position: center; transform: scale(1.04); transition: transform 8s ease; }
.v1-hero:hover .v1-hero__bg { transform: scale(1); }
.v1-hero__overlay { position: absolute; inset: 0; background: linear-gradient(to top, #080808 20%, rgba(8,8,8,.6) 60%, rgba(8,8,8,.2) 100%); }
.v1-hero__content { position: relative; z-index: 2; padding: 0 6vw 8vh; max-width: 900px; }
.v1-hero__eyebrow { display: block; font-size: .7rem; letter-spacing: .25em; color: #c8973a; margin-bottom: 1.5rem; }
.v1-hero__title { font-size: clamp(2.8rem, 7vw, 6.5rem); font-weight: 800; line-height: 1.05; letter-spacing: -.02em; margin-bottom: 2.5rem; }
.v1-hero__actions { display: flex; gap: 1rem; flex-wrap: wrap; }
.v1-hero__scroll { position: absolute; right: 2.5rem; bottom: 3rem; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: .75rem; color: rgba(255,255,255,.4); font-size: .6rem; letter-spacing: .15em; }
.v1-hero__scroll-line { width: 1px; height: 60px; background: linear-gradient(to bottom, rgba(255,255,255,.4), transparent); }

/* ===== BUTTONS ===== */
.v1-btn { display: inline-flex; align-items: center; justify-content: center; padding: .9rem 2.2rem; font-size: .9rem; font-weight: 600; border-radius: .5rem; cursor: pointer; transition: all .25s; text-decoration: none; }
.v1-btn--ghost { background: transparent; border: 1.5px solid rgba(255,255,255,.6); color: #fff; }
.v1-btn--ghost:hover { background: rgba(255,255,255,.08); border-color: #fff; }
.v1-btn--ghost-sm { background: transparent; border: 1px solid rgba(255,255,255,.35); color: rgba(255,255,255,.75); font-size: .82rem; padding: .65rem 1.4rem; margin-top: 1.5rem; }
.v1-btn--ghost-sm:hover { border-color: #c8973a; color: #c8973a; }
.v1-btn--gold { background: #c8973a; color: #080808; border: 1.5px solid #c8973a; }
.v1-btn--gold:hover { background: #dba94a; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(200,151,58,.3); }
.v1-btn--lg { padding: 1.1rem 3rem; font-size: 1rem; }

/* ===== STATS ===== */
.v1-stats { background: #111; border-top: 1px solid rgba(255,255,255,.06); border-bottom: 1px solid rgba(255,255,255,.06); padding: 2.5rem 6vw; }
.v1-stats__inner { max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.v1-stats__item { text-align: center; }
.v1-stats__num { display: block; font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 800; color: #c8973a; letter-spacing: -.02em; }
.v1-stats__label { display: block; font-size: .75rem; color: rgba(255,255,255,.45); letter-spacing: .05em; margin-top: .35rem; }

/* ===== ABOUT ===== */
.v1-about { display: grid; grid-template-columns: 1fr 1fr; min-height: 70vh; }
.v1-about--reverse .v1-about__img-wrap { order: 2; }
.v1-about--reverse .v1-about__body { order: 1; }
.v1-about__img-wrap { overflow: hidden; }
.v1-about__img { width: 100%; height: 100%; object-fit: cover; transition: transform .8s ease; }
.v1-about__img-wrap:hover .v1-about__img { transform: scale(1.03); }
.v1-about__body { background: #111; display: flex; flex-direction: column; justify-content: center; padding: 6rem 5vw; }
.v1-about__title { font-size: clamp(1.6rem, 3vw, 2.5rem); font-weight: 700; line-height: 1.2; margin: .75rem 0 1.25rem; }
.v1-about__text { font-size: .95rem; color: rgba(255,255,255,.55); line-height: 1.85; }

/* ===== SECTION LABEL ===== */
.v1-section-label { font-size: .65rem; letter-spacing: .2em; color: #c8973a; font-weight: 600; }

/* ===== PROGRAMS ===== */
.v1-programs { background: #080808; padding: 7rem 6vw; }
.v1-programs__head { text-align: center; margin-bottom: 3.5rem; }
.v1-programs__title { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 700; margin-top: .5rem; }
.v1-programs__grid { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5px; }
.v1-program-card__img-wrap { position: relative; overflow: hidden; aspect-ratio: 4/5; }
.v1-program-card__img { width: 100%; height: 100%; object-fit: cover; transition: transform .6s ease; filter: brightness(.7); }
.v1-program-card:hover .v1-program-card__img { transform: scale(1.06); filter: brightness(.55); }
.v1-program-card__overlay { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 1.5rem; background: linear-gradient(to top, rgba(0,0,0,.8) 0%, transparent 60%); opacity: 0; transition: opacity .3s; }
.v1-program-card:hover .v1-program-card__overlay { opacity: 1; }
.v1-program-card__name { font-size: 1.1rem; font-weight: 700; color: #fff; }
.v1-program-card__desc { font-size: .78rem; color: rgba(255,255,255,.7); margin-top: .35rem; line-height: 1.5; }

/* ===== REVIEWS ===== */
.v1-reviews { background: #111; padding: 7rem 6vw; overflow: hidden; }
.v1-reviews__inner { max-width: 1100px; margin: 0 auto; }
.v1-reviews__title { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 700; margin: .5rem 0 3rem; }
.v1-reviews__track { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
.v1-review-card { background: #1a1a1a; border: 1px solid rgba(255,255,255,.06); border-radius: 1rem; padding: 2rem 1.5rem; }
.v1-review-card__stars { color: #c8973a; font-size: 1rem; margin-bottom: 1rem; letter-spacing: .1em; }
.v1-review-card__text { font-size: .88rem; color: rgba(255,255,255,.7); line-height: 1.7; }
.v1-review-card__name { font-size: .78rem; color: rgba(255,255,255,.35); margin-top: 1rem; }

/* ===== CTA ===== */
.v1-cta { background: #c8973a; padding: 6rem 6vw; text-align: center; }
.v1-cta__title { font-size: clamp(2rem, 4vw, 3.2rem); font-weight: 800; color: #080808; margin-bottom: .75rem; }
.v1-cta__sub { font-size: 1rem; color: rgba(8,8,8,.6); margin-bottom: 2.5rem; }
.v1-cta .v1-btn--gold { background: #080808; color: #c8973a; border-color: #080808; }
.v1-cta .v1-btn--gold:hover { background: #1a1a1a; }

/* ===== CONTACT ===== */
.v1-contact { background: #080808; padding: 7rem 6vw; border-top: 1px solid rgba(255,255,255,.06); }
.v1-contact__inner { max-width: 900px; margin: 0 auto; }
.v1-contact__title { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 700; margin: .5rem 0 2.5rem; }
.v1-contact__map { width: 100%; height: 380px; border-radius: 1rem; overflow: hidden; margin-bottom: 2.5rem; border: 1px solid rgba(255,255,255,.08); }
.v1-contact__info { display: flex; gap: 2.5rem; flex-wrap: wrap; }
.v1-contact__item { display: flex; align-items: flex-start; gap: 1rem; }
.v1-contact__icon { font-size: 1.3rem; margin-top: .1rem; }
.v1-contact__key { font-size: .7rem; letter-spacing: .1em; color: rgba(255,255,255,.4); margin-bottom: .3rem; }
.v1-contact__val { font-size: .9rem; color: rgba(255,255,255,.8); text-decoration: none; transition: color .2s; }
.v1-contact__val:hover { color: #c8973a; }

/* ===== FOOTER ===== */
.v1-footer { background: #080808; border-top: 1px solid rgba(255,255,255,.06); padding: 2rem 6vw; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
.v1-footer__copy { font-size: .78rem; color: rgba(255,255,255,.25); }
.v1-footer__links { display: flex; gap: 1.5rem; }
.v1-footer__links a { font-size: .78rem; color: rgba(255,255,255,.35); text-decoration: none; transition: color .2s; }
.v1-footer__links a:hover { color: #c8973a; }

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .v1-about { grid-template-columns: 1fr; }
  .v1-about--reverse .v1-about__img-wrap { order: 0; }
  .v1-about--reverse .v1-about__body { order: 0; }
  .v1-stats__inner { grid-template-columns: repeat(2, 1fr); }
  .v1-programs__grid { grid-template-columns: repeat(2, 1fr); }
  .v1-reviews__track { grid-template-columns: 1fr; }
  .v1-hero__scroll { display: none; }
}
</style>
