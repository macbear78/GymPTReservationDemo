<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <div class="inline-flex w-14 h-14 rounded-2xl bg-primary-500 items-center justify-center mb-4 shadow-lg shadow-primary-500/30">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-slate-800">관리자 로그인</h1>
        <p class="mt-1 text-slate-500 text-sm">PT 스튜디오 관리자 페이지</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">비밀번호</label>
            <input
              v-model="password"
              type="password"
              placeholder="관리자 비밀번호"
              class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-slate-800 placeholder-slate-400"
              @keyup.enter="onLogin"
            />
          </div>

          <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>

          <button
            type="button"
            class="w-full py-3 rounded-xl font-semibold transition demo-login-btn"
            :disabled="loading"
            @click="demoLogin"
          >
            🎯 데모 계정으로 바로 로그인
          </button>

          <button
            type="button"
            :disabled="!password || loading"
            class="w-full py-3 rounded-xl font-semibold bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 transition"
            @click="onLogin"
          >
            {{ loading ? '로그인 중…' : '로그인' }}
          </button>
        </div>
      </div>

      <div class="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-700 text-sm text-center">
        💡 데모 비밀번호: admin1234
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { adminLogin } from '../api';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const route = useRoute();
const { setToken } = useAuth();

const password = ref('');
const loading = ref(false);
const error = ref('');

function demoLogin() {
  password.value = 'admin1234';
  onLogin();
}

async function onLogin() {
  if (!password.value) return;
  error.value = '';
  loading.value = true;
  try {
    const { token } = await adminLogin(password.value);
    setToken(token);
    const redirect = route.query.redirect || '/admin';
    router.push(redirect);
  } catch (e) {
    error.value = e.message || '로그인에 실패했습니다.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.demo-login-btn {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.demo-login-btn:hover:not(:disabled) {
  background: #e2e8f0;
}

.demo-login-btn:disabled {
  opacity: 0.5;
}
</style>
