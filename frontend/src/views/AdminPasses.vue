<template>
  <div class="max-w-5xl mx-auto px-4 py-6 sm:py-8">
    <header class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">패스 관리</h1>
      <p class="mt-1 text-slate-500 text-sm sm:text-base">회원에게 PT 패스를 발급하고 잔여 세션을 관리합니다.</p>
    </header>

    <div class="grid lg:grid-cols-5 gap-6">

      <!-- 좌측: 패스 발급 폼 -->
      <div class="lg:col-span-2 space-y-4">
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="font-semibold text-slate-800 mb-4">패스 발급</h2>

          <!-- 회원 검색 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-slate-700 mb-1">회원 검색</label>
            <div class="flex gap-2">
              <input
                :value="searchPhone"
                type="tel"
                placeholder="전화번호 검색"
                class="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                @input="searchPhone = formatKoreanPhoneAsYouType($event.target.value)"
                @keyup.enter="searchMember"
              />
              <button
                type="button"
                :disabled="!searchPhone || searching"
                class="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium disabled:opacity-50 transition"
                @click="searchMember"
              >
                {{ searching ? '…' : '검색' }}
              </button>
            </div>
            <p v-if="searchError" class="mt-1 text-red-500 text-xs">{{ searchError }}</p>
          </div>

          <!-- 선택된 회원 -->
          <div
            v-if="selectedMember"
            class="flex items-center gap-3 p-3 rounded-lg bg-primary-50 border border-primary-200 mb-4"
          >
            <div class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {{ selectedMember.name.charAt(0) }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-semibold text-primary-800 text-sm">{{ selectedMember.name }}</p>
              <p class="text-primary-500 text-xs">{{ formatKoreanPhoneDisplayOrDash(selectedMember.phone) }}</p>
            </div>
            <button type="button" class="text-primary-400 hover:text-primary-600 text-xs" @click="selectedMember = null">
              변경
            </button>
          </div>

          <!-- 발급 정보 -->
          <template v-if="selectedMember">
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">총 세션 수</label>
                <input
                  v-model.number="issueForm.totalSessions"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="예: 10"
                  class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">만료일</label>
                <input
                  v-model="issueForm.expiryDate"
                  type="date"
                  :min="today"
                  class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">메모 <span class="text-slate-400 font-normal">(선택)</span></label>
                <input
                  v-model="issueForm.memo"
                  type="text"
                  placeholder="예: 3월 등록"
                  class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                />
              </div>
            </div>

            <p v-if="issueError" class="mt-2 text-red-500 text-xs">{{ issueError }}</p>
            <p v-if="issueSuccess" class="mt-2 text-emerald-600 text-xs font-medium">{{ issueSuccess }}</p>

            <button
              type="button"
              :disabled="!canIssue || issuing"
              class="mt-4 w-full py-2.5 rounded-lg bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 disabled:opacity-50 transition"
              @click="onIssue"
            >
              {{ issuing ? '발급 중…' : '패스 발급' }}
            </button>
          </template>
        </div>
      </div>

      <!-- 우측: 회원 목록 + 패스 현황 -->
      <div class="lg:col-span-3 space-y-4">
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 class="font-semibold text-slate-800">전체 회원 패스 현황</h2>
            <button
              type="button"
              class="text-sm text-primary-600 hover:text-primary-700 font-medium"
              @click="loadMembers"
            >새로고침</button>
          </div>

          <div v-if="loadingMembers" class="p-8 text-center text-slate-400 text-sm">불러오는 중…</div>
          <div v-else-if="membersWithPasses.length === 0" class="p-8 text-center text-slate-400 text-sm">등록된 회원이 없습니다.</div>

          <ul v-else class="divide-y divide-slate-100">
            <li
              v-for="member in membersWithPasses"
              :key="member.userId"
              class="px-5 py-4"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                    {{ member.name.charAt(0) }}
                  </div>
                  <div class="min-w-0">
                    <p class="font-medium text-slate-800 text-sm">{{ member.name }}</p>
                    <p class="text-slate-400 text-xs">{{ formatKoreanPhoneDisplayOrDash(member.phone) }}</p>
                  </div>
                </div>
                <button
                  type="button"
                  class="text-xs text-primary-600 hover:underline shrink-0"
                  @click="selectMemberFromList(member)"
                >
                  패스 발급
                </button>
              </div>

              <!-- 패스 목록 -->
              <div v-if="member.passes && member.passes.length > 0" class="mt-3 space-y-2">
                <div
                  v-for="pass in member.passes"
                  :key="pass.passId"
                  class="flex items-center justify-between rounded-lg px-3 py-2 text-xs"
                  :class="{
                    'bg-emerald-50 border border-emerald-200': pass.status === 'ACTIVE',
                    'bg-slate-50 border border-slate-200': pass.status === 'EXHAUSTED',
                    'bg-red-50 border border-red-200': pass.status === 'EXPIRED',
                  }"
                >
                  <div class="flex items-center gap-2">
                    <span
                      class="font-semibold"
                      :class="{
                        'text-emerald-700': pass.status === 'ACTIVE',
                        'text-slate-500': pass.status === 'EXHAUSTED',
                        'text-red-600': pass.status === 'EXPIRED',
                      }"
                    >
                      {{ pass.remainingSessions }} / {{ pass.totalSessions }}회
                    </span>
                    <span class="text-slate-400">· 만료 {{ pass.expiryDate }}</span>
                    <span v-if="pass.memo" class="text-slate-400">· {{ pass.memo }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span
                      class="px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                      :class="{
                        'bg-emerald-500 text-white': pass.status === 'ACTIVE',
                        'bg-slate-400 text-white': pass.status === 'EXHAUSTED',
                        'bg-red-400 text-white': pass.status === 'EXPIRED',
                      }"
                    >
                      {{ { ACTIVE: '활성', EXHAUSTED: '소진', EXPIRED: '만료' }[pass.status] }}
                    </span>
                    <button
                      v-if="pass.status === 'ACTIVE'"
                      type="button"
                      class="text-slate-400 hover:text-slate-600 underline"
                      @click="manualDeduct(member, pass)"
                    >
                      차감
                    </button>
                  </div>
                </div>
              </div>
              <p v-else class="mt-2 text-xs text-slate-400">보유 패스 없음</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { lookupUser, getStoreMembers, getUserPasses, issuePass, deductPassSession } from '../api';
import {
  formatKoreanPhoneAsYouType,
  formatKoreanPhoneDisplay,
  formatKoreanPhoneDisplayOrDash,
} from '../utils/phoneFormat';

const STORE_ID = 'store_default';
const today = new Date().toISOString().slice(0, 10);

// 검색
const searchPhone   = ref('');
const searching     = ref(false);
const searchError   = ref('');
const selectedMember = ref(null);

// 발급 폼
const issueForm = ref({ totalSessions: 10, expiryDate: '', memo: '' });
const issuing      = ref(false);
const issueError   = ref('');
const issueSuccess = ref('');

// 회원 목록
const members            = ref([]);
const membersWithPasses  = ref([]);
const loadingMembers     = ref(false);

const canIssue = computed(() =>
  selectedMember.value &&
  issueForm.value.totalSessions >= 1 &&
  issueForm.value.expiryDate
);

async function searchMember() {
  searchError.value = '';
  searching.value = true;
  try {
    const result = await lookupUser(STORE_ID, searchPhone.value);
    selectedMember.value = result;
    issueSuccess.value = '';
    issueError.value = '';
  } catch (e) {
    searchError.value = e.needsName ? '등록되지 않은 회원입니다.' : (e.message || '조회 실패');
  } finally {
    searching.value = false;
  }
}

function selectMemberFromList(member) {
  selectedMember.value = member;
  searchPhone.value = formatKoreanPhoneDisplay(member.phone || '');
  issueSuccess.value = '';
  issueError.value = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function onIssue() {
  issueError.value = '';
  issueSuccess.value = '';
  issuing.value = true;
  try {
    await issuePass(STORE_ID, selectedMember.value.userId, {
      totalSessions: issueForm.value.totalSessions,
      expiryDate: issueForm.value.expiryDate,
      ...(issueForm.value.memo && { memo: issueForm.value.memo }),
    });
    issueSuccess.value = `${selectedMember.value.name}님께 ${issueForm.value.totalSessions}회 패스가 발급되었습니다.`;
    issueForm.value = { totalSessions: 10, expiryDate: '', memo: '' };
    await loadMembers();
  } catch (e) {
    issueError.value = e.message || '발급에 실패했습니다.';
  } finally {
    issuing.value = false;
  }
}

async function manualDeduct(member, pass) {
  if (!confirm(`${member.name}님의 패스에서 1회 차감하시겠습니까?`)) return;
  try {
    await deductPassSession(member.userId, pass.passId, 1);
    await loadMembers();
  } catch (e) {
    alert(e.message || '차감에 실패했습니다.');
  }
}

async function loadMembers() {
  loadingMembers.value = true;
  try {
    const { members: list } = await getStoreMembers(STORE_ID);
    // 각 회원 패스 병렬 로드
    const withPasses = await Promise.all(
      list.map(async (m) => {
        try {
          const { passes } = await getUserPasses(m.userId);
          return { ...m, passes };
        } catch {
          return { ...m, passes: [] };
        }
      })
    );
    membersWithPasses.value = withPasses;
  } catch (e) {
    console.error(e);
  } finally {
    loadingMembers.value = false;
  }
}

onMounted(loadMembers);
</script>
