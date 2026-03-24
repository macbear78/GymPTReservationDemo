<template>
  <div class="overflow-x-auto">
    <table class="w-full text-left text-sm sm:text-base">
      <thead class="bg-slate-50 border-b border-slate-200">
        <tr>
          <th class="px-3 sm:px-4 py-3 font-semibold text-slate-700">이름</th>
          <th class="px-3 sm:px-4 py-3 font-semibold text-slate-700">연락처</th>
          <th v-if="!hideTrainerColumn" class="px-3 sm:px-4 py-3 font-semibold text-slate-700">트레이너</th>
          <th class="px-3 sm:px-4 py-3 font-semibold text-slate-700">날짜</th>
          <th class="px-3 sm:px-4 py-3 font-semibold text-slate-700">시간</th>
          <th class="px-3 sm:px-4 py-3 font-semibold text-slate-700">PT</th>
          <th class="px-3 sm:px-4 py-3 font-semibold text-slate-700">상태</th>
          <th class="px-3 sm:px-4 py-3 font-semibold text-slate-700 text-right min-w-[200px]">관리</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="r in reservations"
          :key="r.id"
          class="border-b border-slate-100 hover:bg-slate-50/80 transition"
        >
          <td class="px-3 sm:px-4 py-3 text-slate-800 font-medium">{{ r.name }}</td>
          <td class="px-3 sm:px-4 py-3 text-slate-600">{{ formatKoreanPhoneDisplayOrDash(r.phone) }}</td>
          <td v-if="!hideTrainerColumn" class="px-3 sm:px-4 py-3 text-slate-800">{{ r.trainer }}</td>
          <td class="px-3 sm:px-4 py-3 text-slate-600 whitespace-nowrap">{{ r.date }}</td>
          <td class="px-3 sm:px-4 py-3 text-slate-600">
            <template v-if="editingTimeId === r.id">
              <select
                :value="editTime"
                class="px-2 py-1 rounded border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-primary-500"
                @change="editTime = $event.target.value"
              >
                <option v-for="s in timeSlots" :key="s" :value="s">{{ s }}</option>
              </select>
              <button
                type="button"
                class="ml-1 text-primary-600 hover:text-primary-700 text-xs font-medium"
                @click="saveTime(r)"
              >
                저장
              </button>
              <button
                type="button"
                class="ml-1 text-slate-500 hover:text-slate-700 text-xs"
                @click="editingTimeId = null"
              >
                취소
              </button>
            </template>
            <span v-else>{{ r.time }}</span>
            <button
              v-if="r.status === 'Confirmed' && editingTimeId !== r.id && !r._v2"
              type="button"
              class="ml-1 text-slate-400 hover:text-primary-600 text-xs"
              title="시간 변경"
              @click="startEditTime(r)"
            >
              수정
            </button>
          </td>
          <td class="px-3 sm:px-4 py-3 text-slate-600">
            <template v-if="editingPtId === r.id">
              <select
                :value="editPtType"
                class="px-2 py-1 rounded border border-slate-300 text-slate-800 text-sm focus:ring-2 focus:ring-primary-500"
                @change="editPtType = $event.target.value"
              >
                <option value="30min">30분</option>
                <option value="60min">60분</option>
              </select>
              <button
                type="button"
                class="ml-1 text-primary-600 hover:text-primary-700 text-xs font-medium"
                @click="savePtType(r)"
              >
                저장
              </button>
              <button
                type="button"
                class="ml-1 text-slate-500 hover:text-slate-700 text-xs"
                @click="editingPtId = null"
              >
                취소
              </button>
            </template>
            <span v-else>{{ r.pt_type === '60min' ? '60분' : '30분' }}</span>
            <button
              v-if="r.status === 'Confirmed' && editingPtId !== r.id && !r._v2"
              type="button"
              class="ml-1 text-slate-400 hover:text-primary-600 text-xs"
              title="PT 타입 변경"
              @click="startEditPt(r)"
            >
              수정
            </button>
          </td>
          <td class="px-3 sm:px-4 py-3">
            <span
              :class="[
                'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                statusClass(r.status),
              ]"
            >
              {{ statusLabel(r.status) }}
            </span>
          </td>
          <td class="px-3 sm:px-4 py-3 text-right">
            <div class="flex flex-wrap items-center justify-end gap-1 sm:gap-2">
              <button
                v-if="r.status !== 'Confirmed'"
                type="button"
                class="px-2 py-1 rounded-lg text-xs font-medium bg-primary-100 text-primary-700 hover:bg-primary-200"
                @click="$emit('update', { id: r.id, status: 'Confirmed' })"
              >
                확정
              </button>
              <button
                v-if="r.status === 'Confirmed'"
                type="button"
                class="px-2 py-1 rounded-lg text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200"
                @click="$emit('update', { id: r.id, status: 'Completed' })"
              >
                완료
              </button>
              <button
                v-if="r.status === 'Confirmed'"
                type="button"
                class="px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200"
                @click="$emit('update', { id: r.id, status: 'No-show' })"
              >
                노쇼
              </button>
              <button
                v-if="r.status === 'Confirmed'"
                type="button"
                class="px-2 py-1 rounded-lg text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200"
                @click="$emit('cancel', r.id)"
              >
                취소
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="reservations.length === 0">
          <td :colspan="hideTrainerColumn ? 7 : 8" class="px-4 py-12 text-center text-slate-500">
            조건에 맞는 예약이 없습니다.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { formatKoreanPhoneDisplayOrDash } from '../utils/phoneFormat';

const TIME_SLOTS = ['06:00', '07:00', '08:00', '09:00', '18:00', '19:00', '20:00'];

const props = defineProps({
  reservations: { type: Array, default: () => [] },
  /** 1인 트레이너 샵일 때 트레이너 컬럼 숨김 */
  hideTrainerColumn: { type: Boolean, default: false },
});

const emit = defineEmits(['update', 'cancel']);

const timeSlots = TIME_SLOTS;
const editingTimeId = ref(null);
const editTime = ref('');
const editingPtId = ref(null);
const editPtType = ref('60min');

function statusClass(status) {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Confirmed':
      return 'bg-emerald-100 text-emerald-800';
    case 'Completed':
      return 'bg-blue-100 text-blue-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    case 'No-show':
      return 'bg-slate-200 text-slate-700';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

function statusLabel(status) {
  const map = {
    Pending: '승인 대기',
    Confirmed: '확정',
    Completed: '완료',
    Cancelled: '취소',
    'No-show': '노쇼',
  };
  return map[status] || status;
}

function startEditTime(r) {
  editingTimeId.value = r.id;
  editTime.value = r.time;
  editingPtId.value = null;
}

function startEditPt(r) {
  editingPtId.value = r.id;
  editPtType.value = r.pt_type || '60min';
  editingTimeId.value = null;
}

function saveTime(r) {
  if (editTime.value && editTime.value !== r.time) {
    emit('update', { id: r.id, time: editTime.value });
  }
  editingTimeId.value = null;
}

function savePtType(r) {
  if (editPtType.value && editPtType.value !== r.pt_type) {
    emit('update', { id: r.id, pt_type: editPtType.value });
  }
  editingPtId.value = null;
}
</script>
