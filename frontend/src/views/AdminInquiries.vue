<template>
  <div class="max-w-4xl mx-auto px-4 py-6 sm:py-8">
    <header class="mb-6 sm:mb-8 flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          상담 문의
          <span v-if="unreadCount > 0" class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold">{{ unreadCount }}</span>
        </h1>
        <p class="mt-1 text-slate-500 text-sm">고객이 남긴 무료 상담 문의를 확인합니다.</p>
      </div>
      <!-- 필터 -->
      <div class="flex gap-2">
        <button
          v-for="opt in filterOpts"
          :key="opt.value"
          type="button"
          class="px-3 py-1.5 rounded-lg text-sm font-medium transition"
          :class="filter === opt.value
            ? 'bg-primary-500 text-white'
            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'"
          @click="filter = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </header>

    <div v-if="loading" class="text-center text-slate-400 py-16">불러오는 중…</div>
    <div v-else-if="error" class="text-center text-red-500 py-16">{{ error }}</div>

    <template v-else>
      <div v-if="filtered.length === 0" class="text-center text-slate-400 py-16 bg-white rounded-xl border border-slate-200">
        {{ filter === 'UNREAD' ? '읽지 않은 문의가 없습니다.' : '문의가 없습니다.' }}
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="item in filtered"
          :key="item.inquiryId"
          class="bg-white rounded-xl border transition cursor-pointer"
          :class="item.status === 'UNREAD'
            ? 'border-amber-300 shadow-sm shadow-amber-100'
            : 'border-slate-200'"
          @click="open(item)"
        >
          <div class="px-5 py-4 flex items-start gap-4">
            <!-- 상태 뱃지 -->
            <span
              class="mt-0.5 shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
              :class="item.status === 'UNREAD' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'"
            >
              {{ item.status === 'UNREAD' ? '미확인' : '확인' }}
            </span>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2 flex-wrap">
                <span class="font-semibold text-slate-800 text-sm">{{ item.name }}</span>
                <span class="text-xs text-slate-400 shrink-0">{{ formatDate(item.createdAt) }}</span>
              </div>
              <p v-if="item.phone" class="text-xs text-slate-500 mt-0.5">{{ item.phone }}</p>
              <p class="text-sm text-slate-600 mt-1.5 line-clamp-2">{{ item.message }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 상세 패널 -->
    <Transition name="panel-slide">
      <div v-if="selected" class="fixed inset-0 z-50 flex justify-end" @click.self="closePanel">
        <div class="absolute inset-0 bg-black/30" @click="closePanel" />
        <div class="relative w-full max-w-lg bg-white shadow-2xl flex flex-col h-full overflow-y-auto">
          <div class="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white z-10">
            <h2 class="font-bold text-slate-800 text-lg">문의 상세</h2>
            <button type="button" class="text-slate-400 hover:text-slate-600 text-2xl leading-none" @click="closePanel">×</button>
          </div>

          <div class="px-6 py-5 flex-1 space-y-5">
            <!-- 기본 정보 -->
            <dl class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt class="text-slate-400 text-xs mb-0.5">이름</dt>
                <dd class="font-semibold text-slate-800">{{ selected.name }}</dd>
              </div>
              <div>
                <dt class="text-slate-400 text-xs mb-0.5">연락처</dt>
                <dd class="font-semibold text-slate-800">{{ selected.phone || '—' }}</dd>
              </div>
              <div class="col-span-2">
                <dt class="text-slate-400 text-xs mb-0.5">접수일시</dt>
                <dd class="text-slate-600">{{ formatDateFull(selected.createdAt) }}</dd>
              </div>
            </dl>

            <!-- 문의 내용 -->
            <div>
              <p class="text-slate-400 text-xs mb-2">문의 내용</p>
              <div class="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{{ selected.message }}</div>
            </div>

            <!-- 상태 -->
            <div class="flex items-center gap-3">
              <span class="text-sm text-slate-500">상태:</span>
              <span
                class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                :class="selected.status === 'UNREAD' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'"
              >
                {{ selected.status === 'UNREAD' ? '미확인' : '확인 완료' }}
              </span>
              <span v-if="selected.readAt && selected.status === 'READ'" class="text-xs text-slate-400">
                {{ formatDateFull(selected.readAt) }} 확인
              </span>
            </div>
          </div>

          <!-- 액션 버튼 -->
          <div class="px-6 py-4 border-t border-slate-100 flex gap-3">
            <button
              v-if="selected.status === 'UNREAD'"
              type="button"
              :disabled="actionLoading"
              class="flex-1 py-2.5 rounded-xl font-semibold bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 transition text-sm"
              @click="markAs('READ')"
            >
              {{ actionLoading ? '처리 중…' : '확인 완료로 표시' }}
            </button>
            <button
              v-else
              type="button"
              :disabled="actionLoading"
              class="flex-1 py-2.5 rounded-xl font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition text-sm"
              @click="markAs('UNREAD')"
            >
              {{ actionLoading ? '처리 중…' : '미확인으로 되돌리기' }}
            </button>
            <a
              v-if="selected.phone"
              :href="`tel:${selected.phone.replace(/\D/g, '')}`"
              class="px-4 py-2.5 rounded-xl font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition text-sm flex items-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              전화
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getInquiries, updateInquiryStatus } from '../api';

const STORE_ID = 'store_default';

const items        = ref([]);
const loading      = ref(false);
const error        = ref('');
const filter       = ref('ALL');
const selected     = ref(null);
const actionLoading = ref(false);

const filterOpts = [
  { value: 'ALL',    label: '전체' },
  { value: 'UNREAD', label: '미확인' },
  { value: 'READ',   label: '확인' },
];

const filtered = computed(() => {
  if (filter.value === 'ALL') return items.value;
  return items.value.filter(i => i.status === filter.value);
});

const unreadCount = computed(() => items.value.filter(i => i.status === 'UNREAD').length);

async function load() {
  loading.value = true;
  error.value   = '';
  try {
    const data = await getInquiries(STORE_ID);
    items.value = data.items || [];
  } catch (e) {
    error.value = e.message || '문의 목록 조회에 실패했습니다.';
  } finally {
    loading.value = false;
  }
}

function open(item) {
  selected.value = { ...item };
  // 미확인 항목 열면 자동 읽음 처리
  if (item.status === 'UNREAD') markAs('READ', true);
}

function closePanel() {
  selected.value = null;
}

async function markAs(status, silent = false) {
  if (!selected.value) return;
  if (!silent) actionLoading.value = true;
  try {
    await updateInquiryStatus(STORE_ID, selected.value.inquiryId, status);
    const now = new Date().toISOString();
    // 로컬 상태 갱신
    const idx = items.value.findIndex(i => i.inquiryId === selected.value.inquiryId);
    if (idx !== -1) {
      items.value[idx] = { ...items.value[idx], status, readAt: status === 'READ' ? now : null };
    }
    selected.value = { ...selected.value, status, readAt: status === 'READ' ? now : null };
  } catch (e) {
    if (!silent) alert(e.message || '상태 변경에 실패했습니다.');
  } finally {
    if (!silent) actionLoading.value = false;
  }
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000)        return '방금 전';
  if (diff < 3600000)      return `${Math.floor(diff / 60000)}분 전`;
  if (diff < 86400000)     return `${Math.floor(diff / 3600000)}시간 전`;
  if (diff < 86400000 * 7) return `${Math.floor(diff / 86400000)}일 전`;
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

function formatDateFull(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

onMounted(load);
</script>

<style scoped>
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: opacity 0.2s ease;
}
.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
}
.panel-slide-enter-active > div:last-child,
.panel-slide-leave-active > div:last-child {
  transition: transform 0.25s ease;
}
.panel-slide-enter-from > div:last-child,
.panel-slide-leave-to > div:last-child {
  transform: translateX(100%);
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
