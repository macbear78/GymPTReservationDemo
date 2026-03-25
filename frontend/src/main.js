import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import './assets/scrollAnimate.css';
import scrollAnimate from './directives/scrollAnimate.js';

const app = createApp(App);

app.use(router);
app.directive('scroll-animate', scrollAnimate);

app.mount('#app');
