<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4" @click.self="$emit('update:modelValue', false)">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('update:modelValue', false)" />

        <!-- Panel -->
        <div class="relative w-full sm:max-w-lg bg-zinc-900 border border-zinc-700 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
            <div>
              <h2 class="text-lg font-bold text-white">무료 상담 신청</h2>
              <p class="text-sm text-zinc-400 mt-0.5">남겨주신 내용을 확인 후 연락드리겠습니다.</p>
            </div>
            <button type="button" class="w-9 h-9 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition text-xl" @click="$emit('update:modelValue', false)">×</button>
          </div>

          <!-- Form -->
          <form class="px-6 py-5 space-y-4" @submit.prevent="submit">
            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-1.5">이름 <span class="text-amber-400">*</span></label>
              <input
                v-model="form.name"
                type="text"
                placeholder="홍길동"
                maxlength="30"
                class="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-1.5">연락처 <span class="text-zinc-500 font-normal">(선택)</span></label>
              <input
                :value="form.phone"
                type="tel"
                placeholder="010-0000-0000"
                class="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                @input="form.phone = formatPhone($event.target.value)"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-zinc-300 mb-1.5">문의 내용 <span class="text-amber-400">*</span></label>
              <textarea
                v-model="form.message"
                rows="4"
                placeholder="궁금한 점이나 원하시는 트레이닝 목표를 자유롭게 적어주세요."
                maxlength="500"
                class="w-full px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-none"
              />
              <p class="text-right text-xs text-zinc-500 mt-1">{{ form.message.length }}/500</p>
            </div>

            <p v-if="error" class="text-red-400 text-sm">{{ error }}</p>

            <button
              type="submit"
              :disabled="submitting || !form.name.trim() || !form.message.trim()"
              class="w-full py-3 rounded-xl font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
            >
              {{ submitting ? '전송 중…' : '상담 신청하기' }}
            </button>
          </form>
        </div>
      </div>
    </Transition>

    <!-- 성공 토스트 -->
    <Transition name="toast-slide">
      <div v-if="success" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[400] bg-emerald-500 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
        문의가 접수되었습니다. 곧 연락드리겠습니다!
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import { createInquiry } from '../api';

const STORE_ID = 'store_default';

const props = defineProps({ modelValue: Boolean });
const emit  = defineEmits(['update:modelValue']);

const form = ref({ name: '', phone: '', message: '' });
const submitting = ref(false);
const error      = ref('');
const success    = ref(false);

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.startsWith('02')) {
    if (digits.length <= 6)  return digits.replace(/(\d{2})(\d{0,4})/, '$1-$2').replace(/-$/, '');
    if (digits.length <= 9)  return digits.replace(/(\d{2})(\d{3,4})(\d{0,4})/, '$1-$2-$3').replace(/-$/, '');
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  if (digits.length <= 7)  return digits.replace(/(\d{3})(\d{0,4})/, '$1-$2').replace(/-$/, '');
  if (digits.length <= 10) return digits.replace(/(\d{3})(\d{3,4})(\d{0,4})/, '$1-$2-$3').replace(/-$/, '');
  return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
}

async function submit() {
  if (submitting.value) return;
  error.value = '';
  submitting.value = true;
  try {
    await createInquiry(STORE_ID, {
      name:    form.value.name.trim(),
      phone:   form.value.phone.trim(),
      message: form.value.message.trim(),
    });
    emit('update:modelValue', false);
    form.value = { name: '', phone: '', message: '' };
    success.value = true;
    setTimeout(() => { success.value = false; }, 4000);
  } catch (e) {
    error.value = e.message || '문의 전송에 실패했습니다. 다시 시도해주세요.';
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .relative,
.modal-fade-leave-active .relative {
  transition: transform 0.25s ease;
}
.modal-fade-enter-from .relative,
.modal-fade-leave-to .relative {
  transform: translateY(24px);
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, 12px);
}
</style>
