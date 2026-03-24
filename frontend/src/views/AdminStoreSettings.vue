<template>
  <div class="max-w-2xl mx-auto px-4 py-6 sm:py-8">
    <header class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">스토어 설정</h1>
      <p class="mt-1 text-slate-500 text-sm sm:text-base">스튜디오 기본 정보와 예약 시간을 설정합니다.</p>
    </header>

    <div v-if="loading" class="text-center text-slate-400 py-16">불러오는 중…</div>

    <form v-else class="space-y-6" @submit.prevent="onSave">
      <!-- 기본 정보 -->
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 class="font-semibold text-slate-800">기본 정보</h2>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">스튜디오 이름 <span class="text-red-400">*</span></label>
          <input
            v-model="form.name"
            type="text"
            placeholder="예: 강남 PT 스튜디오"
            class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">전화번호</label>
          <input
            :value="form.phone"
            type="tel"
            placeholder="02-1234-5678"
            class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
            @input="form.phone = formatKoreanPhoneAsYouType($event.target.value)"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">주소</label>
          <input
            v-model="form.address"
            type="text"
            placeholder="서울시 강남구 …"
            class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">소개글 <span class="text-slate-400 font-normal">(선택)</span></label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="스튜디오 소개를 입력하세요"
            class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm resize-none"
          />
        </div>
      </div>

      <!-- 로고 -->
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 class="font-semibold text-slate-800">로고</h2>
        <p class="text-xs text-slate-400 -mt-2">헤더에 표시되는 로고입니다. 이미지를 올리면 이미지 로고로, 없으면 아래 텍스트가 표시됩니다.</p>

        <!-- 로고 이미지 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">로고 이미지</label>
          <div class="flex gap-3 items-start">
            <div class="flex-1 space-y-1.5">
              <input
                v-model="form.logo.image"
                type="url"
                placeholder="https://... (이미지 URL 직접 입력)"
                class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
              />
              <div class="flex items-center gap-2">
                <label
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-600 cursor-pointer hover:bg-slate-50 transition"
                  :class="uploadingKey === 'logo' ? 'opacity-60 cursor-not-allowed' : ''"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                  {{ uploadingKey === 'logo' ? '업로드 중…' : '파일 업로드' }}
                  <input type="file" accept="image/*" class="hidden" :disabled="uploadingKey === 'logo'" @change="uploadKeyImage('logo', $event)" />
                </label>
                <button
                  v-if="form.logo.image"
                  type="button"
                  class="text-xs text-red-400 hover:text-red-600 hover:underline"
                  @click="form.logo.image = ''"
                >
                  이미지 제거
                </button>
                <span v-if="uploadKeyErrors['logo']" class="text-red-500 text-xs">{{ uploadKeyErrors['logo'] }}</span>
              </div>
            </div>
            <!-- 미리보기 -->
            <div class="shrink-0 w-28 h-12 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
              <img
                v-if="form.logo.image"
                :src="form.logo.image"
                alt="로고 미리보기"
                class="max-h-10 max-w-full object-contain"
                @error="form.logo.image = ''"
              />
              <span v-else class="text-xs text-slate-400">미리보기</span>
            </div>
          </div>
        </div>

        <!-- 텍스트 로고 (이미지 없을 때 표시) -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">
            텍스트 로고
            <span class="text-slate-400 font-normal text-xs ml-1">(이미지가 없을 때 표시)</span>
          </label>
          <input
            v-model="form.logo.text"
            type="text"
            :placeholder="form.name || '상호명'"
            class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
          />
          <p class="mt-1 text-xs text-slate-400">비워두면 위의 스튜디오 이름이 자동으로 사용됩니다.</p>
        </div>
      </div>

      <!-- 예약 시간 슬롯 -->
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-semibold text-slate-800">예약 가능 시간</h2>
          <button type="button" class="text-xs text-primary-600 hover:underline" @click="addSlot">+ 추가</button>
        </div>

        <div class="flex flex-wrap gap-2 mb-3">
          <div
            v-for="(slot, i) in form.timeSlots"
            :key="i"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-sm"
          >
            <input
              v-model="form.timeSlots[i]"
              type="time"
              class="bg-transparent text-slate-700 text-sm outline-none w-20"
            />
            <button type="button" class="text-slate-400 hover:text-red-500 text-xs font-bold leading-none" @click="removeSlot(i)">×</button>
          </div>
        </div>
        <p class="text-xs text-slate-400">현재 {{ form.timeSlots.length }}개 시간대 등록됨</p>
      </div>

      <!-- 히어로 섹션 -->
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 class="font-semibold text-slate-800">히어로 섹션</h2>
        <p class="text-xs text-slate-400 -mt-2">메인 화면 가장 위에 표시되는 배경 이미지·타이틀·서브 문구입니다.</p>

        <!-- 이미지 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">배경 이미지</label>
          <div class="flex gap-2 items-start">
            <div class="flex-1 space-y-1.5">
              <input v-model="form.hero.image" type="url" placeholder="https://... (이미지 URL)" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
              <div class="flex items-center gap-2">
                <label class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-600 cursor-pointer hover:bg-slate-50 transition" :class="uploadingKey === 'hero' ? 'opacity-60 cursor-not-allowed' : ''">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                  {{ uploadingKey === 'hero' ? '업로드 중…' : '파일 업로드' }}
                  <input type="file" accept="image/*" class="hidden" :disabled="uploadingKey === 'hero'" @change="uploadKeyImage('hero', $event)" />
                </label>
                <span v-if="uploadKeyErrors['hero']" class="text-red-500 text-xs">{{ uploadKeyErrors['hero'] }}</span>
              </div>
            </div>
            <div v-if="form.hero.image" class="shrink-0">
              <img :src="form.hero.image" alt="미리보기" class="w-16 h-16 rounded-lg object-cover border border-slate-200" @error="form.hero.image = ''" />
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">타이틀</label>
          <input v-model="form.hero.title" type="text" placeholder="예: 지금 시작하세요" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">서브 문구</label>
          <input v-model="form.hero.subtitle" type="text" placeholder="예: 당신의 몸을 바꿀 시간입니다" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
        </div>
      </div>

      <!-- 소개 섹션 1, 2 -->
      <div v-for="(sec, si) in form.aboutSections" :key="si" class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <h2 class="font-semibold text-slate-800">소개 섹션 {{ si + 1 }}</h2>
        <p class="text-xs text-slate-400 -mt-2">메인 화면 {{ si + 1 === 1 ? '두' : '세' }}번째 소개 블록입니다.</p>

        <!-- 이미지 -->
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">이미지</label>
          <div class="flex gap-2 items-start">
            <div class="flex-1 space-y-1.5">
              <input v-model="sec.image" type="url" placeholder="https://... (이미지 URL)" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
              <div class="flex items-center gap-2">
                <label class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-600 cursor-pointer hover:bg-slate-50 transition" :class="uploadingKey === `about${si}` ? 'opacity-60 cursor-not-allowed' : ''">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                  {{ uploadingKey === `about${si}` ? '업로드 중…' : '파일 업로드' }}
                  <input type="file" accept="image/*" class="hidden" :disabled="uploadingKey === `about${si}`" @change="uploadKeyImage(`about${si}`, $event)" />
                </label>
                <span v-if="uploadKeyErrors[`about${si}`]" class="text-red-500 text-xs">{{ uploadKeyErrors[`about${si}`] }}</span>
              </div>
            </div>
            <div v-if="sec.image" class="shrink-0">
              <img :src="sec.image" alt="미리보기" class="w-16 h-16 rounded-lg object-cover border border-slate-200" @error="sec.image = ''" />
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">타이틀</label>
          <input v-model="sec.title" type="text" placeholder="예: 당신만의 변화가 시작되는 곳" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">본문</label>
          <textarea v-model="sec.body" rows="3" placeholder="소개 본문을 입력하세요" class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm resize-none" />
        </div>
      </div>

      <!-- 프로그램 카드 -->
      <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between mb-1">
          <h2 class="font-semibold text-slate-800">프로그램 카드</h2>
          <button
            type="button"
            class="text-xs text-primary-600 hover:underline disabled:opacity-40 disabled:cursor-not-allowed"
            :disabled="form.programs.length >= 6"
            @click="addProgram"
          >
            + 추가
          </button>
        </div>
        <p class="text-xs text-slate-400 mb-4">메인 화면에 표시되는 프로그램 카드입니다. 최대 6개까지 등록할 수 있습니다.</p>

        <div v-if="form.programs.length === 0" class="text-center text-slate-400 text-sm py-6 border border-dashed border-slate-200 rounded-lg">
          등록된 카드가 없습니다. + 추가를 눌러 카드를 만드세요.
        </div>

        <div class="space-y-4">
          <div
            v-for="(prog, i) in form.programs"
            :key="i"
            class="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-semibold text-slate-500">카드 {{ i + 1 }}</span>
              <button
                type="button"
                class="text-xs text-red-400 hover:text-red-600 hover:underline"
                @click="removeProgram(i)"
              >
                삭제
              </button>
            </div>

            <!-- 이미지 -->
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">이미지</label>
              <div class="flex gap-2 items-start">
                <div class="flex-1 space-y-1.5">
                  <input
                    v-model="prog.image"
                    type="url"
                    placeholder="https://... (이미지 URL 직접 입력)"
                    class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-xs bg-white"
                  />
                  <div class="flex items-center gap-2">
                    <label
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-600 cursor-pointer hover:bg-slate-50 transition"
                      :class="uploadingIdx === i ? 'opacity-60 cursor-not-allowed' : ''"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                      </svg>
                      {{ uploadingIdx === i ? '업로드 중…' : '파일 업로드' }}
                      <input
                        type="file"
                        accept="image/*"
                        class="hidden"
                        :disabled="uploadingIdx === i"
                        @change="uploadImage(i, $event)"
                      />
                    </label>
                    <span v-if="uploadErrors[i]" class="text-red-500 text-xs">{{ uploadErrors[i] }}</span>
                  </div>
                </div>
                <div v-if="prog.image" class="shrink-0">
                  <img
                    :src="prog.image"
                    alt="미리보기"
                    class="w-16 h-16 rounded-lg object-cover border border-slate-200"
                    @error="prog.image = ''"
                  />
                </div>
              </div>
            </div>

            <!-- 제목 -->
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">제목 <span class="text-red-400">*</span></label>
              <input
                v-model="prog.title"
                type="text"
                placeholder="예: 다이어트"
                class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm bg-white"
              />
            </div>

            <!-- 설명 -->
            <div>
              <label class="block text-xs font-medium text-slate-600 mb-1">설명</label>
              <input
                v-model="prog.desc"
                type="text"
                placeholder="간단한 프로그램 설명"
                class="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 outline-none text-sm bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      <p v-if="saveError" class="text-red-500 text-sm">{{ saveError }}</p>
      <p v-if="saveSuccess" class="text-emerald-600 text-sm font-medium">{{ saveSuccess }}</p>

      <button
        type="submit"
        :disabled="!form.name.trim() || saving"
        class="w-full py-3 rounded-xl font-semibold bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 transition"
      >
        {{ saving ? '저장 중…' : '설정 저장' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getStoreInfo, updateStoreInfo } from '../api';
import { formatKoreanPhoneAsYouType, formatKoreanPhoneDisplay } from '../utils/phoneFormat';
import { useStoreInfo } from '../composables/useStoreInfo';

const { load: reloadStoreInfo } = useStoreInfo();

const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API  = BASE ? `${BASE}/api` : '/api';

const STORE_ID = 'store_default';

const loading     = ref(true);
const saving      = ref(false);
const saveError   = ref('');
const saveSuccess = ref('');

const uploadingIdx    = ref(-1);     // programs 카드 인덱스
const uploadErrors    = ref({});
const uploadingKey    = ref('');     // 'hero' | 'about0' | 'about1'
const uploadKeyErrors = ref({});

const form = ref({
  name: '',
  phone: '',
  address: '',
  description: '',
  timeSlots: [],
  logo: { image: '', text: '' },
  programs: [],
  hero: { image: '', title: '', subtitle: '' },
  aboutSections: [
    { image: '', title: '', body: '' },
    { image: '', title: '', body: '' },
  ],
});

async function loadStore() {
  loading.value = true;
  try {
    const data = await getStoreInfo(STORE_ID);
    form.value = {
      name:        data.name || '',
      phone:       formatKoreanPhoneDisplay(data.phone || ''),
      address:     data.address || '',
      description: data.description || '',
      timeSlots:   data.timeSlots?.length ? [...data.timeSlots] : ['09:00', '10:00', '18:00', '19:00'],
      logo: data.logo ? { ...data.logo } : { image: '', text: '' },
      programs:    Array.isArray(data.programs) ? data.programs.map(p => ({ ...p })) : [],
      hero: data.hero ? { ...data.hero } : { image: '', title: '', subtitle: '' },
      aboutSections: Array.isArray(data.aboutSections) && data.aboutSections.length === 2
        ? data.aboutSections.map(s => ({ ...s }))
        : [{ image: '', title: '', body: '' }, { image: '', title: '', body: '' }],
    };
  } catch (e) {
    saveError.value = e.message || '스토어 정보 조회 실패';
  } finally {
    loading.value = false;
  }
}

function addSlot() {
  form.value.timeSlots.push('09:00');
}

function removeSlot(i) {
  form.value.timeSlots.splice(i, 1);
}

function addProgram() {
  if (form.value.programs.length >= 6) return;
  form.value.programs.push({ title: '', desc: '', image: '' });
}

function removeProgram(i) {
  form.value.programs.splice(i, 1);
  delete uploadErrors.value[i];
}

async function uploadImage(idx, event) {
  const file = event.target.files?.[0];
  if (!file || !file.type.startsWith('image/')) {
    uploadErrors.value[idx] = '이미지 파일만 선택 가능합니다.';
    return;
  }
  uploadErrors.value[idx] = '';
  uploadingIdx.value = idx;
  try {
    const urlRes = await fetch(`${API}/upload-url?contentType=${encodeURIComponent(file.type)}`);
    if (!urlRes.ok) throw new Error('업로드 URL 요청 실패');
    const { uploadUrl, fileUrl } = await urlRes.json();
    if (!uploadUrl || !fileUrl) throw new Error('서버 응답 오류');

    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });
    if (!putRes.ok) throw new Error(`S3 업로드 실패 (${putRes.status})`);

    form.value.programs[idx].image = fileUrl;
  } catch (e) {
    uploadErrors.value[idx] = e.message || '업로드에 실패했습니다.';
  } finally {
    uploadingIdx.value = -1;
    // 같은 파일 재선택 가능하도록 초기화
    event.target.value = '';
  }
}

async function uploadKeyImage(key, event) {
  const file = event.target.files?.[0];
  if (!file || !file.type.startsWith('image/')) {
    uploadKeyErrors.value[key] = '이미지 파일만 선택 가능합니다.';
    return;
  }
  uploadKeyErrors.value[key] = '';
  uploadingKey.value = key;
  try {
    const urlRes = await fetch(`${API}/upload-url?contentType=${encodeURIComponent(file.type)}`);
    if (!urlRes.ok) throw new Error('업로드 URL 요청 실패');
    const { uploadUrl, fileUrl } = await urlRes.json();
    if (!uploadUrl || !fileUrl) throw new Error('서버 응답 오류');
    const putRes = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
    if (!putRes.ok) throw new Error(`S3 업로드 실패 (${putRes.status})`);

    if (key === 'logo')  form.value.logo.image = fileUrl;
    else if (key === 'hero')  form.value.hero.image = fileUrl;
    else if (key === 'about0') form.value.aboutSections[0].image = fileUrl;
    else if (key === 'about1') form.value.aboutSections[1].image = fileUrl;
  } catch (e) {
    uploadKeyErrors.value[key] = e.message || '업로드 실패';
  } finally {
    uploadingKey.value = '';
    event.target.value = '';
  }
}

async function onSave() {
  saveError.value = '';
  saveSuccess.value = '';
  saving.value = true;
  try {
    const slots = [...new Set(form.value.timeSlots.filter(Boolean))].sort();
    const phoneDigits = form.value.phone.replace(/\D/g, '');
    const programs = form.value.programs
      .filter(p => p.title.trim())
      .map(p => ({ title: p.title.trim(), desc: p.desc.trim(), image: p.image.trim() }));

    await updateStoreInfo(STORE_ID, {
      ...form.value,
      phone: phoneDigits,
      timeSlots: slots,
      logo: form.value.logo,
      programs,
      hero: form.value.hero,
      aboutSections: form.value.aboutSections,
    });
    form.value.timeSlots = slots;
    form.value.programs  = programs;
    saveSuccess.value = '설정이 저장되었습니다.';
    reloadStoreInfo(true); // 헤더 로고 즉시 반영
  } catch (e) {
    saveError.value = e.message || '저장에 실패했습니다.';
  } finally {
    saving.value = false;
  }
}

onMounted(loadStore);
</script>
