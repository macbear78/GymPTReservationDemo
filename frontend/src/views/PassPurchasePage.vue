<template>
  <div class="max-w-2xl mx-auto px-4 py-8 sm:py-12">
    <header class="mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">PT 패스 구매</h1>
      <p class="mt-2 text-slate-600 text-sm sm:text-base">원하는 패스를 선택하고 결제하세요.</p>
    </header>

    <!-- Step 1: 전화번호 확인 -->
    <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
      <h2 class="font-semibold text-slate-800 mb-4">회원 확인</h2>
      <div v-if="!user">
        <div class="flex gap-3">
          <input
            :value="phone"
            type="tel"
            inputmode="numeric"
            autocomplete="tel"
            placeholder="010-0000-0000"
            class="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-slate-800"
            @input="onPhoneInput"
            @keyup.enter="lookupMember"
          />
          <button
            type="button"
            :disabled="!phone || lookingUp"
            class="px-5 py-3 rounded-xl font-semibold bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 transition shrink-0"
            @click="lookupMember"
          >{{ lookingUp ? '…' : '확인' }}</button>
        </div>
        <p v-if="phoneError" class="mt-2 text-red-500 text-sm">{{ phoneError }}</p>
      </div>
      <div v-else class="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
        <div class="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shrink-0">
          {{ user.name.charAt(0) }}
        </div>
        <div class="flex-1">
          <p class="font-semibold text-emerald-800">{{ user.name }}</p>
          <p class="text-emerald-600 text-xs">{{ user.phone }}</p>
        </div>
        <button type="button" class="text-emerald-500 text-xs hover:text-emerald-700" @click="user = null">변경</button>
      </div>
    </section>

    <!-- Step 2: 상품 선택 -->
    <section v-if="user" class="mb-6">
      <h2 class="font-semibold text-slate-800 mb-4">패스 선택</h2>
      <div v-if="loadingProducts" class="text-center text-slate-400 py-6">상품 로딩 중…</div>
      <div v-else class="space-y-3">
        <button
          v-for="p in products"
          :key="p.productId"
          type="button"
          :class="[
            'w-full flex items-center justify-between p-4 rounded-2xl border-2 transition text-left',
            selectedProduct?.productId === p.productId
              ? 'border-primary-400 bg-primary-50'
              : 'border-slate-200 hover:border-slate-300 bg-white',
          ]"
          @click="selectedProduct = p"
        >
          <div>
            <p class="font-semibold text-slate-800">{{ p.name }}</p>
            <p class="text-slate-500 text-sm">{{ p.sessions }}회 · 유효기간 {{ p.validDays }}일</p>
          </div>
          <div class="text-right shrink-0">
            <p class="font-bold text-slate-800 text-lg">{{ p.price.toLocaleString() }}원</p>
            <p class="text-slate-400 text-xs">회당 {{ Math.round(p.price / p.sessions).toLocaleString() }}원</p>
          </div>
        </button>
      </div>
    </section>

    <!-- 결제 버튼 -->
    <div v-if="user && selectedProduct">
      <div class="rounded-2xl border border-primary-200 bg-primary-50/50 p-4 mb-4">
        <dl class="space-y-1.5 text-sm">
          <div class="flex justify-between">
            <dt class="text-slate-600">상품</dt>
            <dd class="font-medium">{{ selectedProduct.name }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-slate-600">결제 금액</dt>
            <dd class="font-bold text-primary-700 text-base">{{ selectedProduct.price.toLocaleString() }}원</dd>
          </div>
        </dl>
      </div>

      <p v-if="payError" class="text-red-600 text-sm mb-3">{{ payError }}</p>

      <button
        type="button"
        :disabled="paying"
        class="w-full py-4 rounded-xl font-bold text-lg bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 transition shadow-lg shadow-primary-500/25"
        @click="onPay"
      >
        {{ paying ? '결제 준비 중…' : `${selectedProduct.price.toLocaleString()}원 결제하기` }}
      </button>

      <p class="text-center text-xs text-slate-400 mt-3">토스페이먼츠 테스트 결제 · 실제 청구 없음</p>
    </div>

    <!-- 결제 위젯 컨테이너 (Toss SDK가 마운트) -->
    <div id="payment-widget" class="mt-4"></div>
    <div id="agreement" class="mt-2"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { lookupUser, getPassProducts, preparePayment } from '../api';
import { formatKoreanPhoneAsYouType } from '../utils/phoneFormat.js';

const STORE_ID = 'store_default';

function onPhoneInput(e) {
  phone.value = formatKoreanPhoneAsYouType(e.target.value);
}

/** 결제위젯 클라이언트 키(test_gck_). test_ck_(API개별) / test_gsk_(시크릿) 넣으면 SDK 오류 납니다. */
function resolveTossWidgetClientKey() {
  const raw = (import.meta.env.VITE_TOSS_CLIENT_KEY || '').trim();
  const fallback = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
  if (!raw) return fallback;
  if (raw.startsWith('test_gsk_') || raw.startsWith('live_gsk_')) {
    console.error('[Toss] VITE_TOSS_CLIENT_KEY에 시크릿 키(…gsk…)가 들어갔습니다. 클라이언트 키(test_gck_…)만 사용하세요.');
    return fallback;
  }
  if (raw.startsWith('test_sk_') || raw.startsWith('live_sk_')) {
    console.error('[Toss] VITE_TOSS_CLIENT_KEY에 API 시크릿이 들어갔습니다. 결제위젯 클라이언트 키(test_gck_…)를 넣으세요.');
    return fallback;
  }
  return raw;
}

const CLIENT_KEY = resolveTossWidgetClientKey();

const router = useRouter();

const phone          = ref('');
const user           = ref(null);
const lookingUp      = ref(false);
const phoneError     = ref('');
const products       = ref([]);
const loadingProducts = ref(false);
const selectedProduct = ref(null);
const paying         = ref(false);
const payError       = ref('');
let   paymentWidget  = null;

async function lookupMember() {
  phoneError.value = '';
  lookingUp.value = true;
  try {
    user.value = await lookupUser(STORE_ID, phone.value.replace(/[\s\-\.]/g, ''));
  } catch (e) {
    phoneError.value = e.needsName
      ? '등록되지 않은 번호입니다. /reserve 에서 먼저 예약해주세요.'
      : (e.message || '조회 실패');
  } finally {
    lookingUp.value = false;
  }
}

async function loadProducts() {
  loadingProducts.value = true;
  try {
    const data = await getPassProducts(STORE_ID);
    products.value = data.products || [];
  } finally {
    loadingProducts.value = false;
  }
}

async function initTossWidget(orderId, amount, orderName) {
  // Toss SDK 동적 로드
  if (!window.TossPayments) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://js.tosspayments.com/v2/standard';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  const tossPayments = window.TossPayments(CLIENT_KEY);
  paymentWidget = tossPayments.widgets({ customerKey: user.value.userId });

  await paymentWidget.setAmount({ currency: 'KRW', value: amount });
  await Promise.all([
    paymentWidget.renderPaymentMethods({ selector: '#payment-widget', variantKey: 'DEFAULT' }),
    paymentWidget.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' }),
  ]);

  return paymentWidget;
}

async function onPay() {
  paying.value = true;
  payError.value = '';
  try {
    const { orderId, amount, orderName } = await preparePayment(STORE_ID, {
      userId: user.value.userId,
      productId: selectedProduct.value.productId,
    });

    const widget = await initTossWidget(orderId, amount, orderName);

    const origin = window.location.origin;
    await widget.requestPayment({
      orderId,
      orderName,
      successUrl: `${origin}/payment/success?userId=${user.value.userId}&storeId=${STORE_ID}`,
      failUrl: `${origin}/payment/fail`,
      customerEmail: '',
      customerName: user.value.name,
      customerMobilePhone: user.value.phone,
    });
  } catch (e) {
    payError.value = e.message || '결제에 실패했습니다.';
  } finally {
    paying.value = false;
  }
}

onMounted(loadProducts);
</script>
