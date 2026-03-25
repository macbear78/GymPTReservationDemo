<template>
  <component :is="CurrentHome" />
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const pages = {
  default: defineAsyncComponent(() => import('./HomePage.vue')),
  alt1: defineAsyncComponent(() => import('./HomePageV6.vue')), 
  alt2: defineAsyncComponent(() => import('./HomePageAlt2.vue')),
  alt3: defineAsyncComponent(() => import('./HomePageAlt3.vue')),
  alt4: defineAsyncComponent(() => import('./HomePageAlt4.vue')),
  alt5: defineAsyncComponent(() => import('./HomePageAlt5.vue')),
};

const CurrentHome = computed(() => {
  const v = String(route.query.v || 'default').toLowerCase();
  return pages[v] || pages.default;
});
</script>
