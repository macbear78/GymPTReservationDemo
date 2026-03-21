<template>
  <div class="max-w-xl mx-auto px-4 py-12">
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="bg-primary-500 text-white px-6 py-8 text-center">
        <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold">Reservation confirmed</h1>
        <p class="text-primary-100 mt-1">Your PT session has been booked.</p>
      </div>
      <div class="p-6 space-y-4">
        <template v-if="reservation">
          <div class="grid grid-cols-2 gap-3 text-sm">
            <span class="text-slate-500">Name</span>
            <span class="font-medium">{{ reservation.name }}</span>
            <span class="text-slate-500">Phone</span>
            <span class="font-medium">{{ reservation.phone }}</span>
            <span class="text-slate-500">Trainer</span>
            <span class="font-medium">{{ reservation.trainer }}</span>
            <span class="text-slate-500">Date</span>
            <span class="font-medium">{{ reservation.date }}</span>
            <span class="text-slate-500">Time</span>
            <span class="font-medium">{{ reservation.time }}</span>
            <span class="text-slate-500">PT type</span>
            <span class="font-medium">{{ reservation.pt_type }}</span>
            <span class="text-slate-500">Status</span>
            <span class="font-medium">{{ reservation.status }}</span>
          </div>
        </template>
        <p v-else class="text-slate-500">No reservation data. <router-link to="/reserve" class="text-primary-600 hover:underline">Book a session</router-link>.</p>
      </div>
      <div class="px-6 pb-6 flex gap-3">
        <router-link
          to="/reserve"
          class="flex-1 py-3 rounded-xl font-medium text-center border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
        >
          Book another
        </router-link>
        <router-link
          to="/"
          class="flex-1 py-3 rounded-xl font-medium text-center bg-primary-500 text-white hover:bg-primary-600 transition"
        >
          Back to home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const reservation = computed(() => history.state?.reservation ?? null);
</script>
