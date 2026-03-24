/**
 * 입력 중 한국 전화번호에 하이픈 삽입 (숫자만 유지)
 * - 휴대폰·지역번호(01x/03x 등):
 *   - 10자리: 3-3-4
 *   - 11자리: 3-4-4
 * - 서울 02: 02-XXX-XXXX / 02-XXXX-XXXX
 */
export function formatKoreanPhoneAsYouType(value) {
  const nums = String(value).replace(/\D/g, '');
  if (!nums) return '';

  if (nums.startsWith('02')) {
    const rest = nums.slice(2, 10); // 02 이후 최대 8자리
    if (nums.length <= 2) return '02';
    if (rest.length <= 3) return `02-${rest}`;
    if (rest.length <= 7) return `02-${rest.slice(0, 3)}-${rest.slice(3)}`;
    return `02-${rest.slice(0, 4)}-${rest.slice(4, 8)}`;
  }

  const d = nums.slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6, 10)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7, 11)}`;
}

/**
 * 저장된 번호(숫자만 또는 이미 하이픈 포함)를 화면용 하이픈 형식으로 표시
 */
export function formatKoreanPhoneDisplay(value) {
  if (value == null || String(value).trim() === '') return '';
  const digits = String(value).replace(/\D/g, '');
  if (!digits) return '';
  return formatKoreanPhoneAsYouType(digits);
}

/** 표시용: 비어 있으면 대시 */
export function formatKoreanPhoneDisplayOrDash(value) {
  return formatKoreanPhoneDisplay(value) || '—';
}
