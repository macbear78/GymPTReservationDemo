<template>
  <div class="max-w-5xl mx-auto px-4 py-6 sm:py-8">
    <header class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">알림 관리</h1>
      <p class="mt-1 text-slate-500 text-sm sm:text-base">회원에게 알림을 발송하고 발송 이력을 확인합니다.</p>
    </header>

    <div class="grid lg:grid-cols-5 gap-6">

      <!-- 좌측: 수동 발송 폼 -->
      <div class="lg:col-span-2 space-y-4">
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 class="font-semibold text-slate-800 mb-4">알림 발송</h2>

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

          <!-- 발송 폼 -->
          <template v-if="selectedMember">
            <div class="space-y-3">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">알림 유형</label>
                <select
                  v-model="sendForm.type"
                  class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                >
                  <option value="SESSION_REMINDER">예약 리마인더</option>
                  <option value="LOW_SESSIONS">잔여 세션 안내</option>
                  <option value="REPURCHASE_PROMO">재구매 안내</option>
                  <option value="INACTIVITY_ALERT">비활동 안내</option>
                  <option value="MANUAL">직접 입력</option>
                </select>
              </div>

              <div v-if="sendForm.type === 'MANUAL'">
                <label class="block text-sm font-medium text-slate-700 mb-1">메시지</label>
                <textarea
                  v-model="sendForm.message"
                  rows="3"
                  placeholder="전달할 메시지를 입력하세요"
                  class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm resize-none"
                />
              </div>

              <div v-else class="rounded-lg bg-slate-50 border border-slate-200 p-3 text-xs text-slate-500">
                {{ previewMessages[sendForm.type] }}
              </div>
            </div>

            <p v-if="sendError" class="mt-2 text-red-500 text-xs">{{ sendError }}</p>
            <p v-if="sendSuccess" class="mt-2 text-emerald-600 text-xs font-medium">{{ sendSuccess }}</p>

            <button
              type="button"
              :disabled="!canSend || sending"
              class="mt-4 w-full py-2.5 rounded-lg bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 disabled:opacity-50 transition"
              @click="onSend"
            >
              {{ sending ? '발송 중…' : '알림 발송' }}
            </button>
          </template>
        </div>

        <!-- 알림 유형 설명 -->
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 class="font-semibold text-slate-700 mb-3 text-sm">자동 발송 조건</h3>
          <ul class="space-y-2 text-xs text-slate-500">
            <li class="flex gap-2">
              <span class="shrink-0 font-medium text-emerald-600">예약 리마인더</span>
              <span>예약 생성 시 즉시 발송</span>
            </li>
            <li class="flex gap-2">
              <span class="shrink-0 font-medium text-amber-600">잔여 세션</span>
              <span>세션 차감 후 잔여 2회 이하</span>
            </li>
            <li class="flex gap-2">
              <span class="shrink-0 font-medium text-red-600">재구매 안내</span>
              <span>세션 소진 시 / 만료 7일 전 (스케줄러)</span>
            </li>
            <li class="flex gap-2">
              <span class="shrink-0 font-medium text-slate-600">비활동 안내</span>
              <span>14일 이상 미방문 (스케줄러)</span>
            </li>
          </ul>
          <p class="mt-3 text-xs text-slate-400">스케줄러: <code class="bg-slate-100 px-1 rounded">node scripts/send-scheduled-notifications.js</code></p>
        </div>
      </div>

      <!-- 우측: 회원 알림 이력 -->
      <div class="lg:col-span-3 space-y-4">
        <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 class="font-semibold text-slate-800">
              {{ selectedMember ? `${selectedMember.name}님 알림 이력` : '전체 회원 알림 현황' }}
            </h2>
            <div class="flex items-center gap-3">
              <button
                v-if="selectedMember && notifications.length > 0"
                type="button"
                class="text-xs text-slate-500 hover:text-slate-700"
                @click="markAllRead"
              >
                전체 읽음
              </button>
              <button
                type="button"
                class="text-sm text-primary-600 hover:text-primary-700 font-medium"
                @click="loadData"
              >새로고침</button>
            </div>
          </div>

          <!-- 회원 미선택 시: 전체 회원 알림 요약 -->
          <div v-if="!selectedMember">
            <div v-if="loadingMembers" class="p-8 text-center text-slate-400 text-sm">불러오는 중…</div>
            <div v-else-if="membersWithNotifs.length === 0" class="p-8 text-center text-slate-400 text-sm">등록된 회원이 없습니다.</div>
            <ul v-else class="divide-y divide-slate-100">
              <li
                v-for="m in membersWithNotifs"
                :key="m.userId"
                class="px-5 py-3 flex items-center justify-between gap-3 hover:bg-slate-50 cursor-pointer"
                @click="selectMemberFromList(m)"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                    {{ m.name.charAt(0) }}
                  </div>
                  <div class="min-w-0">
                    <p class="font-medium text-slate-800 text-sm">{{ m.name }}</p>
                    <p class="text-slate-400 text-xs">{{ formatKoreanPhoneDisplayOrDash(m.phone) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <span v-if="m.unreadCount > 0" class="px-2 py-0.5 rounded-full bg-primary-500 text-white text-xs font-bold">
                    {{ m.unreadCount }}
                  </span>
                  <span class="text-xs text-slate-400">총 {{ m.totalNotifs }}건</span>
                </div>
              </li>
            </ul>
          </div>

          <!-- 회원 선택 시: 해당 회원 알림 목록 -->
          <div v-else>
            <div v-if="loadingNotifs" class="p-8 text-center text-slate-400 text-sm">불러오는 중…</div>
            <div v-else-if="notifications.length === 0" class="p-8 text-center text-slate-400 text-sm">알림 이력이 없습니다.</div>
            <ul v-else class="divide-y divide-slate-100">
              <li
                v-for="n in notifications"
                :key="n.notifId"
                class="px-5 py-3 flex items-start gap-3"
                :class="{ 'bg-slate-50': !n.isRead }"
              >
                <span
                  class="mt-0.5 w-2 h-2 rounded-full shrink-0"
                  :class="n.isRead ? 'bg-transparent' : 'bg-primary-500'"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm text-slate-800">{{ n.message }}</p>
                  <p class="text-xs text-slate-400 mt-0.5">
                    <span
                      class="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium mr-1"
                      :class="typeClass(n.type)"
                    >{{ typeLabel(n.type) }}</span>
                    {{ formatTime(n.createdAt) }}
                  </p>
                </div>
                <button
                  v-if="!n.isRead"
                  type="button"
                  class="text-xs text-slate-400 hover:text-slate-600 shrink-0"
                  @click="markRead(n)"
                >읽음</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { lookupUser, getStoreMembers, getUserNotifications, markNotificationRead, sendNotification } from '../api';
import {
  formatKoreanPhoneAsYouType,
  formatKoreanPhoneDisplay,
  formatKoreanPhoneDisplayOrDash,
} from '../utils/phoneFormat';

const STORE_ID = 'store_default';

// 검색
const searchPhone    = ref('');
const searching      = ref(false);
const searchError    = ref('');
const selectedMember = ref(null);

// 발송 폼
const sendForm    = ref({ type: 'SESSION_REMINDER', message: '' });
const sending     = ref(false);
const sendError   = ref('');
const sendSuccess = ref('');

// 알림 목록
const notifications   = ref([]);
const loadingNotifs   = ref(false);

// 전체 회원 요약
const membersWithNotifs = ref([]);
const loadingMembers    = ref(false);

const previewMessages = {
  SESSION_REMINDER: '예약 일정 PT 수업이 있습니다. 잊지 마세요!',
  LOW_SESSIONS:     '잔여 세션이 2회 남았습니다. 재구매를 고려해보세요.',
  REPURCHASE_PROMO: '회원권 세션이 모두 소진되었습니다. 지금 재구매하시면 특별 혜택을 드립니다!',
  INACTIVITY_ALERT: '오랜만이에요. 다시 시작해볼까요?',
};

const canSend = computed(() =>
  selectedMember.value &&
  sendForm.value.type &&
  (sendForm.value.type !== 'MANUAL' || sendForm.value.message.trim())
);

async function searchMember() {
  searchError.value = '';
  searching.value = true;
  try {
    const result = await lookupUser(STORE_ID, searchPhone.value);
    selectedMember.value = result;
    sendSuccess.value = '';
    sendError.value = '';
    await loadMemberNotifs(result.userId);
  } catch (e) {
    searchError.value = e.needsName ? '등록되지 않은 회원입니다.' : (e.message || '조회 실패');
  } finally {
    searching.value = false;
  }
}

function selectMemberFromList(member) {
  selectedMember.value = member;
  searchPhone.value = formatKoreanPhoneDisplay(member.phone || '');
  sendSuccess.value = '';
  sendError.value = '';
  loadMemberNotifs(member.userId);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadMemberNotifs(userId) {
  loadingNotifs.value = true;
  try {
    const data = await getUserNotifications(userId);
    notifications.value = data.notifications || [];
  } catch {
    notifications.value = [];
  } finally {
    loadingNotifs.value = false;
  }
}

async function onSend() {
  sendError.value = '';
  sendSuccess.value = '';
  sending.value = true;
  try {
    await sendNotification(STORE_ID, {
      userId: selectedMember.value.userId,
      type: sendForm.value.type,
      ...(sendForm.value.type === 'MANUAL' && { message: sendForm.value.message }),
    });
    sendSuccess.value = `${selectedMember.value.name}님께 알림이 발송되었습니다.`;
    sendForm.value.message = '';
    await loadMemberNotifs(selectedMember.value.userId);
  } catch (e) {
    sendError.value = e.message || '발송에 실패했습니다.';
  } finally {
    sending.value = false;
  }
}

async function markRead(notif) {
  try {
    await markNotificationRead(selectedMember.value.userId, notif.notifId);
    notif.isRead = true;
  } catch (e) {
    alert(e.message || '읽음 처리 실패');
  }
}

async function markAllRead() {
  try {
    await markNotificationRead(selectedMember.value.userId, 'all');
    notifications.value.forEach((n) => { n.isRead = true; });
  } catch (e) {
    alert(e.message || '읽음 처리 실패');
  }
}

async function loadAllMembersWithNotifs() {
  loadingMembers.value = true;
  try {
    const { members } = await getStoreMembers(STORE_ID);
    const withNotifs = await Promise.all(
      members.map(async (m) => {
        try {
          const data = await getUserNotifications(m.userId);
          return { ...m, unreadCount: data.unreadCount || 0, totalNotifs: data.total || 0 };
        } catch {
          return { ...m, unreadCount: 0, totalNotifs: 0 };
        }
      })
    );
    membersWithNotifs.value = withNotifs.sort((a, b) => b.unreadCount - a.unreadCount);
  } catch (e) {
    console.error(e);
  } finally {
    loadingMembers.value = false;
  }
}

async function loadData() {
  if (selectedMember.value) {
    await loadMemberNotifs(selectedMember.value.userId);
  } else {
    await loadAllMembersWithNotifs();
  }
}

function typeLabel(type) {
  return { SESSION_REMINDER: '리마인더', LOW_SESSIONS: '잔여세션', REPURCHASE_PROMO: '재구매', INACTIVITY_ALERT: '비활동', MANUAL: '수동' }[type] || type;
}

function typeClass(type) {
  return {
    SESSION_REMINDER: 'bg-blue-100 text-blue-700',
    LOW_SESSIONS:     'bg-amber-100 text-amber-700',
    REPURCHASE_PROMO: 'bg-red-100 text-red-700',
    INACTIVITY_ALERT: 'bg-slate-100 text-slate-600',
    MANUAL:           'bg-violet-100 text-violet-700',
  }[type] || 'bg-slate-100 text-slate-600';
}

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

onMounted(loadAllMembersWithNotifs);
</script>
