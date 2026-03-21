<template>
  <div class="upload-test">
    <h1>이미지 업로드 테스트 (S3 Presigned URL)</h1>

    <div class="section">
      <label class="file-label">
        <span>이미지 선택</span>
        <input
          type="file"
          accept="image/*"
          :disabled="uploading"
          @change="onFileSelect"
        />
      </label>
    </div>

    <div v-if="previewUrl" class="section">
      <p class="label">미리보기</p>
      <img :src="previewUrl" alt="미리보기" class="preview-img" />
    </div>

    <div class="section">
      <button
        type="button"
        class="upload-btn"
        :disabled="!selectedFile || uploading"
        @click="upload"
      >
        <span v-if="uploading">업로드 중...</span>
        <span v-else>업로드</span>
      </button>
    </div>

    <div v-if="errorMessage" class="error-msg" role="alert">
      {{ errorMessage }}
    </div>

    <div v-if="fileUrl" class="section result">
      <p class="label">업로드 완료</p>
      <img :src="fileUrl" alt="업로드된 이미지" class="result-img" />
      <p class="label">이미지 URL</p>
      <code class="file-url">{{ fileUrl }}</code>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';

const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API = BASE ? `${BASE}/api` : '/api';

const selectedFile = ref(null);
const previewUrl = ref('');
const fileUrl = ref('');
const uploading = ref(false);
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

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});

function onFileSelect(event) {
  const file = event.target.files?.[0];
  if (!file || !file.type.startsWith('image/')) {
    selectedFile.value = null;
    errorMessage.value = '이미지 파일만 선택 가능합니다.';
    return;
  }
  errorMessage.value = '';
  fileUrl.value = '';
  selectedFile.value = file;
}

async function upload() {
  if (!selectedFile.value || uploading.value) return;

  uploading.value = true;
  errorMessage.value = '';
  fileUrl.value = '';

  try {
    const res = await fetch(`${API}/upload-url`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `upload-url 요청 실패 (${res.status})`);
    }
    const { uploadUrl, fileUrl: returnedFileUrl } = await res.json();
    if (!uploadUrl || !returnedFileUrl) {
      throw new Error('서버 응답에 uploadUrl 또는 fileUrl이 없습니다.');
    }

    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': selectedFile.value.type || 'application/octet-stream',
      },
      body: selectedFile.value,
    });

    if (!putRes.ok) {
      throw new Error(`S3 업로드 실패 (${putRes.status})`);
    }

    fileUrl.value = returnedFileUrl;
  } catch (e) {
    const msg = e.message || '업로드에 실패했습니다.';
    errorMessage.value = msg;
    alert(msg);
  } finally {
    uploading.value = false;
  }
}
</script>

<style scoped>
.upload-test {
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.upload-test h1 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.section {
  margin-bottom: 1.5rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #374151;
}

.file-label {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
}

.file-label input[type="file"] {
  margin-left: 0.5rem;
}

.file-label:has(input:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

.preview-img,
.result-img {
  max-width: 100%;
  max-height: 320px;
  display: block;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.upload-btn {
  padding: 0.5rem 1.25rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}

.upload-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.upload-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.error-msg {
  padding: 0.75rem 1rem;
  background: #fef2f2;
  color: #b91c1c;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.result {
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.file-url {
  display: block;
  padding: 0.75rem;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.8rem;
  word-break: break-all;
}
</style>
