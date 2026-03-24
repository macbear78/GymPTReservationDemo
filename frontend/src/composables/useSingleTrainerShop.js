/**
 * 1인 트레이너 PT샵 모드 지원
 * 트레이너가 1명일 때 멀티 트레이너 UI를 숨기고,
 * 2명 이상일 때 기능은 유지하되 덜 부각되도록 사용
 */
import { computed } from 'vue';

/**
 * @param {import('vue').Ref<Array>} trainersRef - 트레이너 목록 ref
 * @returns {{ isSingleTrainer: import('vue').ComputedRef<boolean>, singleTrainer: import('vue').ComputedRef<object|null> }}
 */
export function useSingleTrainerShop(trainersRef) {
  const isSingleTrainer = computed(() => (trainersRef?.value?.length ?? 0) === 1);
  const singleTrainer = computed(() => {
    const list = trainersRef?.value ?? [];
    return list.length === 1 ? list[0] : null;
  });
  return { isSingleTrainer, singleTrainer };
}
