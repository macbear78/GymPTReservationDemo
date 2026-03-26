<template>
  <div class="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">

      <!-- 로고 -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center gap-2 text-slate-300 hover:text-white transition">
          <div class="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>
            </svg>
          </div>
          <span class="font-bold text-xl tracking-tight">Gym PT</span>
        </router-link>
        <p class="mt-4 text-slate-500 text-sm">
          {{ tab === 'login' ? '회원 로그인' : '신규 회원가입' }}
        </p>
      </div>

      <!-- 데모 체험 -->
      <button
        type="button"
        class="demo-btn w-full text-left"
        :disabled="submitting"
        @click="demoLogin"
      >
        <span class="demo-btn__icon">🎯</span>
        <span class="demo-btn__body">
          <strong class="demo-btn__title">데모 계정으로 체험하기</strong>
          <span class="demo-btn__sub">전화: 010-0000-0001 / PW: demo1234</span>
        </span>
      </button>

      <div class="demo-divider">
        <span class="demo-divider__line"></span>
        <span class="demo-divider__text">또는</span>
        <span class="demo-divider__line"></span>
      </div>

      <!-- 탭 -->
      <div class="flex rounded-xl border border-white/10 bg-[#141414] p-1 mb-6">
        <button
          type="button"
          class="flex-1 py-2.5 rounded-lg text-sm font-semibold transition"
          :class="tab === 'login' ? 'bg-primary-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'"
          @click="tab = 'login'"
        >로그인</button>
        <button
          type="button"
          class="flex-1 py-2.5 rounded-lg text-sm font-semibold transition"
          :class="tab === 'register' ? 'bg-primary-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'"
          @click="tab = 'register'"
        >회원가입</button>
      </div>

      <!-- 카드 -->
      <div class="bg-[#141414] rounded-2xl border border-white/10 p-6 space-y-4">

        <!-- 회원가입 전용: 이름 -->
        <div v-if="tab === 'register'">
          <label class="block text-sm font-medium text-slate-300 mb-1.5">이름 <span class="text-red-400">*</span></label>
          <input
            v-model="form.name"
            type="text"
            placeholder="홍길동"
            maxlength="20"
            class="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#1e1e1e] text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
          />
        </div>

        <!-- 전화번호 -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1.5">전화번호 <span class="text-red-400">*</span></label>
          <input
            :value="form.phone"
            type="tel"
            inputmode="numeric"
            placeholder="010-0000-0000"
            class="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#1e1e1e] text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
            @input="form.phone = formatPhone($event.target.value)"
            @keyup.enter="submit"
          />
        </div>

        <!-- 비밀번호 -->
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-1.5">비밀번호 <span class="text-red-400">*</span></label>
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPw ? 'text' : 'password'"
              :placeholder="tab === 'register' ? '4자 이상 입력' : '비밀번호'"
              class="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm pr-10"
              @keyup.enter="submit"
            />
            <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white" @click="showPw = !showPw">
              <svg v-if="!showPw" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
            </button>
          </div>
        </div>

        <!-- 비밀번호 확인 (회원가입) -->
        <div v-if="tab === 'register'">
          <label class="block text-sm font-medium text-slate-300 mb-1.5">비밀번호 확인 <span class="text-red-400">*</span></label>
          <input
            v-model="form.confirm"
            :type="showPw ? 'text' : 'password'"
            placeholder="비밀번호 재입력"
            class="w-full px-4 py-2.5 rounded-xl border bg-[#1e1e1e] text-white placeholder-slate-500 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
            :class="form.confirm && form.confirm !== form.password ? 'border-red-600' : 'border-white/10'"
            @keyup.enter="submit"
          />
          <p v-if="form.confirm && form.confirm !== form.password" class="mt-1 text-xs text-red-500">비밀번호가 일치하지 않습니다.</p>
        </div>

        <p v-if="errorMsg" class="text-red-400 text-sm bg-red-950/40 rounded-lg px-3 py-2 border border-red-800/50">{{ errorMsg }}</p>

        <button
          type="button"
          :disabled="submitting || !canSubmit"
          class="w-full py-3 rounded-xl font-semibold bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          @click="submit"
        >
          {{ submitting ? (tab === 'login' ? '로그인 중…' : '가입 중…') : (tab === 'login' ? '로그인' : '회원가입') }}
        </button>
      </div>

      <div class="mt-4 p-3 bg-blue-950/30 border border-blue-700/40 rounded-xl text-blue-400 text-sm text-center">
        💡 데모 계정: 010-0000-0001 / demo1234
      </div>

      <p class="text-center text-xs text-slate-400 mt-4">
        {{ tab === 'login' ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?' }}
        <button type="button" class="text-primary-400 font-medium hover:underline ml-1" @click="tab = tab === 'login' ? 'register' : 'login'">
          {{ tab === 'login' ? '회원가입' : '로그인' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { memberLogin, memberRegister } from '../api';
import { useMemberAuth } from '../composables/useMemberAuth';

const router = useRouter();
const route  = useRoute();
const { setSession } = useMemberAuth();

const tab     = ref('login');
const showPw  = ref(false);
const errorMsg  = ref('');
const submitting = ref(false);

const form = ref({ name: '', phone: '', password: '', confirm: '' });

const STORE_ID = 'store_default';

const DEMO_NAME = '데모 회원';
const DEMO_PHONE = '01000000001';
const DEMO_PASSWORD = 'demo1234';

async function demoLogin() {
  if (submitting.value) return;
  errorMsg.value = '';
  submitting.value = true;
  try {
    let result;
    try {
      result = await memberRegister(STORE_ID, {
        name: DEMO_NAME,
        phone: DEMO_PHONE,
        password: DEMO_PASSWORD,
      });
    } catch (regErr) {
      if (regErr.message?.includes('409') || regErr.status === 409 || regErr.message?.includes('이미')) {
        result = await memberLogin(STORE_ID, {
          phone: DEMO_PHONE,
          password: DEMO_PASSWORD,
        });
      } else {
        throw regErr;
      }
    }
    setSession(result.token, result.userId, result.name, result.phone);
    router.push('/dashboard');
  } catch (e) {
    errorMsg.value = e.message || '데모 로그인에 실패했습니다.';
  } finally {
    submitting.value = false;
  }
}

function formatPhone(value) {
  const d = value.replace(/\D/g, '').slice(0, 11);
  if (d.startsWith('02')) {
    if (d.length <= 6)  return d.replace(/(\d{2})(\d{0,4})/, '$1-$2').replace(/-$/, '');
    if (d.length <= 9)  return d.replace(/(\d{2})(\d{3,4})(\d{0,4})/, '$1-$2-$3').replace(/-$/, '');
    return d.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  if (d.length <= 7)  return d.replace(/(\d{3})(\d{0,4})/, '$1-$2').replace(/-$/, '');
  if (d.length <= 10) return d.replace(/(\d{3})(\d{3,4})(\d{0,4})/, '$1-$2-$3').replace(/-$/, '');
  return d.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
}

const canSubmit = computed(() => {
  const { name, phone, password, confirm } = form.value;
  const phoneOk = phone.replace(/\D/g, '').length >= 9;
  if (tab.value === 'login') return phoneOk && password.length >= 1;
  return name.trim() && phoneOk && password.length >= 4 && confirm === password;
});

async function submit() {
  if (!canSubmit.value || submitting.value) return;
  errorMsg.value  = '';
  submitting.value = true;
  try {
    const phoneDigits = form.value.phone.replace(/\D/g, '');
    let result;
    if (tab.value === 'login') {
      result = await memberLogin(STORE_ID, { phone: phoneDigits, password: form.value.password });
    } else {
      result = await memberRegister(STORE_ID, {
        name:     form.value.name.trim(),
        phone:    phoneDigits,
        password: form.value.password,
      });
    }
    setSession(result.token, result.userId, result.name, result.phone);
    const redirect = route.query.redirect || '/dashboard';
    router.push(redirect);
  } catch (e) {
    errorMsg.value = e.message || '오류가 발생했습니다.';
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.demo-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  background: #0f172a;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.demo-btn:hover:not(:disabled) {
  background: #1e293b;
}

.demo-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.demo-btn__icon {
  font-size: 24px;
  flex-shrink: 0;
}

.demo-btn__body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.demo-btn__title {
  font-size: 15px;
  font-weight: 700;
}

.demo-btn__sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 400;
}

.demo-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
}

.demo-divider__line {
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.demo-divider__text {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
  flex-shrink: 0;
}
</style>
