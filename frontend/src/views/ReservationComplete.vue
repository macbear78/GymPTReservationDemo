<template>
  <div class="max-w-xl mx-auto px-4 py-12">
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="bg-primary-500 text-white px-6 py-8 text-center">
        <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold">예약이 완료되었습니다</h1>
        <p class="text-primary-100 mt-1">PT 세션이 예약되었습니다.</p>
      </div>
      <div class="p-6 space-y-4">
        <template v-if="reservation">
          <div class="grid grid-cols-2 gap-3 text-sm">
            <span class="text-slate-500">예약자</span>
            <span class="font-medium">{{ reservation.name }}</span>
            <span class="text-slate-500">연락처</span>
            <span class="font-medium">{{ reservation.phone }}</span>
            <template v-if="reservation.program">
              <span class="text-slate-500">프로그램</span>
              <span class="font-medium">{{ reservation.program }}</span>
            </template>
            <template v-if="reservation.trainer">
              <span class="text-slate-500">트레이너</span>
              <span class="font-medium">{{ reservation.trainer }}</span>
            </template>
            <span class="text-slate-500">날짜</span>
            <span class="font-medium">{{ formatDate(reservation.date) }}</span>
            <span class="text-slate-500">시간</span>
            <span class="font-medium">{{ reservation.time }}</span>
            <span class="text-slate-500">상태</span>
            <span class="font-medium">{{ statusLabel(reservation.status) }}</span>
          </div>
        </template>
        <p v-else class="text-slate-500">예약 정보가 없습니다. <router-link to="/reserve" class="text-primary-600 hover:underline">예약하기</router-link></p>
      </div>
      <div class="px-6 pb-6 flex gap-3">
        <router-link
          to="/dashboard"
          class="flex-1 py-3 rounded-xl font-medium text-center border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
        >
          내 PT · 예약 확인
        </router-link>
        <router-link
          to="/"
          class="flex-1 py-3 rounded-xl font-medium text-center bg-primary-500 text-white hover:bg-primary-600 transition"
        >
          홈으로
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const reservation = computed(() => history.state?.reservation ?? null);

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${y}년 ${m}월 ${d}일`;
}

function statusLabel(status) {
  const map = { PENDING: '예약 대기', CONFIRMED: '확정', CANCELLED: '취소됨', COMPLETED: '완료' };
  return map[status] || status || '';
}
</script>
