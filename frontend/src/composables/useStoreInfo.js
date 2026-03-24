/**
 * 스토어 정보를 앱 전체에서 한 번만 로드하는 싱글톤 컴포저블
 * Header, HomePage 등 여러 컴포넌트에서 공유합니다.
 */
import { ref, readonly } from 'vue';
import { getStoreInfo } from '../api';

const STORE_ID = 'store_default';

const storeName    = ref('Gym PT');
const logoImage    = ref('');   // URL — 있으면 이미지로 표시
const logoText     = ref('');   // 없으면 이 텍스트, 그것도 없으면 storeName 사용
const loaded       = ref(false);
let   loading      = false;

export function useStoreInfo() {
  async function load(force = false) {
    if ((loaded.value && !force) || loading) return;
    loading = true;
    try {
      const data = await getStoreInfo(STORE_ID);
      storeName.value = data.name || 'Gym PT';
      logoImage.value = data.logo?.image || '';
      logoText.value  = data.logo?.text  || '';
      loaded.value    = true;
    } catch {
      // 실패해도 기본값 유지
    } finally {
      loading = false;
    }
  }

  return {
    storeName:  readonly(storeName),
    logoImage:  readonly(logoImage),
    logoText:   readonly(logoText),
    loaded:     readonly(loaded),
    load,
  };
}
