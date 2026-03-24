<template>
  <div class="trainer-admin">
    <h1>트레이너 등록 (관리자)</h1>

    <form @submit.prevent="submit" class="form">
      <div class="field">
        <label for="id">트레이너 ID <span class="required">*</span></label>
        <input
          id="id"
          v-model.trim="form.id"
          type="text"
          placeholder="예: mike"
          :disabled="registering"
        />
        <p v-if="idError" class="field-error">{{ idError }}</p>
      </div>

      <div class="field">
        <label for="name">이름 <span class="required">*</span></label>
        <input
          id="name"
          v-model.trim="form.name"
          type="text"
          placeholder="예: 김트레이너"
          :disabled="registering"
        />
      </div>

      <div class="field">
        <label for="specialty">전문 분야 <span class="required">*</span></label>
        <input
          id="specialty"
          v-model.trim="form.specialty"
          type="text"
          placeholder="예: 근력 트레이닝"
          :disabled="registering"
        />
      </div>

      <div class="field">
        <label for="experience">경력 <span class="required">*</span></label>
        <input
          id="experience"
          v-model.trim="form.experience"
          type="text"
          placeholder="예: 5년 경력"
          :disabled="registering"
        />
      </div>

      <div class="field">
        <label for="intro">짧은 소개 <span class="required">*</span></label>
        <textarea
          id="intro"
          v-model.trim="form.intro"
          rows="3"
          maxlength="500"
          placeholder="목록·카드에 보이는 한 줄 요약 (예: 근력과 체형 교정 전문.)"
          :disabled="registering"
        />
        <p class="field-hint">최대 500자 · 트레이너 목록 카드에 표시됩니다.</p>
      </div>

      <div class="field">
        <label for="introLong">상세 소개</label>
        <textarea
          id="introLong"
          v-model.trim="form.introLong"
          rows="8"
          maxlength="5000"
          placeholder="상세 페이지에 표시할 긴 소개를 입력하세요. 비우면 짧은 소개와 동일하게 표시됩니다."
          :disabled="registering"
        />
        <p class="field-hint">선택 · 최대 5000자 · 트레이너 상세 페이지의 「트레이너 소개」에 표시됩니다.</p>
      </div>

      <div class="field">
        <label for="pricePerHour">가격(원/시간) <span class="required">*</span></label>
        <input
          id="pricePerHour"
          v-model.number="form.pricePerHour"
          type="number"
          min="0"
          step="1000"
          placeholder="예: 60000"
          :disabled="registering"
        />
      </div>

      <div class="field">
        <label>프로필 이미지 <span class="required">*</span></label>
        <div class="image-row">
          <label class="file-label">
            <input
              type="file"
              accept="image/*"
              :disabled="uploading || registering"
              @change="onFileSelect"
            />
            <span>{{ selectedFile ? selectedFile.name : '파일 선택' }}</span>
          </label>
          <button
            type="button"
            class="btn btn-secondary"
            :disabled="!selectedFile || uploading || registering"
            @click="uploadImage"
          >
            {{ uploading ? '업로드 중...' : '이미지 업로드' }}
          </button>
        </div>
        <p v-if="previewUrl" class="preview-label">미리보기</p>
        <img v-if="previewUrl" :src="previewUrl" alt="미리보기" class="preview-img" />
        <img v-else-if="form.profileImage" :src="form.profileImage" alt="업로드된 이미지" class="preview-img" />
        <p v-if="form.profileImage" class="url-hint">이미지 URL이 설정되었습니다.</p>
      </div>

      <div v-if="successMessage" class="msg success">{{ successMessage }}</div>
      <div v-if="errorMessage" class="msg error">{{ errorMessage }}</div>

      <div class="actions">
        <button type="submit" class="btn btn-primary" :disabled="!canSubmit || registering">
          {{ registering ? '등록 중...' : '트레이너 등록' }}
        </button>
        <button type="button" class="btn btn-outline" :disabled="registering" @click="resetForm">
          폼 초기화
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';

const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API = BASE ? `${BASE}/api` : '/api';

const form = ref({
  id: '',
  name: '',
  specialty: '',
  experience: '',
  intro: '',
  introLong: '',
  pricePerHour: null,
  profileImage: '',
});

const selectedFile = ref(null);
const previewUrl = ref('');
const uploading = ref(false);
const registering = ref(false);
const successMessage = ref('');
const errorMessage = ref('');
const idError = ref('');

watch(selectedFile, (file) => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = '';
  }
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
  }
});

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});

const canSubmit = computed(() => {
  return (
    form.value.id &&
    form.value.name &&
    form.value.specialty &&
    form.value.experience &&
    form.value.intro?.trim() &&
    form.value.pricePerHour != null &&
    form.value.pricePerHour !== '' &&
    !Number.isNaN(Number(form.value.pricePerHour)) &&
    Number(form.value.pricePerHour) >= 0 &&
    form.value.profileImage
  );
});

function onFileSelect(event) {
  const file = event.target.files?.[0];
  if (!file || !file.type.startsWith('image/')) {
    selectedFile.value = null;
    form.value.profileImage = '';
    errorMessage.value = '이미지 파일만 선택 가능합니다.';
    return;
  }
  errorMessage.value = '';
  form.value.profileImage = '';
  selectedFile.value = file;
}

async function uploadImage() {
  if (!selectedFile.value || uploading.value) return;

  uploading.value = true;
  errorMessage.value = '';

  try {
    const contentType = selectedFile.value.type || 'image/jpeg';
    const res = await fetch(`${API}/upload-url?contentType=${encodeURIComponent(contentType)}`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'upload-url 요청 실패');
    }
    const { uploadUrl, fileUrl } = await res.json();
    if (!uploadUrl || !fileUrl) {
      throw new Error('서버 응답에 uploadUrl 또는 fileUrl이 없습니다.');
    }

    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: selectedFile.value,
    });

    if (!putRes.ok) {
      throw new Error(`S3 업로드 실패 (${putRes.status})`);
    }

    form.value.profileImage = fileUrl;
    console.log('업로드된 이미지 URL:', fileUrl);
  } catch (e) {
    errorMessage.value = e.message || '이미지 업로드에 실패했습니다.';
  } finally {
    uploading.value = false;
  }
}

function validate() {
  idError.value = '';
  if (!form.value.id) return false;
  if (!/^[a-z0-9_-]+$/i.test(form.value.id)) {
    idError.value = 'ID는 영문, 숫자, _, - 만 사용 가능합니다.';
    return false;
  }
  return true;
}

async function submit() {
  successMessage.value = '';
  errorMessage.value = '';

  if (!form.value.id?.trim()) {
    errorMessage.value = '트레이너 ID를 입력해 주세요.';
    return;
  }
  if (!form.value.name?.trim()) {
    errorMessage.value = '이름을 입력해 주세요.';
    return;
  }
  if (!form.value.specialty?.trim()) {
    errorMessage.value = '전문 분야를 입력해 주세요.';
    return;
  }
  if (!form.value.experience?.trim()) {
    errorMessage.value = '경력을 입력해 주세요.';
    return;
  }
  if (!form.value.intro?.trim()) {
    errorMessage.value = '짧은 소개를 입력해 주세요.';
    return;
  }
  if (form.value.pricePerHour == null || form.value.pricePerHour === '' || Number.isNaN(Number(form.value.pricePerHour)) || Number(form.value.pricePerHour) < 0) {
    errorMessage.value = '가격을 올바르게 입력해 주세요.';
    return;
  }
  if (!form.value.profileImage?.trim()) {
    errorMessage.value = '프로필 이미지를 선택한 뒤 업로드 버튼을 눌러 주세요.';
    return;
  }
  if (!validate()) return;

  registering.value = true;

  try {
    const res = await fetch(`${API}/trainers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: form.value.id.trim(),
        name: form.value.name.trim(),
        specialty: form.value.specialty.trim(),
        experience: form.value.experience.trim(),
        intro: form.value.intro.trim(),
        introLong: form.value.introLong?.trim() || form.value.intro.trim(),
        pricePerHour: Number(form.value.pricePerHour),
        profileImage: form.value.profileImage.trim(),
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (res.status === 409) {
        errorMessage.value = data.message || '이미 사용 중인 트레이너 ID입니다. 다른 ID를 사용해 주세요.';
        return;
      }
      throw new Error(data.message || `등록 실패 (${res.status})`);
    }

    successMessage.value = data.message || '등록 완료되었습니다.';
    alert(data.message || '등록 완료되었습니다.');
    resetForm();
  } catch (e) {
    errorMessage.value = e.message || '트레이너 등록에 실패했습니다.';
  } finally {
    registering.value = false;
  }
}

function resetForm() {
  form.value = {
    id: '',
    name: '',
    specialty: '',
    experience: '',
    intro: '',
    introLong: '',
    pricePerHour: null,
    profileImage: '',
  };
  selectedFile.value = null;
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = '';
  }
  successMessage.value = '';
  errorMessage.value = '';
  idError.value = '';
}
</script>

<style scoped>
.trainer-admin {
  max-width: 560px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.trainer-admin h1 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #dc2626;
}

.field input[type="text"],
.field input[type="number"],
.field textarea {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
  line-height: 1.5;
}

.field textarea:disabled,
.field input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.field-hint {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.field-error {
  font-size: 0.8rem;
  color: #dc2626;
  margin: 0;
}

.image-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.file-label {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
}

.file-label input[type="file"] {
  margin-right: 0.5rem;
}

.file-label:has(input:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

.preview-label {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 0.5rem 0 0 0;
}

.preview-img {
  max-width: 200px;
  max-height: 200px;
  object-fit: contain;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-top: 0.25rem;
}

.url-hint {
  font-size: 0.8rem;
  color: #059669;
  margin: 0.25rem 0 0 0;
}

.msg {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
}

.msg.success {
  background: #d1fae5;
  color: #065f46;
}

.msg.error {
  background: #fee2e2;
  color: #b91c1c;
}

.actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn {
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.875rem;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #2563eb;
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-secondary {
  background: #e5e7eb;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  background: #d1d5db;
}

.btn-outline {
  background: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-outline:hover:not(:disabled) {
  background: #f9fafb;
}
</style>
