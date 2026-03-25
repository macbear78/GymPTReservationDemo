<template>
  <div class="v5-site">
    <!-- ① Hero — 매거진 분할 레이아웃 -->
    <section class="v5-hero">
      <div class="v5-hero__left">
        <div class="v5-hero__issue">Issue No.01 · 2025</div>
        <h1 class="v5-hero__headline">
          <span class="v5-hero__hl-sm">지금 시작하세요</span>
          <span class="v5-hero__hl-lg">TRANSFORM</span>
          <span class="v5-hero__hl-lg v5-hero__hl-outline">YOUR BODY</span>
        </h1>
        <div class="v5-hero__divider" />
        <p class="v5-hero__desc">{{ hero.subtitle }}</p>
        <div class="v5-hero__ctas">
          <button type="button" class="v5-btn-primary" @click="inquiryOpen = true">무료 상담 신청</button>
          <router-link to="/reserve" class="v5-btn-text">PT 예약하기 →</router-link>
        </div>
        <!-- 스몰 스탯 -->
        <div class="v5-hero__mini-stats">
          <div v-for="s in stats.slice(0, 3)" :key="s.label" class="v5-hero__mini-stat">
            <b>{{ s.value }}</b>{{ s.label }}
          </div>
        </div>
      </div>
      <div class="v5-hero__right">
        <div class="v5-hero__img-wrap">
          <img :src="hero.image" alt="" class="v5-hero__img" />
          <div class="v5-hero__img-badge">
            <span class="v5-hero__img-badge-num">{{ stats[1].value }}</span>
            <span class="v5-hero__img-badge-txt">{{ stats[1].label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ② Marquee 배너 -->
    <div class="v5-marquee">
      <div class="v5-marquee__inner">
        <span v-for="n in 8" :key="n">PERSONAL TRAINING &nbsp;◆&nbsp; 1:1 맞춤 트레이닝 &nbsp;◆&nbsp; 체형 변화 &nbsp;◆&nbsp; </span>
      </div>
    </div>

    <!-- ③ About — magazine feature spread -->
    <section class="v5-feature">
      <div class="v5-feature__img">
        <img :src="aboutSections[0].image" alt="" loading="lazy" />
        <div class="v5-feature__caption">{{ aboutSections[0].title }}</div>
      </div>
      <div class="v5-feature__body">
        <span class="v5-rubric">FEATURE STORY</span>
        <h2 class="v5-feature__title">{{ aboutSections[0].title }}</h2>
        <p class="v5-feature__drop">{{ aboutSections[0].body.slice(0, 60) }}</p>
        <p class="v5-feature__body-text">{{ aboutSections[0].body }}</p>
        <button type="button" class="v5-btn-primary" @click="inquiryOpen = true">상담 신청하기</button>
      </div>
    </section>

    <section class="v5-feature v5-feature--alt">
      <div class="v5-feature__body">
        <span class="v5-rubric">METHOD</span>
        <h2 class="v5-feature__title">{{ aboutSections[1].title }}</h2>
        <p class="v5-feature__body-text">{{ aboutSections[1].body }}</p>
      </div>
      <div class="v5-feature__img">
        <img :src="aboutSections[1].image" alt="" loading="lazy" />
      </div>
    </section>

    <!-- ④ Programs — 잡지 그리드 -->
    <section class="v5-programs">
      <div class="v5-programs__hdr">
        <span class="v5-rubric">PROGRAMS</span>
        <h2 class="v5-programs__title">프로그램</h2>
        <div class="v5-programs__rule" />
      </div>
      <div class="v5-programs__bento">
        <div v-for="(p, i) in programs" :key="p.title" class="v5-prog-tile" :class="`v5-prog-tile--${i}`">
          <img :src="p.image" :alt="p.title" loading="lazy" />
          <div class="v5-prog-tile__info">
            <h3 class="v5-prog-tile__name">{{ p.title }}</h3>
            <p class="v5-prog-tile__desc">{{ p.desc }}</p>
          </div>
        </div>
      </div>
      <div style="text-align:center;margin-top:3rem">
        <button type="button" class="v5-btn-primary" @click="inquiryOpen = true">프로그램 상담</button>
      </div>
    </section>

    <!-- ⑤ Big number CTA -->
    <section class="v5-big-stat">
      <div class="v5-big-stat__num">98%</div>
      <div class="v5-big-stat__body">
        <h3 class="v5-big-stat__claim">회원 만족도</h3>
        <p class="v5-big-stat__text">500명 이상의 회원이 경험한 검증된 트레이닝 결과. 지금 첫 무료 상담으로 직접 확인하세요.</p>
        <button type="button" class="v5-btn-primary-inv" @click="inquiryOpen = true">무료 상담 신청</button>
      </div>
    </section>

    <!-- ⑥ Pricing -->
    <section class="v5-pricing">
      <div class="v5-pricing__hdr">
        <span class="v5-rubric">PRICING</span>
        <h2 class="v5-pricing__title">요금 안내</h2>
      </div>
      <div class="v5-pricing__table">
        <div v-for="plan in plans" :key="plan.name" class="v5-price-row" :class="{ 'v5-price-row--hot': plan.featured }">
          <div class="v5-price-row__name">
            <span v-if="plan.featured" class="v5-price-row__hot">POPULAR</span>
            {{ plan.name }}
          </div>
          <div class="v5-price-row__desc">{{ plan.items.join(' · ') }}</div>
          <div class="v5-price-row__amount">{{ plan.price }}</div>
          <div class="v5-price-row__period">{{ plan.period }}</div>
          <button type="button" class="v5-price-row__cta" @click="inquiryOpen = true">신청</button>
        </div>
      </div>
    </section>

    <!-- ⑦ Reviews -->
    <section class="v5-reviews">
      <div class="v5-reviews__hdr">
        <span class="v5-rubric">REVIEWS</span>
        <h2 class="v5-reviews__title">회원 후기</h2>
      </div>
      <div class="v5-reviews__cols">
        <div class="v5-reviews__col" v-for="(col, ci) in reviewCols" :key="ci">
          <div v-for="r in col" :key="r.name" class="v5-review-block">
            <p class="v5-review-block__stars">★★★★★</p>
            <p class="v5-review-block__text">"{{ r.text }}"</p>
            <p class="v5-review-block__name">{{ r.name }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ⑧ Contact -->
    <section id="contact" class="v5-contact">
      <div class="v5-contact__inner">
        <div>
          <span class="v5-rubric">LOCATION</span>
          <h2 class="v5-contact__title">오시는 길 · 문의</h2>
          <div class="v5-contact__list">
            <div class="v5-contact__item">
              <span class="v5-contact__key">위치</span>
              <a :href="googleMapLinkUrl" target="_blank" rel="noopener" class="v5-contact__val">{{ storeAddress }}</a>
            </div>
            <div class="v5-contact__item">
              <span class="v5-contact__key">전화</span>
              <a :href="storePhoneHref" class="v5-contact__val">{{ storePhoneDisplay }}</a>
            </div>
            <div class="v5-contact__item">
              <span class="v5-contact__key">카카오</span>
              <a href="https://pf.kakao.com/_example" target="_blank" rel="noopener" class="v5-contact__val">1:1 문의하기</a>
            </div>
          </div>
          <button type="button" class="v5-btn-primary" style="margin-top:2rem" @click="inquiryOpen = true">무료 상담 신청</button>
        </div>
        <div class="v5-contact__map">
          <iframe title="위치" :src="googleMapEmbedUrl" style="border:0;width:100%;height:100%" loading="lazy" allowfullscreen referrerpolicy="no-referrer-when-downgrade" />
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="v5-footer">
      <p>© 2025 {{ storeName }}</p>
      <div>
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
  { value: '7년+', label: '전문 경력' }, { value: '500명+', label: '누적 회원' },
  { value: '98%', label: '회원 만족도' }, { value: '1:1', label: '맞춤 PT' },
];
const plans = [
  { name: '베이직', price: '30만원', period: '10회', items: ['1:1 트레이닝', '체력 평가', '루틴 설계'], featured: false },
  { name: '스탠다드', price: '55만원', period: '20회', items: ['1:1 트레이닝', '체성분 분석', '식단 가이드', '주 2~3회'], featured: true },
  { name: '프리미엄', price: '90만원', period: '36회', items: ['1:1 트레이닝', '월 체성분 분석', '식단+생활코칭', '주 3회'], featured: false },
];
const reviews = [
  { name: '김○○ 회원', text: '3개월 만에 10kg 감량, 트레이너님 덕분에 습관이 완전히 바뀌었어요.' },
  { name: '이○○ 회원', text: '자세 교정 목적으로 왔는데 어깨 통증이 사라졌습니다. 강력 추천해요!' },
  { name: '박○○ 회원', text: '1:1 맞춤 관리가 확실히 다릅니다. 지루할 틈이 없어요.' },
  { name: '정○○ 회원', text: '헬스 초보였는데 기초부터 친절하게 알려주셔서 자신감이 생겼어요.' },
];
const reviewCols = computed(() => [reviews.slice(0, 2), reviews.slice(2)]);

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
.v5-site { background: #f8f6f0; color: #111; font-family: 'Pretendard', sans-serif; overflow-x: hidden; }
.v5-rubric { font-size: .62rem; font-weight: 700; letter-spacing: .22em; color: #aaa; display: block; margin-bottom: .6rem; text-transform: uppercase; }

/* BUTTONS */
.v5-btn-primary { display: inline-flex; align-items: center; justify-content: center; background: #111; color: #f8f6f0; border: none; padding: .9rem 2.2rem; font-size: .88rem; font-weight: 600; cursor: pointer; transition: background .2s, transform .2s; border-radius: .25rem; text-decoration: none; }
.v5-btn-primary:hover { background: #333; transform: translateY(-1px); }
.v5-btn-primary-inv { display: inline-flex; align-items: center; background: #f8f6f0; color: #111; border: none; padding: .9rem 2.2rem; font-size: .88rem; font-weight: 600; cursor: pointer; transition: background .2s; border-radius: .25rem; }
.v5-btn-primary-inv:hover { background: #fff; }
.v5-btn-text { font-size: .88rem; font-weight: 600; color: rgba(17,17,17,.5); text-decoration: none; display: inline-flex; align-items: center; transition: color .2s; }
.v5-btn-text:hover { color: #111; }

/* HERO */
.v5-hero { display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh; background: #111; color: #fff; }
.v5-hero__left { display: flex; flex-direction: column; justify-content: center; padding: 6rem 5vw 6rem 8vw; }
.v5-hero__issue { font-size: .65rem; letter-spacing: .2em; color: rgba(255,255,255,.35); margin-bottom: 2.5rem; }
.v5-hero__headline { display: flex; flex-direction: column; margin-bottom: 2rem; }
.v5-hero__hl-sm { font-size: 1rem; color: rgba(255,255,255,.5); font-weight: 400; margin-bottom: .5rem; }
.v5-hero__hl-lg { font-size: clamp(3rem, 7vw, 6rem); font-weight: 900; letter-spacing: -.03em; line-height: .95; color: #fff; }
.v5-hero__hl-outline { -webkit-text-stroke: 2px rgba(255,255,255,.6); color: transparent; }
.v5-hero__divider { width: 3rem; height: 2px; background: #c8973a; margin: 1.5rem 0; }
.v5-hero__desc { font-size: .92rem; color: rgba(255,255,255,.55); line-height: 1.7; max-width: 360px; margin-bottom: 2.5rem; }
.v5-hero__ctas { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; margin-bottom: 3rem; }
.v5-hero__ctas .v5-btn-primary { background: #c8973a; }
.v5-hero__ctas .v5-btn-primary:hover { background: #dba94a; }
.v5-hero__mini-stats { display: flex; gap: 2rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,.1); }
.v5-hero__mini-stat { font-size: .75rem; color: rgba(255,255,255,.5); display: flex; flex-direction: column; gap: .2rem; }
.v5-hero__mini-stat b { font-size: 1.4rem; font-weight: 800; color: #fff; }
.v5-hero__right { position: relative; overflow: hidden; }
.v5-hero__img-wrap { position: relative; height: 100%; }
.v5-hero__img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.8) saturate(.9); }
.v5-hero__img-badge { position: absolute; bottom: 3rem; left: 2rem; background: #c8973a; color: #fff; padding: 1.25rem 1.5rem; display: flex; flex-direction: column; align-items: center; }
.v5-hero__img-badge-num { font-size: 2rem; font-weight: 900; line-height: 1; }
.v5-hero__img-badge-txt { font-size: .65rem; letter-spacing: .1em; opacity: .85; }

/* MARQUEE */
.v5-marquee { background: #c8973a; overflow: hidden; padding: .6rem 0; }
.v5-marquee__inner { display: flex; white-space: nowrap; animation: v5-scroll 20s linear infinite; font-size: .7rem; font-weight: 700; letter-spacing: .1em; color: rgba(255,255,255,.9); }
@keyframes v5-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

/* FEATURE */
.v5-feature { display: grid; grid-template-columns: 1fr 1fr; background: #f8f6f0; }
.v5-feature--alt { background: #fff; }
.v5-feature__img { position: relative; overflow: hidden; min-height: 500px; }
.v5-feature__img img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .7s; }
.v5-feature__img:hover img { transform: scale(1.03); }
.v5-feature__caption { position: absolute; bottom: 0; left: 0; right: 0; padding: 1rem 1.25rem; background: rgba(17,17,17,.6); font-size: .7rem; letter-spacing: .1em; color: rgba(255,255,255,.75); }
.v5-feature__body { padding: 5rem 5vw; display: flex; flex-direction: column; justify-content: center; }
.v5-feature__title { font-size: clamp(1.6rem, 2.8vw, 2.2rem); font-weight: 700; line-height: 1.2; margin: .5rem 0 1rem; }
.v5-feature__drop { font-size: 1.05rem; font-weight: 600; color: #555; line-height: 1.5; margin-bottom: .75rem; }
.v5-feature__body-text { font-size: .88rem; color: #777; line-height: 1.85; margin-bottom: 2rem; }

/* PROGRAMS */
.v5-programs { background: #111; padding: 6rem 6vw; }
.v5-programs__hdr { margin-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,.08); padding-bottom: 1rem; display: flex; align-items: baseline; gap: 2rem; }
.v5-programs__title { font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 900; letter-spacing: -.02em; color: #fff; }
.v5-programs__rule { flex: 1; height: 1px; background: rgba(255,255,255,.08); }
.v5-programs__bento { display: grid; grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 300px 300px; gap: 4px; }
.v5-prog-tile { position: relative; overflow: hidden; }
.v5-prog-tile--0 { grid-row: span 2; }
.v5-prog-tile img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.55); transition: filter .4s, transform .4s; }
.v5-prog-tile:hover img { filter: brightness(.4); transform: scale(1.04); }
.v5-prog-tile__info { position: absolute; bottom: 0; left: 0; right: 0; padding: 1.25rem; background: linear-gradient(to top, rgba(0,0,0,.85), transparent); }
.v5-prog-tile__name { font-size: .95rem; font-weight: 700; color: #fff; margin-bottom: .25rem; }
.v5-prog-tile__desc { font-size: .72rem; color: rgba(255,255,255,.55); line-height: 1.4; }

/* BIG STAT */
.v5-big-stat { display: flex; align-items: center; gap: 4vw; padding: 6rem 8vw; background: #c8973a; }
.v5-big-stat__num { font-size: clamp(5rem, 14vw, 12rem); font-weight: 900; line-height: 1; color: rgba(255,255,255,.2); flex-shrink: 0; }
.v5-big-stat__claim { font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 800; color: #fff; margin-bottom: .75rem; }
.v5-big-stat__text { font-size: .92rem; color: rgba(255,255,255,.8); line-height: 1.7; max-width: 480px; margin-bottom: 2rem; }

/* PRICING */
.v5-pricing { background: #f8f6f0; padding: 6rem 6vw; }
.v5-pricing__hdr { margin-bottom: 2.5rem; }
.v5-pricing__title { font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; }
.v5-pricing__table { display: flex; flex-direction: column; border-top: 2px solid #111; }
.v5-price-row { display: grid; grid-template-columns: 140px 1fr 100px 80px 90px; align-items: center; gap: 1.5rem; padding: 1.5rem 0; border-bottom: 1px solid rgba(17,17,17,.1); transition: background .2s; }
.v5-price-row:hover { background: rgba(200,151,58,.06); }
.v5-price-row--hot { background: rgba(200,151,58,.08); }
.v5-price-row__name { font-size: 1rem; font-weight: 700; display: flex; flex-direction: column; gap: .3rem; }
.v5-price-row__hot { font-size: .55rem; font-weight: 700; background: #c8973a; color: #fff; padding: .2rem .55rem; border-radius: .25rem; letter-spacing: .1em; align-self: flex-start; }
.v5-price-row__desc { font-size: .78rem; color: #999; }
.v5-price-row__amount { font-size: 1.2rem; font-weight: 800; }
.v5-price-row__period { font-size: .78rem; color: #aaa; }
.v5-price-row__cta { background: #111; color: #fff; border: none; padding: .6rem 1.2rem; font-size: .8rem; font-weight: 600; cursor: pointer; border-radius: .25rem; transition: background .2s; }
.v5-price-row--hot .v5-price-row__cta { background: #c8973a; }
.v5-price-row__cta:hover { opacity: .85; }

/* REVIEWS */
.v5-reviews { background: #111; padding: 6rem 6vw; }
.v5-reviews__hdr { margin-bottom: 3rem; }
.v5-reviews__title { font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; color: #fff; }
.v5-reviews__cols { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; max-width: 900px; }
.v5-review-block { padding-bottom: 2rem; margin-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,.07); }
.v5-review-block:last-child { border-bottom: none; margin-bottom: 0; }
.v5-review-block__stars { color: #c8973a; font-size: .85rem; margin-bottom: .6rem; }
.v5-review-block__text { font-size: .9rem; color: rgba(255,255,255,.65); line-height: 1.7; margin-bottom: .6rem; }
.v5-review-block__name { font-size: .72rem; color: rgba(255,255,255,.3); }

/* CONTACT */
.v5-contact { background: #f8f6f0; padding: 6rem 6vw; border-top: 1px solid rgba(17,17,17,.1); }
.v5-contact__inner { display: grid; grid-template-columns: 1fr 1.5fr; gap: 4rem; max-width: 1100px; margin: 0 auto; align-items: start; }
.v5-contact__title { font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 700; margin: .5rem 0 2rem; }
.v5-contact__list { display: flex; flex-direction: column; gap: 1.25rem; }
.v5-contact__item { display: grid; grid-template-columns: 55px 1fr; gap: .5rem; align-items: baseline; }
.v5-contact__key { font-size: .68rem; font-weight: 600; color: #aaa; letter-spacing: .1em; }
.v5-contact__val { font-size: .9rem; color: #333; text-decoration: none; transition: color .2s; }
.v5-contact__val:hover { color: #c8973a; }
.v5-contact__map { height: 400px; border-radius: .5rem; overflow: hidden; border: 1px solid rgba(17,17,17,.1); }

/* FOOTER */
.v5-footer { background: #111; color: rgba(255,255,255,.35); padding: 1.5rem 6vw; display: flex; justify-content: space-between; align-items: center; font-size: .75rem; }
.v5-footer div { display: flex; gap: 1.5rem; }
.v5-footer a { color: rgba(255,255,255,.35); text-decoration: none; }
.v5-footer a:hover { color: rgba(255,255,255,.7); }

@media (max-width: 900px) {
  .v5-hero { grid-template-columns: 1fr; }
  .v5-hero__right { height: 50vh; }
  .v5-feature, .v5-feature--alt { grid-template-columns: 1fr; }
  .v5-programs__bento { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
  .v5-prog-tile--0 { grid-row: span 1; }
  .v5-big-stat { flex-direction: column; text-align: center; gap: 1rem; }
  .v5-pricing__table .v5-price-row { grid-template-columns: 1fr 1fr; }
  .v5-price-row__desc, .v5-price-row__period { display: none; }
  .v5-reviews__cols { grid-template-columns: 1fr; }
  .v5-contact__inner { grid-template-columns: 1fr; }
}
</style>
