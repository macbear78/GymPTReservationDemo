<template>
  <div class="v2-site">
    <!-- ① Hero — 강렬한 타이포그래피 풀스크린 -->
    <section class="v2-hero">
      <div class="v2-hero__bg" :style="{ backgroundImage: `url('${hero.image}')` }" />
      <div class="v2-hero__overlay" />
      <div class="v2-hero__inner">
        <div class="v2-hero__tag">부산 NO.1 퍼스널 트레이닝</div>
        <h1 class="v2-hero__title">
          <span class="v2-hero__title--line1">NO EXCUSES.</span>
          <span class="v2-hero__title--line2">JUST RESULTS.</span>
        </h1>
        <p class="v2-hero__sub">{{ hero.subtitle }}</p>
        <div class="v2-hero__cta">
          <button type="button" class="v2-cta-main" @click="inquiryOpen = true">
            무료 체험 신청
            <span class="v2-cta-main__arrow">→</span>
          </button>
          <router-link to="/reserve" class="v2-cta-secondary">PT 예약하기</router-link>
        </div>
      </div>
      <!-- 우측 하단 floating 숫자 -->
      <div class="v2-hero__floating-stats">
        <div v-for="s in stats.slice(0,2)" :key="s.label" class="v2-hero__stat">
          <span class="v2-hero__stat-num">{{ s.value }}</span>
          <span class="v2-hero__stat-label">{{ s.label }}</span>
        </div>
      </div>
    </section>

    <!-- ② 가로 슬로건 배너 (ticker) -->
    <div class="v2-ticker">
      <div class="v2-ticker__track">
        <span v-for="n in 6" :key="n">TRANSFORM YOUR BODY &nbsp;·&nbsp; PERSONAL TRAINING &nbsp;·&nbsp; 1:1 맞춤 트레이닝 &nbsp;·&nbsp; RESULTS GUARANTEED &nbsp;·&nbsp;</span>
      </div>
    </div>

    <!-- ③ Stats 풀 로우 -->
    <section class="v2-stats">
      <div v-for="s in stats" :key="s.label" class="v2-stats__cell">
        <span class="v2-stats__num">{{ s.value }}</span>
        <span class="v2-stats__label">{{ s.label }}</span>
      </div>
    </section>

    <!-- ④ About — 대형 레이아웃 -->
    <section class="v2-about">
      <div class="v2-about__left">
        <img :src="aboutSections[0].image" alt="" class="v2-about__img" loading="lazy" />
      </div>
      <div class="v2-about__right">
        <div class="v2-about__num">01</div>
        <h2 class="v2-about__title">{{ aboutSections[0].title }}</h2>
        <p class="v2-about__text">{{ aboutSections[0].body }}</p>
        <button type="button" class="v2-inline-btn" @click="inquiryOpen = true">상담 신청 →</button>
      </div>
    </section>

    <section class="v2-about v2-about--flip">
      <div class="v2-about__left">
        <img :src="aboutSections[1].image" alt="" class="v2-about__img" loading="lazy" />
      </div>
      <div class="v2-about__right">
        <div class="v2-about__num">02</div>
        <h2 class="v2-about__title">{{ aboutSections[1].title }}</h2>
        <p class="v2-about__text">{{ aboutSections[1].body }}</p>
      </div>
    </section>

    <!-- ⑤ Programs — 대담한 목록 스타일 -->
    <section class="v2-programs">
      <div class="v2-programs__header">
        <h2 class="v2-programs__headline">PROGRAMS</h2>
        <p class="v2-programs__sub">목표에 맞는 프로그램을 선택하세요</p>
      </div>
      <div class="v2-programs__list">
        <div v-for="(p, i) in programs" :key="p.title" class="v2-program-item">
          <span class="v2-program-item__num">0{{ i + 1 }}</span>
          <div class="v2-program-item__img">
            <img :src="p.image" :alt="p.title" loading="lazy" />
          </div>
          <div class="v2-program-item__info">
            <h3 class="v2-program-item__name">{{ p.title }}</h3>
            <p class="v2-program-item__desc">{{ p.desc }}</p>
          </div>
          <router-link to="/reserve" class="v2-program-item__link">예약 →</router-link>
        </div>
      </div>
    </section>

    <!-- ⑥ Reviews -->
    <section class="v2-reviews">
      <h2 class="v2-reviews__headline">REAL RESULTS</h2>
      <div class="v2-reviews__grid">
        <div v-for="r in reviews" :key="r.name" class="v2-review">
          <p class="v2-review__stars">★★★★★</p>
          <p class="v2-review__body">"{{ r.text }}"</p>
          <p class="v2-review__who">{{ r.name }}</p>
        </div>
      </div>
    </section>

    <!-- ⑦ CTA — 사선 배경 -->
    <section class="v2-cta-section">
      <div class="v2-cta-section__inner">
        <h2 class="v2-cta-section__title">오늘이 바로 그 날입니다</h2>
        <p class="v2-cta-section__sub">첫 상담 무료 · 부담 없이 문의하세요</p>
        <button type="button" class="v2-cta-main" @click="inquiryOpen = true">
          무료 상담 신청 <span class="v2-cta-main__arrow">→</span>
        </button>
      </div>
    </section>

    <!-- ⑧ Contact -->
    <section id="contact" class="v2-contact">
      <div class="v2-contact__inner">
        <h2 class="v2-contact__title">오시는 길 · 문의</h2>
        <div class="v2-contact__map">
          <iframe title="위치" :src="googleMapEmbedUrl" style="border:0;width:100%;height:100%" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" />
        </div>
        <div class="v2-contact__info">
          <div v-for="c in contactItems" :key="c.label" class="v2-contact__item">
            <span class="v2-contact__label">{{ c.label }}</span>
            <component :is="c.href ? 'a' : 'span'" :href="c.href" class="v2-contact__value" v-bind="c.href ? { target: '_blank', rel: 'noopener' } : {}">{{ c.value }}</component>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="v2-footer">
      <span>© 2025 {{ storeName }}</span>
      <div class="v2-footer__nav">
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
  { title: '다이어트 PT', desc: '체지방 감소와 건강한 습관을 위한 맞춤 프로그램', image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80' },
  { title: '근력 증가', desc: '기초부터 탄탄히, 안전한 근력 트레이닝', image: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=400&q=80' },
  { title: '체형 교정', desc: '자세와 움직임 개선으로 일상이 편해집니다', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80' },
  { title: 'HIIT · 유산소', desc: '짧고 강렬한 인터벌로 효율을 높이는 트레이닝', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
  { title: '재활 트레이닝', desc: '부상 후 몸 회복과 통증 해결 중심의 재활', image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400&q=80' },
  { title: '바디프로필 준비', desc: '목표 날짜에 맞춘 집중 컷팅 & 포즈 트레이닝', image: 'https://images.unsplash.com/photo-1606889464198-fcb18894cf50?w=400&q=80' },
];
const programs = ref(DEFAULT_PROGRAMS);

const storePhoneDisplay = computed(() => formatKoreanPhoneDisplayOrDash(storePhoneRaw.value));
const storePhoneHref = computed(() => { const d = String(storePhoneRaw.value || '').replace(/\D/g, ''); return d ? `tel:${d}` : 'tel:'; });
const googleMapQuery = computed(() => encodeURIComponent(storeAddress.value || '서울시 강남구'));
const googleMapEmbedUrl = computed(() => `https://maps.google.com/maps?q=${googleMapQuery.value}&z=16&output=embed`);
const googleMapLinkUrl = computed(() => `https://www.google.com/maps/search/?api=1&query=${googleMapQuery.value}`);
const contactItems = computed(() => [
  { label: '위치', value: storeAddress.value, href: googleMapLinkUrl.value },
  { label: '전화', value: storePhoneDisplay.value, href: storePhoneHref.value },
  { label: '카카오톡', value: '1:1 문의하기', href: 'https://pf.kakao.com/_example' },
]);

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
.v2-site { background: #0a0a0a; color: #fff; font-family: 'Pretendard', sans-serif; overflow-x: hidden; }

/* HERO */
.v2-hero { position: relative; height: 100vh; min-height: 720px; display: flex; align-items: center; }
.v2-hero__bg { position: absolute; inset: 0; background-size: cover; background-position: center; }
.v2-hero__overlay { position: absolute; inset: 0; background: linear-gradient(105deg, rgba(10,10,10,.92) 45%, rgba(10,10,10,.3) 100%); }
.v2-hero__inner { position: relative; z-index: 2; padding: 0 8vw; }
.v2-hero__tag { display: inline-block; background: #e5321b; color: #fff; font-size: .7rem; font-weight: 700; letter-spacing: .15em; padding: .35rem .85rem; border-radius: .25rem; margin-bottom: 2rem; }
.v2-hero__title { display: flex; flex-direction: column; margin-bottom: 1.5rem; }
.v2-hero__title--line1 { font-size: clamp(3.5rem, 9vw, 8rem); font-weight: 900; letter-spacing: -.03em; line-height: .95; color: #fff; }
.v2-hero__title--line2 { font-size: clamp(3.5rem, 9vw, 8rem); font-weight: 900; letter-spacing: -.03em; line-height: .95; color: #e5321b; }
.v2-hero__sub { font-size: 1rem; color: rgba(255,255,255,.55); margin-bottom: 2.5rem; max-width: 380px; line-height: 1.6; }
.v2-hero__cta { display: flex; gap: 1rem; flex-wrap: wrap; }
.v2-hero__floating-stats { position: absolute; right: 6vw; bottom: 5vh; z-index: 2; display: flex; gap: 2.5rem; }
.v2-hero__stat { text-align: center; }
.v2-hero__stat-num { display: block; font-size: 2.2rem; font-weight: 900; color: #e5321b; }
.v2-hero__stat-label { display: block; font-size: .65rem; color: rgba(255,255,255,.45); letter-spacing: .1em; }

/* CTA BUTTONS */
.v2-cta-main { display: inline-flex; align-items: center; gap: .6rem; background: #e5321b; color: #fff; border: none; padding: 1rem 2rem; font-size: .95rem; font-weight: 700; cursor: pointer; clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%); transition: background .2s, transform .2s; }
.v2-cta-main:hover { background: #ff4427; transform: translateX(4px); }
.v2-cta-main__arrow { font-size: 1.1rem; }
.v2-cta-secondary { display: inline-flex; align-items: center; padding: 1rem 2rem; border: 2px solid rgba(255,255,255,.3); color: rgba(255,255,255,.8); font-size: .95rem; font-weight: 600; text-decoration: none; transition: border-color .2s, color .2s; }
.v2-cta-secondary:hover { border-color: #fff; color: #fff; }
.v2-inline-btn { background: none; border: 2px solid #e5321b; color: #e5321b; padding: .7rem 1.5rem; font-size: .85rem; font-weight: 700; cursor: pointer; margin-top: 1.5rem; transition: background .2s, color .2s; }
.v2-inline-btn:hover { background: #e5321b; color: #fff; }

/* TICKER */
.v2-ticker { background: #e5321b; overflow: hidden; padding: .75rem 0; }
.v2-ticker__track { display: flex; white-space: nowrap; animation: v2-ticker 25s linear infinite; font-size: .72rem; font-weight: 700; letter-spacing: .12em; color: rgba(255,255,255,.85); }
@keyframes v2-ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* STATS */
.v2-stats { display: grid; grid-template-columns: repeat(4, 1fr); background: #111; }
.v2-stats__cell { padding: 3rem 2rem; text-align: center; border-right: 1px solid rgba(255,255,255,.06); }
.v2-stats__cell:last-child { border-right: none; }
.v2-stats__num { display: block; font-size: clamp(2.2rem, 4vw, 3.5rem); font-weight: 900; color: #fff; }
.v2-stats__label { display: block; font-size: .7rem; color: rgba(255,255,255,.4); letter-spacing: .12em; margin-top: .5rem; }

/* ABOUT */
.v2-about { display: grid; grid-template-columns: 1fr 1fr; min-height: 60vh; }
.v2-about--flip .v2-about__left { order: 2; }
.v2-about--flip .v2-about__right { order: 1; }
.v2-about__img { width: 100%; height: 100%; object-fit: cover; display: block; min-height: 420px; }
.v2-about__right { background: #0f0f0f; padding: 5rem 6vw; display: flex; flex-direction: column; justify-content: center; }
.v2-about__num { font-size: 5rem; font-weight: 900; color: rgba(229,50,27,.15); line-height: 1; margin-bottom: -.5rem; }
.v2-about__title { font-size: clamp(1.5rem, 2.8vw, 2.2rem); font-weight: 800; margin-bottom: 1.25rem; line-height: 1.2; }
.v2-about__text { font-size: .92rem; color: rgba(255,255,255,.55); line-height: 1.85; }

/* PROGRAMS */
.v2-programs { background: #0a0a0a; padding: 6rem 6vw; }
.v2-programs__header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,.08); padding-bottom: 1.5rem; }
.v2-programs__headline { font-size: clamp(2rem, 5vw, 4rem); font-weight: 900; letter-spacing: -.02em; }
.v2-programs__sub { color: rgba(255,255,255,.4); font-size: .85rem; }
.v2-programs__list { display: flex; flex-direction: column; }
.v2-program-item { display: grid; grid-template-columns: 60px 80px 1fr auto; align-items: center; gap: 2rem; padding: 1.5rem 0; border-bottom: 1px solid rgba(255,255,255,.06); transition: background .2s; }
.v2-program-item:hover { background: rgba(229,50,27,.04); }
.v2-program-item__num { font-size: .75rem; color: #e5321b; font-weight: 700; letter-spacing: .1em; }
.v2-program-item__img { width: 80px; height: 60px; border-radius: .35rem; overflow: hidden; }
.v2-program-item__img img { width: 100%; height: 100%; object-fit: cover; }
.v2-program-item__name { font-size: 1.05rem; font-weight: 700; margin-bottom: .25rem; }
.v2-program-item__desc { font-size: .8rem; color: rgba(255,255,255,.45); }
.v2-program-item__link { font-size: .8rem; font-weight: 700; color: #e5321b; text-decoration: none; white-space: nowrap; }

/* REVIEWS */
.v2-reviews { background: #111; padding: 6rem 6vw; }
.v2-reviews__headline { font-size: clamp(2rem, 5vw, 4rem); font-weight: 900; margin-bottom: 3rem; }
.v2-reviews__grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1px; background: rgba(255,255,255,.06); }
.v2-review { background: #111; padding: 2.5rem; }
.v2-review__stars { color: #e5321b; font-size: .9rem; margin-bottom: .75rem; }
.v2-review__body { font-size: .95rem; color: rgba(255,255,255,.75); line-height: 1.7; margin-bottom: 1rem; }
.v2-review__who { font-size: .75rem; color: rgba(255,255,255,.35); letter-spacing: .05em; }

/* CTA SECTION */
.v2-cta-section { background: #e5321b; clip-path: polygon(0 8%, 100% 0, 100% 92%, 0 100%); padding: 8rem 8vw; text-align: center; margin: -2rem 0; }
.v2-cta-section__title { font-size: clamp(2rem, 5vw, 4rem); font-weight: 900; color: #fff; margin-bottom: .75rem; }
.v2-cta-section__sub { font-size: 1rem; color: rgba(255,255,255,.75); margin-bottom: 2.5rem; }
.v2-cta-section .v2-cta-main { background: #fff; color: #e5321b; }
.v2-cta-section .v2-cta-main:hover { background: #f5f5f5; }

/* CONTACT */
.v2-contact { background: #0a0a0a; padding: 7rem 6vw 5rem; }
.v2-contact__inner { max-width: 960px; margin: 0 auto; }
.v2-contact__title { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 800; margin-bottom: 2.5rem; }
.v2-contact__map { height: 360px; border-radius: .5rem; overflow: hidden; margin-bottom: 2.5rem; border: 1px solid rgba(255,255,255,.08); }
.v2-contact__info { display: flex; gap: 3rem; flex-wrap: wrap; }
.v2-contact__item { display: flex; flex-direction: column; gap: .4rem; }
.v2-contact__label { font-size: .65rem; letter-spacing: .15em; color: #e5321b; font-weight: 700; }
.v2-contact__value { font-size: .9rem; color: rgba(255,255,255,.75); text-decoration: none; transition: color .2s; }
.v2-contact__value:hover { color: #fff; }

/* FOOTER */
.v2-footer { background: #050505; border-top: 1px solid rgba(255,255,255,.05); padding: 1.75rem 6vw; display: flex; justify-content: space-between; align-items: center; font-size: .78rem; color: rgba(255,255,255,.25); }
.v2-footer__nav { display: flex; gap: 1.5rem; }
.v2-footer__nav a { color: rgba(255,255,255,.35); text-decoration: none; }
.v2-footer__nav a:hover { color: rgba(255,255,255,.7); }

@media (max-width: 768px) {
  .v2-hero__floating-stats { display: none; }
  .v2-stats { grid-template-columns: repeat(2, 1fr); }
  .v2-about, .v2-about--flip { grid-template-columns: 1fr; }
  .v2-about--flip .v2-about__left, .v2-about--flip .v2-about__right { order: unset; }
  .v2-programs__header { flex-direction: column; align-items: flex-start; gap: .5rem; }
  .v2-program-item { grid-template-columns: 50px 1fr; }
  .v2-program-item__img, .v2-program-item__link { display: none; }
  .v2-reviews__grid { grid-template-columns: 1fr; }
  .v2-cta-section { clip-path: none; margin: 0; }
}
</style>
