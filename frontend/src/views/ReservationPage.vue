<template>
  <div class="max-w-2xl mx-auto px-4 py-8 sm:py-12">
    <header class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">PT 예약</h1>
      <p class="mt-2 text-slate-600 text-sm sm:text-base">
        날짜, 시간, PT 유형을 선택하고 예약자 정보를 입력해 주세요.
      </p>
    </header>
    <ReservationForm />
  </div>
</template>

<script setup>
import ReservationForm from '../components/ReservationForm.vue';
</script>
