import {
  clampDelay,
  createScrollAnimateObserver,
  hasIntersectionObserver,
  prefersReducedMotion,
} from '../composables/useScrollAnimation.js';

function activate(el) {
  el.classList.add('scroll-animate--in');
}

export default {
  mounted(el) {
    const type = el.dataset.animate || 'fade-up';
    el.dataset.animate = type;
    el.classList.add('scroll-animate');

    const delayMs = clampDelay(el.dataset.delay ?? '0');
    el.style.transitionDelay = `${delayMs}ms`;

    const onLoadAttr = el.getAttribute('data-animate-on-load');
    const onLoad = onLoadAttr !== null && onLoadAttr !== 'false';

    if (onLoad) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => activate(el));
      });
      return;
    }

    if (!hasIntersectionObserver() || prefersReducedMotion()) {
      activate(el);
      return;
    }

    el._scrollAnimateCleanup = createScrollAnimateObserver(el, () => activate(el));
  },

  unmounted(el) {
    if (typeof el._scrollAnimateCleanup === 'function') {
      el._scrollAnimateCleanup();
    }
    el._scrollAnimateCleanup = null;
  },
};
