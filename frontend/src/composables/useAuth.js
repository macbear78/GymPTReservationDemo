import { ref, computed } from 'vue';
import { verifyAdminToken } from '../api';

const TOKEN_KEY = 'adminToken';

const token = ref(localStorage.getItem(TOKEN_KEY) || '');
const verified = ref(false);

export function useAuth() {
  const isLoggedIn = computed(() => !!token.value && verified.value);

  function setToken(t) {
    token.value = t;
    localStorage.setItem(TOKEN_KEY, t);
    verified.value = true;
  }

  function clearToken() {
    token.value = '';
    verified.value = false;
    localStorage.removeItem(TOKEN_KEY);
  }

  async function checkToken() {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) { verified.value = false; return false; }
    try {
      await verifyAdminToken(stored);
      token.value = stored;
      verified.value = true;
      return true;
    } catch {
      clearToken();
      return false;
    }
  }

  function getAuthHeader() {
    return token.value ? { Authorization: `Bearer ${token.value}` } : {};
  }

  return { token, isLoggedIn, setToken, clearToken, checkToken, getAuthHeader };
}
