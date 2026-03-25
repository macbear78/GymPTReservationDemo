/** 스크롤 인 애니메이션 공통 (디렉티브에서 사용) */

export const SCROLL_ANIMATE_THRESHOLD = 0.15;

export const SCROLL_ANIMATE_EASING = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
export const SCROLL_ANIMATE_DURATION_MS = 700;

/**
 * @param {string|number} raw
 * @returns {number} 0~500
 */
export function clampDelay(raw) {
  const n = parseInt(String(raw), 10);
  if (!Number.isFinite(n)) return 0;
  return Math.min(500, Math.max(0, n));
}

export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function hasIntersectionObserver() {
  return typeof window !== 'undefined' && 'IntersectionObserver' in window;
}

/**
 * @param {HTMLElement} el
 * @param {() => void} onEnter
 * @returns {() => void} cleanup
 */
export function createScrollAnimateObserver(el, onEnter) {
  if (!hasIntersectionObserver() || prefersReducedMotion()) {
    onEnter();
    return () => {};
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        onEnter();
        io.unobserve(el);
        io.disconnect();
        break;
      }
    },
    { threshold: SCROLL_ANIMATE_THRESHOLD }
  );

  io.observe(el);

  return () => {
    try {
      io.unobserve(el);
      io.disconnect();
    } catch {
      /* ignore */
    }
  };
}
