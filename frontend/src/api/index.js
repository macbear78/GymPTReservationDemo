const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API = BASE ? `${BASE}/api` : '/api';

export async function getTrainers() {
  const res = await fetch(`${API}/trainers`);
  if (!res.ok) throw new Error('Failed to fetch trainers');
  return res.json();
}

export async function getTrainer(id) {
  const res = await fetch(`${API}/trainers/${encodeURIComponent(id)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch trainer');
  }
  return res.json();
}

export async function updateTrainer(id, data) {
  const res = await fetch(`${API}/trainers/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update trainer');
  }
  return res.json();
}

export async function getReservations(date = null, phone = null) {
  const params = new URLSearchParams();
  if (date) params.set('date', date);
  if (phone) params.set('phone', phone);
  const url = `${API}/reservations${params.toString() ? `?${params}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch reservations');
  return res.json();
}

export async function getAvailableSlots(trainer, date) {
  const res = await fetch(
    `${API}/reservations/available?trainer=${encodeURIComponent(trainer)}&date=${encodeURIComponent(date)}`
  );
  if (!res.ok) throw new Error('Failed to fetch available slots');
  return res.json();
}

export async function createReservation(data) {
  const res = await fetch(`${API}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create reservation');
  }
  return res.json();
}

export async function updateReservation(id, data) {
  const res = await fetch(`${API}/reservations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update reservation');
  }
  return res.json();
}

export async function cancelReservation(id) {
  const res = await fetch(`${API}/reservations/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to cancel reservation');
  return res.json();
}

// ─── v2 API ───────────────────────────────────────────────

const API_V2 = `${BASE ? BASE : ''}/api/v2`;

/**
 * 전화번호로 사용자 조회 또는 생성
 * @param {string} storeId
 * @param {string} phone
 * @param {string} [name] - 신규 사용자일 때 필요
 */
export async function lookupUser(storeId, phone, name) {
  const res = await fetch(`${API_V2}/stores/${storeId}/users/lookup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, ...(name ? { name } : {}) }),
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 404 && data.needsName) {
    const err = new Error(data.error || '등록되지 않은 번호입니다.');
    err.needsName = true;
    throw err;
  }
  if (!res.ok) throw new Error(data.error || '사용자 조회에 실패했습니다.');
  return data;
}

/**
 * v2 예약 가능 시간 조회 (trainerId optional)
 */
export async function getAvailableSlotsV2(storeId, date, trainerId) {
  const params = new URLSearchParams({ date });
  if (trainerId) params.set('trainerId', trainerId);
  const res = await fetch(`${API_V2}/stores/${storeId}/reservations/available?${params}`);
  if (!res.ok) throw new Error('가능 시간 조회에 실패했습니다.');
  return res.json();
}

/**
 * v2 예약 생성 (trainerId optional)
 */
export async function createReservationV2(storeId, data) {
  const res = await fetch(`${API_V2}/stores/${storeId}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '예약 생성에 실패했습니다.');
  return body;
}

/**
 * v2 예약 목록 조회 (관리자)
 */
export async function getReservationsV2(storeId, { date, status } = {}) {
  const params = new URLSearchParams();
  if (date) params.set('date', date);
  if (status) params.set('status', status);
  const res = await fetch(`${API_V2}/stores/${storeId}/reservations?${params}`);
  if (!res.ok) throw new Error('예약 목록 조회에 실패했습니다.');
  return res.json();
}

/**
 * v2 예약 상태 변경
 */
export async function updateReservationV2(storeId, reservationId, data) {
  const res = await fetch(`${API_V2}/stores/${storeId}/reservations/${reservationId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '예약 변경에 실패했습니다.');
  return body;
}

/**
 * 사용자 예약 이력 조회
 */
export async function getUserReservations(userId, { limit, nextToken } = {}) {
  const params = new URLSearchParams();
  if (limit) params.set('limit', limit);
  if (nextToken) params.set('nextToken', nextToken);
  const res = await fetch(`${API_V2}/users/${userId}/reservations?${params}`);
  if (!res.ok) throw new Error('예약 이력 조회에 실패했습니다.');
  return res.json();
}

// ─── Pass API ────────────────────────────────────────────

/**
 * 패스 발급 (관리자)
 */
export async function issuePass(storeId, userId, data) {
  const res = await fetch(`${API_V2}/stores/${storeId}/users/${userId}/passes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '패스 발급에 실패했습니다.');
  return body;
}

/**
 * 사용자 패스 목록 조회
 */
export async function getUserPasses(userId, status) {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  const res = await fetch(`${API_V2}/users/${userId}/passes?${params}`);
  if (!res.ok) throw new Error('패스 조회에 실패했습니다.');
  return res.json();
}

/**
 * 패스 세션 차감 (관리자 수동)
 */
export async function deductPassSession(userId, passId, amount = 1) {
  const res = await fetch(`${API_V2}/users/${userId}/passes/${passId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'DEDUCT', amount }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '세션 차감에 실패했습니다.');
  return body;
}

/**
 * 스토어 전체 회원 목록 조회
 * GET /api/v2/stores/:storeId/users/members
 */
export async function getStoreMembers(storeId) {
  const res = await fetch(`${API_V2}/stores/${storeId}/users/members`);
  if (!res.ok) throw new Error('회원 목록 조회에 실패했습니다.');
  return res.json();
}

// ─── Notification API ────────────────────────────────────────────────────────

/**
 * 사용자 알림 목록 조회
 */
export async function getUserNotifications(userId, { isRead, limit } = {}) {
  const params = new URLSearchParams();
  if (isRead !== undefined) params.set('isRead', String(isRead));
  if (limit) params.set('limit', limit);
  const res = await fetch(`${API_V2}/users/${userId}/notifications?${params}`);
  if (!res.ok) throw new Error('알림 조회에 실패했습니다.');
  return res.json();
}

/**
 * 알림 읽음 처리 (notifId = 'all' 이면 전체)
 */
export async function markNotificationRead(userId, notifId) {
  const res = await fetch(`${API_V2}/users/${userId}/notifications/${notifId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isRead: true }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '알림 업데이트에 실패했습니다.');
  return body;
}

/**
 * 관리자 수동 알림 발송
 */
export async function sendNotification(storeId, data) {
  const res = await fetch(`${API_V2}/stores/${storeId}/notifications/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '알림 발송에 실패했습니다.');
  return body;
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export async function adminLogin(password) {
  const res = await fetch(`${API_V2}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '로그인에 실패했습니다.');
  return body;
}

export async function verifyAdminToken(token) {
  const res = await fetch(`${API_V2}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('유효하지 않은 토큰');
  return res.json();
}

// ─── Stats API ────────────────────────────────────────────────────────────────

export async function getStoreStats(storeId, { year, month } = {}) {
  const token = localStorage.getItem('adminToken');
  const params = new URLSearchParams();
  if (year) params.set('year', year);
  if (month) params.set('month', month);
  const res = await fetch(`${API_V2}/stores/${storeId}/stats?${params}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('통계 조회에 실패했습니다.');
  return res.json();
}

// ─── Payment API ──────────────────────────────────────────────────────────────

export async function getPassProducts(storeId) {
  const res = await fetch(`${API_V2}/stores/${storeId}/payments/products`);
  if (!res.ok) throw new Error('상품 조회에 실패했습니다.');
  return res.json();
}

export async function preparePayment(storeId, data) {
  const res = await fetch(`${API_V2}/stores/${storeId}/payments/prepare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '결제 준비에 실패했습니다.');
  return body;
}

export async function confirmPayment(storeId, data) {
  const res = await fetch(`${API_V2}/stores/${storeId}/payments/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '결제 승인에 실패했습니다.');
  return body;
}

export async function getPaymentHistory(storeId) {
  const token = localStorage.getItem('adminToken');
  const res = await fetch(`${API_V2}/stores/${storeId}/payments`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('결제 이력 조회에 실패했습니다.');
  return res.json();
}

/**
 * 패스 수정 (만료일, 메모, 잔여 세션 직접 설정) - 관리자 전용
 */
export async function updatePass(userId, passId, data) {
  const res = await fetch(`${API_V2}/users/${userId}/passes/${passId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '패스 수정에 실패했습니다.');
  return body;
}

/**
 * 회원 기본정보 수정 (이름, 전화번호) - 관리자 전용
 * PATCH /api/v2/stores/:storeId/users/:userId/profile
 */
export async function updateMemberProfile(storeId, userId, data) {
  const res = await fetch(`${API_V2}/stores/${storeId}/users/${userId}/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '회원 정보 수정에 실패했습니다.');
  return body;
}

/**
 * 수정 이력 조회 (audit log)
 * entityType: PASS | RESERVATION | USER
 */
export async function getAuditLog(entityType, entityId) {
  const res = await fetch(`${API_V2}/audit/${entityType}/${entityId}`);
  if (!res.ok) throw new Error('이력 조회에 실패했습니다.');
  return res.json();
}

// ─── Store API ────────────────────────────────────────────────────────────────

export async function getStoreInfo(storeId) {
  const res = await fetch(`${API_V2}/stores/${storeId}`);
  if (!res.ok) throw new Error('스토어 조회에 실패했습니다.');
  return res.json();
}

export async function updateStoreInfo(storeId, data) {
  const token = localStorage.getItem('adminToken');
  const res = await fetch(`${API_V2}/stores/${storeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '스토어 저장에 실패했습니다.');
  return body;
}

// ─── Member Auth API ──────────────────────────────────────────────────────────

export async function memberRegister(storeId, data) {
  const res = await fetch(`${API_V2}/stores/${storeId}/member/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '회원가입에 실패했습니다.');
  return body;
}

export async function memberLogin(storeId, data) {
  const res = await fetch(`${API_V2}/stores/${storeId}/member/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '로그인에 실패했습니다.');
  return body;
}

export async function memberVerify(storeId, token) {
  const res = await fetch(`${API_V2}/stores/${storeId}/member/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('유효하지 않은 토큰입니다.');
  return res.json();
}

/**
 * 회원 본인 예약 목록 조회 (v2). Authorization: memberToken
 * GET /api/v2/stores/:storeId/member/reservations
 */
export async function getMemberReservationsV2(storeId) {
  const token = localStorage.getItem('memberToken');
  const res = await fetch(`${API_V2}/stores/${storeId}/member/reservations`, {
    headers: { ...(token && { Authorization: `Bearer ${token}` }) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || '예약 조회에 실패했습니다.');
  return data;
}

/**
 * 회원 본인 예약 취소 (v2). Authorization: memberToken
 * POST /api/v2/stores/:storeId/member/reservations/:reservationId/cancel
 */
export async function cancelMemberReservationV2(storeId, reservationId, body) {
  const token = localStorage.getItem('memberToken');
  const res = await fetch(
    `${API_V2}/stores/${storeId}/member/reservations/${encodeURIComponent(reservationId)}/cancel`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(body),
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || '예약 취소에 실패했습니다.');
  return data;
}

// ─── Inquiry API ──────────────────────────────────────────────────────────────

export async function createInquiry(storeId, data) {
  const res = await fetch(`${API_V2}/stores/${storeId}/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '문의 등록에 실패했습니다.');
  return body;
}

export async function getInquiries(storeId, { status } = {}) {
  const token = localStorage.getItem('adminToken');
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  const res = await fetch(`${API_V2}/stores/${storeId}/inquiries?${params}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error('문의 목록 조회에 실패했습니다.');
  return res.json();
}

export async function updateInquiryStatus(storeId, inquiryId, status) {
  const token = localStorage.getItem('adminToken');
  const res = await fetch(`${API_V2}/stores/${storeId}/inquiries/${inquiryId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: JSON.stringify({ status }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '상태 변경에 실패했습니다.');
  return body;
}

// ─── Debug DB API (개발용) ────────────────────────────────────────────────────

export async function getDebugDbTables() {
  const res = await fetch(`${API}/debug/db/tables`);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '디버그 테이블 목록 조회 실패');
  return body;
}

export async function scanDebugDbTable(tableName, { limit = 50, nextToken } = {}) {
  const params = new URLSearchParams();
  if (limit) params.set('limit', String(limit));
  if (nextToken) params.set('nextToken', nextToken);
  const qs = params.toString();
  const url = `${API}/debug/db/scan/${encodeURIComponent(tableName)}${qs ? `?${qs}` : ''}`;
  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || '디버그 테이블 조회 실패');
  return body;
}
