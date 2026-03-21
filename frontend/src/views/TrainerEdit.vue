<template>
  <div class="trainer-edit">
    <h1>트레이너 수정 (관리자)</h1>

    <div v-if="!selectedId" class="selector-section">
      <label for="trainer-select">수정할 트레이너 선택</label>
      <select
        id="trainer-select"
        v-model="selectedId"
        class="select-input"
        :disabled="loadingTrainers"
      >
        <option value="">-- 트레이너 선택 --</option>
        <option v-for="t in trainers" :key="t.id" :value="t.id">
          {{ t.name }} ({{ t.id }}) - {{ t.specialty }}
        </option>
      </select>
      <p v-if="trainersError" class="field-error">{{ trainersError }}</p>
    </div>

    <template v-else>
      <form v-if="form" @submit.prevent="submit" class="form">
        <div class="field">
          <label for="id">트레이너 ID</label>
          <input id="id" type="text" :value="form.id" disabled class="disabled-input" />
        </div>

        <div class="field">
          <label for="name">이름 <span class="required">*</span></label>
          <input
            id="name"
            v-model.trim="form.name"
            type="text"
            placeholder="예: 김트레이너"
            :disabled="saving"
          />
        </div>

        <div class="field">
          <label for="specialty">전문 분야 <span class="required">*</span></label>
          <input
            id="specialty"
            v-model.trim="form.specialty"
            type="text"
            placeholder="예: 근력 트레이닝"
            :disabled="saving"
          />
        </div>

        <div class="field">
          <label for="experience">경력 <span class="required">*</span></label>
          <input
            id="experience"
            v-model.trim="form.experience"
            type="text"
            placeholder="예: 5년 경력"
            :disabled="saving"
          />
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
            :disabled="saving"
          />
        </div>

        <div class="field">
          <label>프로필 이미지 <span class="required">*</span></label>
          <div class="image-row">
            <label class="file-label">
              <input
                type="file"
                accept="image/*"
                :disabled="uploading || saving"
                @change="onFileSelect"
              />
              <span>{{ selectedFile ? selectedFile.name : '파일 선택' }}</span>
            </label>
            <button
              type="button"
              class="btn btn-secondary"
              :disabled="!selectedFile || uploading || saving"
              @click="uploadImage"
            >
              {{ uploading ? '업로드 중...' : '이미지 업로드' }}
            </button>
          </div>
          <p v-if="previewUrl" class="preview-label">미리보기</p>
          <img v-if="previewUrl" :src="previewUrl" alt="미리보기" class="preview-img" />
          <img v-else-if="form.profileImage" :src="form.profileImage" alt="업로드된 이미지" class="preview-img" />
          <p v-if="form.profileImage && !selectedFile" class="url-hint">기존 이미지 사용 중 (새 파일 선택 시 교체)</p>
        </div>

        <div v-if="successMessage" class="msg success">{{ successMessage }}</div>
        <div v-if="errorMessage" class="msg error">{{ errorMessage }}</div>

        <div class="actions">
          <button type="submit" class="btn btn-primary" :disabled="!canSubmit || saving">
            {{ saving ? '수정 중...' : '수정 완료' }}
          </button>
          <button type="button" class="btn btn-outline" :disabled="saving" @click="changeTrainer">
            다른 트레이너 선택
          </button>
        </div>
      </form>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { getTrainers, getTrainer, updateTrainer } from '../api';

const form = ref(null);
const trainers = ref([]);
const loadingTrainers = ref(true);
const trainersError = ref('');
const selectedId = ref('');
const selectedFile = ref(null);
const previewUrl = ref('');
const uploading = ref(false);
const saving = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

watch(selectedFile, (file) => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = '';
  }
  if (file) {
    previewUrl.value = URL.createObjectURL(file);
  }
});

watch(selectedId, async (id) => {
  if (!id) {
    form.value = null;
    return;
  }
  errorMessage.value = '';
  successMessage.value = '';
  selectedFile.value = null;
  try {
    const t = await getTrainer(id);
    form.value = {
      id: t.id,
      name: t.name || '',
      specialty: t.specialty || '',
      experience: t.experience || '',
      pricePerHour: t.pricePerHour ?? null,
      profileImage: t.profileImage || t.image || '',
    };
  } catch (e) {
    errorMessage.value = e.message || '트레이너 정보를 불러오지 못했습니다.';
    form.value = null;
  }
});

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});

const canSubmit = computed(() => {
  if (!form.value) return false;
  return (
    form.value.name &&
    form.value.specialty &&
    form.value.experience &&
    form.value.pricePerHour != null &&
    !Number.isNaN(Number(form.value.pricePerHour)) &&
    Number(form.value.pricePerHour) >= 0 &&
    form.value.profileImage
  );
});

function onFileSelect(event) {
  const file = event.target.files?.[0];
  if (!file || !file.type.startsWith('image/')) {
    selectedFile.value = null;
    errorMessage.value = '이미지 파일만 선택 가능합니다.';
    return;
  }
  errorMessage.value = '';
  selectedFile.value = file;
}

async function uploadImage() {
  if (!selectedFile.value || uploading.value || !form.value) return;

  const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') ? `${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/api` : '/api';
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
    if (!uploadUrl || !fileUrl) throw new Error('서버 응답에 uploadUrl 또는 fileUrl이 없습니다.');

    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: selectedFile.value,
    });
    if (!putRes.ok) throw new Error(`S3 업로드 실패 (${putRes.status})`);

    form.value.profileImage = fileUrl;
  } catch (e) {
    errorMessage.value = e.message || '이미지 업로드에 실패했습니다.';
  } finally {
    uploading.value = false;
  }
}

async function submit() {
  if (!form.value || !selectedId.value) return;

  successMessage.value = '';
  errorMessage.value = '';

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
  if (form.value.pricePerHour == null || Number.isNaN(Number(form.value.pricePerHour)) || Number(form.value.pricePerHour) < 0) {
    errorMessage.value = '가격을 올바르게 입력해 주세요.';
    return;
  }
  if (!form.value.profileImage?.trim()) {
    errorMessage.value = '프로필 이미지를 설정해 주세요. (기존 이미지가 있다면 그대로 두거나 새로 업로드하세요)';
    return;
  }

  saving.value = true;

  try {
    await updateTrainer(selectedId.value, {
      name: form.value.name.trim(),
      specialty: form.value.specialty.trim(),
      experience: form.value.experience.trim(),
      pricePerHour: Number(form.value.pricePerHour),
      profileImage: form.value.profileImage.trim(),
    });
    successMessage.value = '수정 완료되었습니다.';
  } catch (e) {
    errorMessage.value = e.message || '트레이너 수정에 실패했습니다.';
  } finally {
    saving.value = false;
  }
}

function changeTrainer() {
  selectedId.value = '';
  form.value = null;
  selectedFile.value = null;
  successMessage.value = '';
  errorMessage.value = '';
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = '';
  }
}

onMounted(async () => {
  try {
    trainers.value = await getTrainers();
  } catch (e) {
    trainersError.value = e.message || '트레이너 목록을 불러오지 못했습니다.';
  } finally {
    loadingTrainers.value = false;
  }
});
</script>

<style scoped>
.trainer-edit {
  max-width: 560px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.trainer-edit h1 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.selector-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.selector-section label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.select-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

.disabled-input {
  background: #f3f4f6;
  cursor: not-allowed;
  color: #6b7280;
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
.field input[type="number"] {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
}

.field input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
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
