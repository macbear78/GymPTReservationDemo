<template>
  <div class="max-w-7xl mx-auto px-4 py-6 sm:py-8">
    <header class="mb-6">
      <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">회원 관리</h1>
      <p class="mt-1 text-slate-400 text-sm">회원 정보를 수정하고 패스 이력을 확인합니다.</p>
    </header>

    <!-- 검색 -->
    <div class="rounded-xl border border-white/10 bg-[#141414] p-4 mb-4">
      <div class="flex gap-3">
        <input
          v-model="search"
          type="text"
          placeholder="이름 또는 전화번호 검색"
          class="flex-1 px-3 py-2 rounded-lg border border-white/10 bg-[#1e1e1e] text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm placeholder-slate-400"
        />
        <button
          type="button"
          class="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition"
          @click="loadMembers"
        >
          새로고침
        </button>
      </div>
    </div>

    <!-- 회원 목록 -->
    <div class="rounded-xl border border-white/10 bg-[#141414] overflow-hidden">
      <div v-if="loading" class="p-12 text-center text-slate-400 text-sm">불러오는 중…</div>
      <div v-else-if="loadError" class="p-12 text-center text-red-500 text-sm">
        {{ loadError }}
        <button type="button" class="mt-3 block mx-auto text-xs text-primary-600 underline" @click="loadMembers">다시 시도</button>
      </div>
      <div v-else-if="filtered.length === 0" class="p-12 text-center text-slate-400 text-sm">
        {{ search ? '검색 결과가 없습니다.' : '등록된 회원이 없습니다.' }}
      </div>
      <table v-else class="w-full text-sm">
        <thead class="bg-white/3 border-b border-white/10">
          <tr>
            <th class="text-left px-5 py-3 font-medium text-slate-400">이름</th>
            <th class="text-left px-5 py-3 font-medium text-slate-400">전화번호</th>
            <th class="text-left px-5 py-3 font-medium text-slate-400 hidden sm:table-cell">가입일</th>
            <th class="text-right px-5 py-3 font-medium text-slate-400">관리</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr
            v-for="m in filtered"
            :key="m.userId"
            class="hover:bg-white/5 transition"
          >
            <td class="px-5 py-3 font-medium text-white">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs shrink-0">
                  {{ (m.name || '?').charAt(0) }}
                </div>
                {{ m.name || '—' }}
              </div>
            </td>
            <td class="px-5 py-3 text-slate-300">{{ formatKoreanPhoneDisplayOrDash(m.phone) }}</td>
            <td class="px-5 py-3 text-slate-400 hidden sm:table-cell">
              {{ m.createdAt ? m.createdAt.slice(0, 10) : '—' }}
            </td>
            <td class="px-5 py-3 text-right">
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg bg-primary-500 text-white text-xs font-semibold hover:bg-primary-600 transition"
                @click="openMember(m)"
              >
                수정
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 회원 수정 모달 -->
    <Transition name="modal">
      <div v-if="modal.open" class="fixed inset-0 z-[250] flex items-start justify-end">
        <div class="absolute inset-0 bg-black/40" @click="closeModal" />

        <div class="relative w-full max-w-lg h-full bg-[#141414] shadow-2xl flex flex-col overflow-hidden">
          <!-- 모달 헤더 -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm">
                {{ (modal.member?.name || '?').charAt(0) }}
              </div>
              <div>
                <p class="font-semibold text-white">{{ modal.member?.name }}</p>
                <p class="text-xs text-slate-400">{{ formatKoreanPhoneDisplayOrDash(modal.member?.phone) }}</p>
              </div>
            </div>
            <button type="button" class="text-slate-400 hover:text-slate-300 text-2xl leading-none" @click="closeModal">×</button>
          </div>

          <!-- 탭 -->
          <div class="flex border-b border-white/10 shrink-0">
            <button
              v-for="tab in ['기본정보', '패스 관리', '수정 이력']"
              :key="tab"
              type="button"
              class="flex-1 py-3 text-sm font-medium transition border-b-2"
              :class="modal.tab === tab
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-slate-400 hover:text-slate-300'"
              @click="modal.tab = tab; onTabChange(tab)"
            >
              {{ tab }}
            </button>
          </div>

          <!-- 탭 콘텐츠 -->
          <div class="flex-1 overflow-y-auto p-5">

            <!-- 기본정보 탭 -->
            <div v-if="modal.tab === '기본정보'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1">이름</label>
                <input
                  v-model="editForm.name"
                  type="text"
                  class="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1e1e1e] text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1">전화번호</label>
                <input
                  :value="editForm.phone"
                  type="tel"
                  class="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1e1e1e] text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                  @input="editForm.phone = formatKoreanPhoneAsYouType($event.target.value)"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-1">
                  수정 사유 <span class="text-slate-400 font-normal">(선택)</span>
                </label>
                <input
                  v-model="editForm.reason"
                  type="text"
                  placeholder="예: 전화번호 변경 요청"
                  class="w-full px-3 py-2 rounded-lg border border-white/10 bg-[#1e1e1e] text-white focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                />
              </div>

              <p v-if="editError" class="text-red-500 text-xs">{{ editError }}</p>
              <p v-if="editSuccess" class="text-emerald-600 text-xs font-medium">{{ editSuccess }}</p>

              <button
                type="button"
                :disabled="saving"
                class="w-full py-2.5 rounded-lg bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 disabled:opacity-50 transition"
                @click="saveMemberProfile"
              >
                {{ saving ? '저장 중…' : '저장' }}
              </button>
            </div>

            <!-- 패스 관리 탭 -->
            <div v-else-if="modal.tab === '패스 관리'">
              <div v-if="passesLoading" class="py-8 text-center text-slate-400 text-sm">불러오는 중…</div>
              <div v-else-if="passes.length === 0" class="py-8 text-center text-slate-400 text-sm">보유 패스가 없습니다.</div>
              <div v-else class="space-y-3">
                <div
                  v-for="pass in passes"
                  :key="pass.passId"
                  class="rounded-xl border p-4 space-y-3"
                  :class="{
                    'border-emerald-700/40 bg-emerald-950/30': pass.status === 'ACTIVE',
                    'border-white/10 bg-white/5': pass.status === 'EXHAUSTED',
                    'border-red-800/40 bg-red-950/40': pass.status === 'EXPIRED',
                  }"
                >
                  <!-- 패스 요약 -->
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span
                        class="text-sm font-bold"
                        :class="{
                          'text-emerald-400': pass.status === 'ACTIVE',
                          'text-slate-400': pass.status === 'EXHAUSTED',
                          'text-red-400': pass.status === 'EXPIRED',
                        }"
                      >
                        {{ pass.remainingSessions }} / {{ pass.totalSessions }}회
                      </span>
                      <span
                        class="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                        :class="{
                          'bg-emerald-500': pass.status === 'ACTIVE',
                          'bg-slate-400': pass.status === 'EXHAUSTED',
                          'bg-red-400': pass.status === 'EXPIRED',
                        }"
                      >
                        {{ { ACTIVE: '활성', EXHAUSTED: '소진', EXPIRED: '만료' }[pass.status] }}
                      </span>
                    </div>
                    <button
                      type="button"
                      class="text-xs text-slate-500 hover:text-primary-600 underline"
                      @click="togglePassEdit(pass.passId)"
                    >
                      {{ passEditing === pass.passId ? '취소' : '수정' }}
                    </button>
                  </div>

                  <div class="text-xs text-slate-400 flex flex-wrap gap-3">
                    <span>만료일: {{ pass.expiryDate }}</span>
                    <span v-if="pass.memo">메모: {{ pass.memo }}</span>
                  </div>

                  <!-- 패스 수정 폼 (인라인) -->
                  <div v-if="passEditing === pass.passId" class="border-t pt-3 space-y-2">
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="block text-xs font-medium text-slate-300 mb-1">잔여 세션</label>
                        <input
                          v-model.number="passEditForms[pass.passId].remainingSessions"
                          type="number"
                          min="0"
                          :max="pass.totalSessions"
                          class="w-full px-2 py-1.5 rounded-lg border border-white/10 bg-[#1e1e1e] text-white focus:ring-2 focus:ring-primary-500 outline-none text-xs"
                        />
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-slate-300 mb-1">만료일</label>
                        <input
                          v-model="passEditForms[pass.passId].expiryDate"
                          type="date"
                          class="w-full px-2 py-1.5 rounded-lg border border-white/10 bg-[#1e1e1e] text-white focus:ring-2 focus:ring-primary-500 outline-none text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-slate-600 mb-1">메모</label>
                      <input
                        v-model="passEditForms[pass.passId].memo"
                        type="text"
                        placeholder="메모 (선택)"
                        class="w-full px-2 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label class="block text-xs font-medium text-slate-600 mb-1">수정 사유</label>
                      <input
                        v-model="passEditForms[pass.passId].reason"
                        type="text"
                        placeholder="예: 관리자 수동 조정"
                        class="w-full px-2 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-xs"
                      />
                    </div>

                    <p v-if="passEditErrors[pass.passId]" class="text-red-500 text-xs">{{ passEditErrors[pass.passId] }}</p>

                    <button
                      type="button"
                      :disabled="passSaving === pass.passId"
                      class="w-full py-1.5 rounded-lg bg-primary-500 text-white text-xs font-semibold hover:bg-primary-600 disabled:opacity-50 transition"
                      @click="savePass(pass)"
                    >
                      {{ passSaving === pass.passId ? '저장 중…' : '패스 저장' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- 수정 이력 탭 -->
            <div v-else-if="modal.tab === '수정 이력'">
              <div v-if="auditLoading" class="py-8 text-center text-slate-400 text-sm">불러오는 중…</div>
              <div v-else-if="auditLogs.length === 0" class="py-8 text-center text-slate-400 text-sm">수정 이력이 없습니다.</div>
              <div v-else class="space-y-2">
                <div
                  v-for="log in auditLogs"
                  :key="log.auditId"
                  class="rounded-lg border border-slate-200 bg-white p-3 text-xs"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span
                      class="px-2 py-0.5 rounded-full font-semibold text-[10px]"
                      :class="{
                        'bg-blue-100 text-blue-700': log.action === 'UPDATE',
                        'bg-amber-100 text-amber-700': log.action === 'DEDUCT',
                        'bg-violet-100 text-violet-700': log.action === 'STATUS_CHANGE',
                      }"
                    >
                      {{ { UPDATE: '수정', DEDUCT: '차감', STATUS_CHANGE: '상태변경' }[log.action] || log.action }}
                    </span>
                    <span class="text-slate-400">{{ formatDate(log.createdAt) }}</span>
                  </div>

                  <div class="space-y-1">
                    <div
                      v-for="(change, field) in log.changes"
                      :key="field"
                      class="flex items-center gap-2 text-slate-600"
                    >
                      <span class="font-medium text-slate-500 w-24 shrink-0">{{ fieldLabel(field) }}</span>
                      <span class="line-through text-slate-400">{{ formatAuditValue(field, change.before) }}</span>
                      <span class="text-slate-300">→</span>
                      <span class="font-medium text-slate-700">{{ formatAuditValue(field, change.after) }}</span>
                    </div>
                  </div>

                  <div class="mt-2 flex items-center gap-3 text-slate-400">
                    <span v-if="log.editedBy">수정: {{ log.editedBy }}</span>
                    <span v-if="log.reason" class="italic">사유: {{ log.reason }}</span>
                    <span class="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded">{{ log.entityType }}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  getStoreMembers,
  getUserPasses,
  updateMemberProfile,
  updatePass,
  getAuditLog,
} from '../api';
import {
  formatKoreanPhoneAsYouType,
  formatKoreanPhoneDisplay,
  formatKoreanPhoneDisplayOrDash,
} from '../utils/phoneFormat';

function formatAuditValue(field, value) {
  if (value == null || value === '') return '—';
  if (field === 'phone') return formatKoreanPhoneDisplay(value) || String(value);
  return String(value);
}

const STORE_ID = 'store_default';

const members   = ref([]);
const loading   = ref(false);
const loadError = ref('');
const search    = ref('');

const modal = ref({ open: false, member: null, tab: '기본정보' });

const editForm    = ref({ name: '', phone: '', reason: '' });
const saving      = ref(false);
const editError   = ref('');
const editSuccess = ref('');

const passes       = ref([]);
const passesLoading = ref(false);
const passEditing  = ref(null);
const passEditForms  = ref({});
const passEditErrors = ref({});
const passSaving     = ref(null);

const auditLogs    = ref([]);
const auditLoading = ref(false);

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return members.value;
  const qDigits = q.replace(/\D/g, '');
  return members.value.filter((m) => {
    const nameMatch = (m.name || '').toLowerCase().includes(q);
    const phoneDigits = (m.phone || '').replace(/\D/g, '');
    const phoneMatch = qDigits.length > 0 && phoneDigits.includes(qDigits);
    return nameMatch || phoneMatch;
  });
});

async function loadMembers() {
  loading.value = true;
  loadError.value = '';
  try {
    const { members: list } = await getStoreMembers(STORE_ID);
    members.value = list;
  } catch (e) {
    loadError.value = e.message || '회원 목록을 불러오지 못했습니다.';
  } finally {
    loading.value = false;
  }
}

function openMember(m) {
  modal.value = { open: true, member: m, tab: '기본정보' };
  editForm.value = {
    name: m.name || '',
    phone: formatKoreanPhoneDisplay(m.phone || ''),
    reason: '',
  };
  editError.value = '';
  editSuccess.value = '';
  passes.value = [];
  auditLogs.value = [];
  passEditing.value = null;
  passEditForms.value = {};
  passEditErrors.value = {};
}

function closeModal() {
  modal.value.open = false;
}

async function onTabChange(tab) {
  if (tab === '패스 관리' && passes.value.length === 0) {
    await loadPasses();
  }
  if (tab === '수정 이력' && auditLogs.value.length === 0) {
    await loadAuditLogs();
  }
}

async function saveMemberProfile() {
  editError.value = '';
  editSuccess.value = '';
  saving.value = true;
  try {
    const phoneDigits = editForm.value.phone.replace(/\D/g, '');
    await updateMemberProfile(STORE_ID, modal.value.member.userId, {
      name: editForm.value.name,
      ...(phoneDigits ? { phone: phoneDigits } : {}),
      storeId: STORE_ID,
      editedBy: 'admin',
      reason: editForm.value.reason || undefined,
    });
    editSuccess.value = '저장되었습니다.';
    // 목록에 반영
    const idx = members.value.findIndex((m) => m.userId === modal.value.member.userId);
    if (idx !== -1) {
      members.value[idx] = {
        ...members.value[idx],
        name: editForm.value.name,
        phone: phoneDigits || members.value[idx].phone,
      };
      modal.value.member = members.value[idx];
    }
    editForm.value.reason = '';
  } catch (e) {
    editError.value = e.message || '저장에 실패했습니다.';
  } finally {
    saving.value = false;
  }
}

async function loadPasses() {
  passesLoading.value = true;
  try {
    const { passes: list } = await getUserPasses(modal.value.member.userId);
    passes.value = list;
    // 각 패스에 대한 편집 폼 초기화
    list.forEach((p) => {
      passEditForms.value[p.passId] = {
        remainingSessions: p.remainingSessions,
        expiryDate: p.expiryDate,
        memo: p.memo || '',
        reason: '',
      };
    });
  } catch (e) {
    console.error(e);
  } finally {
    passesLoading.value = false;
  }
}

function togglePassEdit(passId) {
  passEditing.value = passEditing.value === passId ? null : passId;
  passEditErrors.value[passId] = '';
}

async function savePass(pass) {
  passEditErrors.value[pass.passId] = '';
  passSaving.value = pass.passId;
  const form = passEditForms.value[pass.passId];

  try {
    const basePayload = {
      editedBy: 'admin',
      reason: form.reason || undefined,
    };

    // 잔여 세션이 변경된 경우
    if (form.remainingSessions !== pass.remainingSessions) {
      const diff = pass.remainingSessions - form.remainingSessions;
      if (diff > 0) {
        // 차감 (DEDUCT 액션)
        await updatePass(modal.value.member.userId, pass.passId, {
          action: 'DEDUCT',
          amount: diff,
          ...basePayload,
        });
      } else {
        // 증가 - remainingSessions 직접 설정
        await updatePass(modal.value.member.userId, pass.passId, {
          remainingSessions: form.remainingSessions,
          ...basePayload,
        });
      }
    }

    // 만료일, 메모 수정
    if (form.expiryDate !== pass.expiryDate || form.memo !== (pass.memo || '')) {
      await updatePass(modal.value.member.userId, pass.passId, {
        expiryDate: form.expiryDate,
        memo: form.memo,
        ...basePayload,
      });
    }

    passEditing.value = null;
    await loadPasses();
  } catch (e) {
    passEditErrors.value[pass.passId] = e.message || '수정에 실패했습니다.';
  } finally {
    passSaving.value = null;
  }
}

async function loadAuditLogs() {
  auditLoading.value = true;
  auditLogs.value = [];
  try {
    const member = modal.value.member;
    // 회원 프로필 이력 + 모든 패스 이력 병렬 조회
    const [userLog, passResults] = await Promise.all([
      getAuditLog('USER', member.userId),
      (passes.value.length > 0
        ? Promise.all(passes.value.map((p) => getAuditLog('PASS', p.passId)))
        : loadPasses().then(() =>
            Promise.all(passes.value.map((p) => getAuditLog('PASS', p.passId)))
          )),
    ]);

    const all = [
      ...(userLog.logs || []),
      ...passResults.flatMap((r) => r.logs || []),
    ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    auditLogs.value = all;
  } catch (e) {
    console.error(e);
  } finally {
    auditLoading.value = false;
  }
}

function formatDate(iso) {
  if (!iso) return '—';
  return iso.slice(0, 16).replace('T', ' ');
}

function fieldLabel(field) {
  const map = {
    name: '이름',
    phone: '전화번호',
    remainingSessions: '잔여 세션',
    expiryDate: '만료일',
    memo: '메모',
    status: '상태',
  };
  return map[field] || field;
}

onMounted(loadMembers);
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: translateX(100%);
}
</style>
