<template>
  <Teleport to="body">
    <Transition name="demo-modal">
      <div v-if="visible" class="dg-backdrop" @click.self="close">
        <div class="dg-modal" role="dialog" aria-modal="true" aria-labelledby="dg-title">

          <!-- 헤더 -->
          <div class="dg-header">
            <span class="dg-badge">🎯 포트폴리오 데모</span>
            <h2 id="dg-title" class="dg-title">체험 가이드</h2>
            <p class="dg-subtitle">
              아래 계정으로 회원 / 관리자 기능을 모두 체험할 수 있습니다.
            </p>
          </div>

          <!-- 계정 카드 영역 -->
          <div class="dg-cards">

            <!-- 회원 -->
            <div class="dg-card dg-card--member">
              <div class="dg-card-icon">👤</div>
              <div class="dg-card-body">
                <p class="dg-card-role">회원 계정</p>
                <div class="dg-credentials">
                  <div class="dg-cred">
                    <span class="dg-cred-label">전화번호</span>
                    <code class="dg-cred-value">010-0000-0001</code>
                  </div>
                  <div class="dg-cred">
                    <span class="dg-cred-label">비밀번호</span>
                    <code class="dg-cred-value">demo1234</code>
                  </div>
                </div>
              </div>
              <router-link to="/login" class="dg-card-btn" @click="close">
                로그인 →
              </router-link>
            </div>

            <!-- 관리자 -->
            <div class="dg-card dg-card--admin">
              <div class="dg-card-icon">⚙️</div>
              <div class="dg-card-body">
                <p class="dg-card-role">관리자 계정</p>
                <div class="dg-credentials">
                  <div class="dg-cred">
                    <span class="dg-cred-label">비밀번호</span>
                    <code class="dg-cred-value">admin1234</code>
                  </div>
                </div>
              </div>
              <router-link to="/admin/login" class="dg-card-btn" @click="close">
                로그인 →
              </router-link>
            </div>

          </div>

          <!-- 안내 -->
          <ul class="dg-tips">
            <li>📋 상단 메뉴 <strong>회원</strong> / <strong>관리자</strong>에 마우스를 올리면 전체 기능 목록이 펼쳐집니다.</li>
            <li>🔒 로그인 전에는 회원·관리자 메뉴 항목이 잠겨 있습니다.</li>
            <li>📱 모바일에서도 동일하게 체험 가능합니다.</li>
          </ul>

          <!-- 닫기 -->
          <button type="button" class="dg-close-btn" @click="close">
            둘러보기만 할게요
          </button>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue';

const SESSION_KEY = 'gympt-demo-guide-dismissed';

const visible = ref(
  typeof sessionStorage !== 'undefined'
    ? sessionStorage.getItem(SESSION_KEY) !== '1'
    : false
);

function close() {
  visible.value = false;
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(SESSION_KEY, '1');
  }
}
</script>

<style scoped>
.dg-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.dg-modal {
  width: 100%;
  max-width: 520px;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.6);
}

/* 헤더 */
.dg-header { text-align: center; margin-bottom: 24px; }

.dg-badge {
  display: inline-block;
  padding: 4px 12px;
  background: rgba(26, 188, 156, 0.15);
  color: #1abc9c;
  border: 1px solid rgba(26, 188, 156, 0.3);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 12px;
}

.dg-title {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.03em;
}

.dg-subtitle {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.58);
  line-height: 1.6;
}

/* 계정 카드 */
.dg-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.dg-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.dg-card--member { background: rgba(26, 188, 156, 0.08); border-color: rgba(26, 188, 156, 0.2); }
.dg-card--admin  { background: rgba(234, 179, 8, 0.08);  border-color: rgba(234, 179, 8, 0.2); }

.dg-card-icon { font-size: 28px; flex-shrink: 0; line-height: 1; }

.dg-card-body { flex: 1; min-width: 0; }

.dg-card-role {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.dg-credentials { display: flex; flex-wrap: wrap; gap: 8px; }

.dg-cred { display: flex; align-items: center; gap: 6px; }

.dg-cred-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}

.dg-cred-value {
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
  padding: 2px 8px;
  border-radius: 6px;
  font-family: 'Pretendard', monospace;
}

.dg-card-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  transition: background 0.2s;
  white-space: nowrap;
}
.dg-card--member .dg-card-btn:hover { background: rgba(26, 188, 156, 0.3); }
.dg-card--admin  .dg-card-btn:hover { background: rgba(234, 179, 8, 0.3); }

/* 안내 팁 */
.dg-tips {
  margin: 0 0 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dg-tips li {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
}

.dg-tips strong { color: rgba(255, 255, 255, 0.9); }

/* 닫기 버튼 */
.dg-close-btn {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.dg-close-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.8);
}

/* 모바일 */
@media (max-width: 540px) {
  .dg-modal { padding: 24px 20px; }
  .dg-card { flex-wrap: wrap; }
  .dg-card-btn { width: 100%; justify-content: center; }
}

/* transition */
.demo-modal-enter-active,
.demo-modal-leave-active { transition: opacity 0.25s ease; }
.demo-modal-enter-active .dg-modal,
.demo-modal-leave-active .dg-modal { transition: transform 0.25s ease; }
.demo-modal-enter-from,
.demo-modal-leave-to { opacity: 0; }
.demo-modal-enter-from .dg-modal,
.demo-modal-leave-to .dg-modal { transform: translateY(16px) scale(0.97); }
</style>
