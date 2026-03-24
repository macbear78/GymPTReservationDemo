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
            :disabled="!password || loading"
            class="w-full py-3 rounded-xl font-semibold bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 transition"
            @click="onLogin"
          >
            {{ loading ? '로그인 중…' : '로그인' }}
          </button>
        </div>
      </div>

      <p class="text-center mt-4 text-xs text-slate-400">
        기본 비밀번호: <code class="bg-slate-100 px-1.5 py-0.5 rounded">admin1234</code>
        (환경변수 <code class="bg-slate-100 px-1.5 py-0.5 rounded">ADMIN_PASSWORD</code> 로 변경)
      </p>
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
