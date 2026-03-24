import { ref, computed, readonly } from 'vue';
import { memberVerify } from '../api';

const STORE_ID  = 'store_default';
const TOKEN_KEY = 'memberToken';

const token   = ref(localStorage.getItem(TOKEN_KEY) || '');
const userId  = ref('');
const name    = ref('');
const phone   = ref('');
const checked = ref(false);  // 첫 검증 완료 여부

export function useMemberAuth() {
  const isLoggedIn = computed(() => !!token.value && !!userId.value);

  function setSession(t, u, n, p) {
    token.value  = t;
    userId.value = u;
    name.value   = n;
    phone.value  = p;
    checked.value = true;
    localStorage.setItem(TOKEN_KEY, t);
  }

  function clearSession() {
    token.value   = '';
    userId.value  = '';
    name.value    = '';
    phone.value   = '';
    checked.value = true;
    localStorage.removeItem(TOKEN_KEY);
  }

  async function checkToken() {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) { clearSession(); return false; }
    try {
      const data = await memberVerify(STORE_ID, stored);
      token.value   = stored;
      userId.value  = data.userId;
      name.value    = data.name;
      phone.value   = data.phone;
      checked.value = true;
      return true;
    } catch {
      clearSession();
      return false;
    }
  }

  return {
    token:      readonly(token),
    userId:     readonly(userId),
    name:       readonly(name),
    phone:      readonly(phone),
    isLoggedIn,
    checked:    readonly(checked),
    setSession,
    clearSession,
    checkToken,
  };
}
