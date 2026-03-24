<template>
  <div class="gym-site">
    <!-- 1. Hero -->
    <section class="relative min-h-[90vh] flex items-end sm:items-center justify-center overflow-hidden bg-zinc-950">
      <div
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url('${hero.image}')` }"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/40" />
      <div class="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-20 sm:pb-0 text-center">
        <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-5 animate-fade-in">
          {{ hero.title }}
        </h1>
        <p class="text-xl sm:text-2xl text-zinc-300 mb-10 sm:mb-12 max-w-2xl mx-auto animate-fade-in animation-delay-150">
          {{ hero.subtitle }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in animation-delay-300">
          <button
            type="button"
            class="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold border-2 border-white text-white hover:bg-white hover:text-zinc-950 transition-all duration-300"
            @click="inquiryOpen = true"
          >
            무료 상담
          </button>
          <router-link
            to="/reserve"
            class="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/25 hover:scale-[1.02]"
          >
            PT 예약하기
          </router-link>
        </div>
      </div>
    </section>

    <!-- 2. About / Gym Intro -->
    <section class="py-20 sm:py-28 bg-zinc-900">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div class="order-2 lg:order-1 section-enter">
            <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">
              {{ aboutSections[0].title }}
            </h2>
            <p class="text-zinc-400 text-lg leading-relaxed">
              {{ aboutSections[0].body }}
            </p>
          </div>
          <div class="order-1 lg:order-2">
            <img
              :src="aboutSections[0].image"
              :alt="aboutSections[0].title"
              class="rounded-2xl object-cover w-full h-full min-h-[340px] sm:min-h-[460px] shadow-2xl section-enter"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 3. About / Gym Intro (반대 레이아웃) -->
    <section class="py-20 sm:py-28 bg-zinc-900">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div class="order-1">
            <img
              :src="aboutSections[1].image"
              :alt="aboutSections[1].title"
              class="rounded-2xl object-cover w-full h-full min-h-[340px] sm:min-h-[460px] shadow-2xl section-enter"
              loading="lazy"
            />
          </div>
          <div class="order-2 section-enter">
            <h2 class="text-3xl sm:text-4xl font-bold text-white mb-6">
              {{ aboutSections[1].title }}
            </h2>
            <p class="text-zinc-400 text-lg leading-relaxed">
              {{ aboutSections[1].body }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. Programs -->
    <section class="py-20 sm:py-28 bg-zinc-950">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 class="text-3xl sm:text-4xl font-bold text-white text-center mb-4 section-enter">
          프로그램
        </h2>
        <p class="text-zinc-500 text-center mb-14 section-enter">
          목표에 맞는 프로그램을 선택하세요
        </p>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(p, i) in programs"
            :key="p.title"
            class="rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 transition-all duration-300 text-center section-enter overflow-hidden flex flex-col"
            :style="{ animationDelay: `${i * 100}ms` }"
          >
            <div class="w-full h-52">
              <img
                :src="p.image"
                :alt="`${p.title} 프로그램`"
                class="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div class="p-5 border-t border-zinc-800 flex flex-col justify-center min-h-[96px]">
              <h3 class="text-xl font-semibold text-white mb-2">{{ p.title }}</h3>
              <p class="text-zinc-500 text-sm">{{ p.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. Contact -->
    <section id="contact" class="py-20 sm:py-28 bg-zinc-900">
      <div class="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 class="text-3xl sm:text-4xl font-bold text-white text-center mb-14 section-enter">
          오시는 길 · 문의
        </h2>
        <div class="rounded-2xl overflow-hidden border border-zinc-700 mb-8 section-enter">
          <iframe
            title="스토어 위치 지도"
            :src="googleMapEmbedUrl"
            class="w-full h-[320px] sm:h-[420px]"
            style="border: 0"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          />
        </div>
        <div class="flex flex-col sm:flex-row gap-8 sm:gap-12 justify-center items-center sm:items-start text-zinc-400 section-enter">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div class="text-left">
              <p class="text-white font-medium mb-1">위치</p>
              <a
                :href="googleMapLinkUrl"
                target="_blank"
                rel="noopener"
                class="hover:text-amber-400 transition"
              >
                {{ storeAddress }}
              </a>
            </div>
          </div>
          <a :href="storePhoneHref" class="flex items-center gap-4 hover:text-amber-400 transition">
            <div class="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div class="text-left">
              <p class="text-white font-medium mb-1">전화</p>
              <p>{{ storePhoneDisplay }}</p>
            </div>
          </a>
          <a href="https://pf.kakao.com/_example" target="_blank" rel="noopener" class="flex items-center gap-4 hover:text-amber-400 transition">
            <div class="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.328-1.18.24-1.556-.223l-.002-.003-1.014-1.589a8.18 8.18 0 0 1-1.793-.96C3.967 15.49 1.5 12.358 1.5 8.185 1.5 3.664 6.201 0 12 0Z" />
              </svg>
            </div>
            <div class="text-left">
              <p class="text-white font-medium mb-1">카카오톡</p>
              <p>1:1 문의하기</p>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- 7. Footer -->
    <footer class="py-10 bg-zinc-950 border-t border-zinc-800">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p class="text-zinc-600 text-sm">
          {{ storeName }} · 프리미엄 퍼스널 트레이닝
        </p>
        <div class="flex gap-6 text-zinc-500 text-sm">
          <router-link to="/trainers" class="hover:text-zinc-300 transition">트레이너 소개</router-link>
          <router-link to="/reserve" class="hover:text-zinc-300 transition">예약</router-link>
          <router-link to="/dashboard" class="hover:text-zinc-300 transition">내 PT · 예약</router-link>
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 mt-8">
        <button
          type="button"
          class="px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-300 text-xs hover:bg-zinc-800 transition"
          @click="toggleDebugPanel"
        >
          {{ debugOpen ? '디버그 DB 닫기' : '디버그 DB 보기' }}
        </button>

        <div v-if="debugOpen" class="mt-3 rounded-xl border border-zinc-700 bg-zinc-900/60 p-3 sm:p-4">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <button
              type="button"
              class="px-2.5 py-1.5 rounded bg-amber-500 text-zinc-950 text-xs font-semibold hover:bg-amber-400 transition"
              :disabled="debugLoadingTables"
              @click="loadDebugTables"
            >
              {{ debugLoadingTables ? '불러오는 중…' : '테이블 목록 새로고침' }}
            </button>
            <span v-if="debugError" class="text-red-400 text-xs">{{ debugError }}</span>
          </div>

          <div class="grid md:grid-cols-3 gap-3">
            <div class="md:col-span-1 rounded-lg border border-zinc-700 bg-zinc-950/60 p-2">
              <p class="text-zinc-400 text-xs mb-2">테이블 목록</p>
              <div v-if="debugTables.length === 0" class="text-zinc-500 text-xs px-1 py-2">테이블이 없습니다.</div>
              <ul v-else class="space-y-1 max-h-56 overflow-auto">
                <li v-for="table in debugTables" :key="table">
                  <button
                    type="button"
                    class="w-full text-left text-xs px-2 py-1.5 rounded transition"
                    :class="selectedDebugTable === table ? 'bg-amber-500 text-zinc-950 font-semibold' : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'"
                    @click="selectDebugTable(table)"
                  >
                    {{ table }}
                  </button>
                </li>
              </ul>
            </div>

            <div class="md:col-span-2 rounded-lg border border-zinc-700 bg-zinc-950/60 p-2">
              <div class="flex items-center justify-between mb-2">
                <p class="text-zinc-400 text-xs">
                  {{ selectedDebugTable ? `${selectedDebugTable} 데이터` : '테이블을 선택하세요' }}
                </p>
                <button
                  v-if="selectedDebugTable"
                  type="button"
                  class="px-2 py-1 rounded border border-zinc-600 text-zinc-300 text-[11px] hover:bg-zinc-800 transition"
                  :disabled="debugLoadingItems"
                  @click="loadDebugItems(selectedDebugTable)"
                >
                  새로고침
                </button>
              </div>

              <div
                v-if="selectedDebugTable === 'gympt' && !debugLoadingItems"
                class="mb-2 flex items-center gap-2"
              >
                <button
                  v-for="opt in gymptFilterOptions"
                  :key="opt.value"
                  type="button"
                  class="px-2 py-1 rounded text-[11px] transition"
                  :class="debugGymptFilter === opt.value ? 'bg-amber-500 text-zinc-950 font-semibold' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'"
                  @click="debugGymptFilter = opt.value"
                >
                  {{ opt.label }} ({{ gymptTypeCounts[opt.value] ?? 0 }})
                </button>
                <span class="text-[11px] text-zinc-500">표시 {{ filteredDebugItems.length }}건</span>
              </div>

              <div v-if="!selectedDebugTable" class="text-zinc-500 text-xs py-6 text-center">왼쪽에서 테이블을 선택해주세요.</div>
              <div v-else-if="debugLoadingItems" class="text-zinc-500 text-xs py-6 text-center">데이터를 불러오는 중…</div>
              <div v-else-if="filteredDebugItems.length === 0" class="text-zinc-500 text-xs py-6 text-center">데이터가 없습니다.</div>
              <div v-else-if="selectedDebugTable === 'gympt' && debugGymptFilter === 'store'" class="max-h-72 overflow-auto">
                <table class="w-full text-[11px] text-zinc-200">
                  <thead class="text-zinc-400 border-b border-zinc-700">
                    <tr>
                      <th class="text-left py-1 pr-2">storeId</th>
                      <th class="text-left py-1 pr-2">이름</th>
                      <th class="text-left py-1 pr-2">전화번호</th>
                      <th class="text-left py-1 pr-2">주소</th>
                      <th class="text-left py-1 pr-2">수정일</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in gymptStoreRows" :key="row.storeId" class="border-b border-zinc-800">
                      <td class="py-1 pr-2">{{ row.storeId }}</td>
                      <td class="py-1 pr-2">{{ row.name || '—' }}</td>
                      <td class="py-1 pr-2">{{ row.phone || '—' }}</td>
                      <td class="py-1 pr-2">{{ row.address || '—' }}</td>
                      <td class="py-1 pr-2">{{ row.updatedAt || row.createdAt || '—' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="space-y-2 max-h-72 overflow-auto">
                <pre
                  v-for="(item, idx) in filteredDebugItems"
                  :key="`${selectedDebugTable}-${idx}`"
                  class="text-[11px] leading-5 text-zinc-200 bg-zinc-900 border border-zinc-700 rounded p-2 overflow-x-auto"
                >{{ JSON.stringify(item, null, 2) }}</pre>
              </div>

              <div v-if="debugNextToken" class="mt-2">
                <button
                  type="button"
                  class="px-2.5 py-1.5 rounded bg-zinc-800 text-zinc-200 text-xs hover:bg-zinc-700 transition"
                  :disabled="debugLoadingItems"
                  @click="loadMoreDebugItems"
                >
                  더 보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>

  <InquiryModal v-model="inquiryOpen" />
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { getDebugDbTables, scanDebugDbTable, getStoreInfo } from '../api';
import { formatKoreanPhoneDisplayOrDash } from '../utils/phoneFormat';
import InquiryModal from '../components/InquiryModal.vue';

const inquiryOpen = ref(false);

const STORE_ID = 'store_default';

const storeName = ref('Gym PT');
const storeAddress = ref('서울시 강남구 테헤란로 123');
const storePhoneRaw = ref('02-0000-0000');
const storeDescription = ref('넓고 쾌적한 공간, 최신 장비, 그리고 당신에게만 집중하는 시간. 지금 바로 찾아오세요.');

const hero = ref({
  image:    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=85',
  title:    '지금 시작하세요',
  subtitle: '당신의 몸을 바꿀 시간입니다',
});
const aboutSections = ref([
  {
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=85',
    title: '당신만의 변화가 시작되는 곳',
    body:  '프리미엄 환경에서 1:1 맞춤 트레이닝을 경험하세요. 전문 트레이너가 목표에 맞는 프로그램을 설계하고, 안전하고 지속 가능한 변화를 이끌어 드립니다.',
  },
  {
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=85',
    title: '목표에 맞춘 PT 루틴',
    body:  '체중 감량, 근력 향상, 자세 교정까지 회원님의 목표를 기준으로 세션을 구성합니다. 운동 강도와 진행 속도를 매 수업마다 조정해 무리 없이 꾸준히 이어갈 수 있습니다.',
  },
]);

const storePhoneDisplay = computed(() => formatKoreanPhoneDisplayOrDash(storePhoneRaw.value));
const storePhoneHref = computed(() => {
  const digits = String(storePhoneRaw.value || '').replace(/\D/g, '');
  return digits ? `tel:${digits}` : 'tel:';
});
const googleMapQuery = computed(() => encodeURIComponent(storeAddress.value || '서울시 강남구'));
const googleMapEmbedUrl = computed(() => `https://maps.google.com/maps?q=${googleMapQuery.value}&z=16&output=embed`);
const googleMapLinkUrl = computed(() => `https://www.google.com/maps/search/?api=1&query=${googleMapQuery.value}`);

const DEFAULT_PROGRAMS = [
  {
    title: '다이어트',
    desc: '목표 체중과 건강한 습관을 위한 맞춤 프로그램',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80',
  },
  {
    title: '근력 증가',
    desc: '기초부터 탄탄히, 안전한 근력 트레이닝',
    image: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=400&q=80',
  },
  {
    title: '체형 교정',
    desc: '자세와 움직임 개선으로 일상이 편해집니다',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
  },
];

const programs = ref(DEFAULT_PROGRAMS);

const debugOpen = ref(false);
const debugLoadingTables = ref(false);
const debugLoadingItems = ref(false);
const debugError = ref('');
const debugTables = ref([]);
const selectedDebugTable = ref('');
const debugItems = ref([]);
const debugNextToken = ref(null);
const debugGymptFilter = ref('all');

const gymptFilterOptions = [
  { value: 'all', label: '전체' },
  { value: 'reservation', label: '예약' },
  { value: 'store', label: '스토어' },
  { value: 'member', label: '회원(스토어-회원)' },
  { value: 'userProfile', label: '유저 프로필' },
  { value: 'userPass', label: '패스' },
  { value: 'userNotification', label: '알림' },
  { value: 'userReservation', label: '유저 예약이력' },
  { value: 'payment', label: '결제' },
  { value: 'audit', label: '감사로그' },
  { value: 'unknown', label: '기타' },
];

const filteredDebugItems = computed(() => {
  if (selectedDebugTable.value !== 'gympt') return debugItems.value;
  if (debugGymptFilter.value === 'all') return debugItems.value;
  return debugItems.value.filter((item) => classifyGymptItem(item) === debugGymptFilter.value);
});

const gymptStoreRows = computed(() =>
  filteredDebugItems.value.map((item) => ({
    storeId: item.storeId || String(item.PK || '').replace(/^STORE#/, ''),
    name: item.name,
    phone: item.phone,
    address: item.address,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  })),
);

const gymptTypeCounts = computed(() => {
  const counts = { all: debugItems.value.length };
  for (const item of debugItems.value) {
    const t = classifyGymptItem(item);
    counts[t] = (counts[t] || 0) + 1;
  }
  return counts;
});

function isGymptReservation(item) {
  const pk = String(item?.PK || '');
  const sk = String(item?.SK || '');
  return pk.startsWith('STORE#') && sk.startsWith('RESERVATION#');
}

function isGymptStore(item) {
  const pk = String(item?.PK || '');
  const sk = String(item?.SK || '');
  return pk.startsWith('STORE#') && sk.startsWith('STORE#');
}

function classifyGymptItem(item) {
  const pk = String(item?.PK || '');
  const sk = String(item?.SK || '');

  if (pk.startsWith('AUDIT#')) return 'audit';
  if (pk.startsWith('STORE#') && sk.startsWith('RESERVATION#')) return 'reservation';
  if (pk.startsWith('STORE#') && sk.startsWith('STORE#')) return 'store';
  if (pk.startsWith('STORE#') && sk.startsWith('USER#')) return 'member';
  if (pk.startsWith('STORE#') && sk.startsWith('PAYMENT#')) return 'payment';
  if (pk.startsWith('USER#') && sk === 'PROFILE') return 'userProfile';
  if (pk.startsWith('USER#') && sk.startsWith('PASS#')) return 'userPass';
  if (pk.startsWith('USER#') && sk.startsWith('NOTIF#')) return 'userNotification';
  if (pk.startsWith('USER#') && sk.startsWith('RESERVATION#')) return 'userReservation';
  if (pk.startsWith('USER#') && sk.startsWith('PAYMENT#')) return 'payment';

  return 'unknown';
}

async function loadDebugTables() {
  debugError.value = '';
  debugLoadingTables.value = true;
  try {
    const { tables } = await getDebugDbTables();
    debugTables.value = tables || [];
  } catch (e) {
    debugError.value = e.message || '테이블 목록 조회 실패';
  } finally {
    debugLoadingTables.value = false;
  }
}

async function loadDebugItems(tableName, nextToken = null) {
  if (!tableName) return;
  debugError.value = '';
  debugLoadingItems.value = true;
  try {
    const data = await scanDebugDbTable(tableName, { limit: 50, nextToken });
    if (nextToken) {
      debugItems.value = [...debugItems.value, ...(data.items || [])];
    } else {
      debugItems.value = data.items || [];
    }
    debugNextToken.value = data.nextToken || null;
  } catch (e) {
    debugError.value = e.message || '테이블 데이터 조회 실패';
  } finally {
    debugLoadingItems.value = false;
  }
}

async function toggleDebugPanel() {
  debugOpen.value = !debugOpen.value;
  if (debugOpen.value && debugTables.value.length === 0) {
    await loadDebugTables();
  }
}

async function selectDebugTable(tableName) {
  selectedDebugTable.value = tableName;
  debugGymptFilter.value = 'all';
  debugItems.value = [];
  debugNextToken.value = null;
  await loadDebugItems(tableName);
}

async function loadMoreDebugItems() {
  if (!selectedDebugTable.value || !debugNextToken.value) return;
  await loadDebugItems(selectedDebugTable.value, debugNextToken.value);
}

async function loadStoreInfoForHome() {
  try {
    const store = await getStoreInfo(STORE_ID);
    storeName.value = store.name || storeName.value;
    storeAddress.value = store.address || storeAddress.value;
    storePhoneRaw.value = store.phone || storePhoneRaw.value;
    storeDescription.value = store.description || storeDescription.value;
    if (Array.isArray(store.programs) && store.programs.length > 0) {
      programs.value = store.programs;
    }
    if (store.hero?.title) hero.value = store.hero;
    if (Array.isArray(store.aboutSections) && store.aboutSections.length === 2) {
      aboutSections.value = store.aboutSections;
    }
  } catch {
    // 메인 랜딩은 스토어 조회 실패 시에도 기본 문구로 렌더링
  }
}

onMounted(loadStoreInfoForHome);
</script>

<style scoped>
.gym-site {
  background: #09090b;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out forwards;
}

.animation-delay-150 {
  animation-delay: 0.15s;
  opacity: 0;
}

.animation-delay-300 {
  animation-delay: 0.3s;
  opacity: 0;
}

.section-enter {
  opacity: 0;
  transform: translateY(20px);
  animation: fade-in 0.6s ease-out forwards;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .section-enter {
    animation: none;
    opacity: 1;
    transform: none;
  }
  .animation-delay-150,
  .animation-delay-300 {
    opacity: 1;
  }
}
</style>
