<template>
  <div class="max-w-lg mx-auto px-4 py-16 text-center">
    <div v-if="loading" class="text-slate-400">결제 확인 중…</div>

    <template v-else-if="result">
      <div class="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
        <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-slate-800 mb-2">결제 완료!</h1>
      <p class="text-slate-600 mb-8">{{ result.productName }}이 발급되었습니다.</p>

      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-left mb-8">
        <dl class="space-y-2 text-sm">
          <div class="flex justify-between">
            <dt class="text-slate-500">상품</dt>
            <dd class="font-medium">{{ result.productName }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-slate-500">총 세션</dt>
            <dd class="font-medium text-primary-700">{{ result.sessions }}회</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-slate-500">만료일</dt>
            <dd class="font-medium">{{ result.expiryDate }}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-slate-500">결제 금액</dt>
            <dd class="font-bold">{{ result.amount?.toLocaleString() }}원</dd>
          </div>
        </dl>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <router-link
          to="/reserve"
          class="flex-1 py-3 rounded-xl font-semibold bg-primary-500 text-white hover:bg-primary-600 transition text-center"
        >PT 예약하기</router-link>
        <router-link
          to="/dashboard"
          class="flex-1 py-3 rounded-xl font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition text-center"
        >내 PT · 예약</router-link>
      </div>
    </template>

    <template v-else-if="error">
      <div class="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
        <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-slate-800 mb-2">결제 실패</h1>
      <p class="text-red-600 mb-6">{{ error }}</p>
      <router-link to="/passes" class="px-6 py-3 rounded-xl font-semibold bg-primary-500 text-white hover:bg-primary-600 transition">
        다시 시도
      </router-link>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { confirmPayment } from '../api';

const route   = useRoute();
const loading = ref(true);
const result  = ref(null);
const error   = ref('');

onMounted(async () => {
  const { paymentKey, orderId, amount, userId, storeId } = route.query;
  if (!paymentKey || !orderId || !amount || !userId) {
    error.value = '결제 정보가 올바르지 않습니다.';
    loading.value = false;
    return;
  }

  try {
    result.value = await confirmPayment(storeId || 'store_default', {
      paymentKey, orderId, amount: Number(amount), userId,
    });
  } catch (e) {
    error.value = e.message || '결제 확인에 실패했습니다.';
  } finally {
    loading.value = false;
  }
});
</script>
