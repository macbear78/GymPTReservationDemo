import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/HomePage.vue'), meta: { title: 'Home' } },
  { path: '/trainers', name: 'Trainers', component: () => import('../views/TrainersPage.vue'), meta: { title: '트레이너 목록' } },
  { path: '/trainers/:id', name: 'TrainerDetail', component: () => import('../views/TrainerDetailPage.vue'), meta: { title: '트레이너 상세' } },
  { path: '/reserve', name: 'Reserve', component: () => import('../views/ReservationPage.vue'), meta: { title: 'PT 예약' } },
  { path: '/my-reservations', name: 'MyReservations', component: () => import('../views/MyReservationsPage.vue'), meta: { title: '예약 확인' } },
  { path: '/complete', name: 'Complete', component: () => import('../views/ReservationComplete.vue'), meta: { title: 'Reservation Complete' } },
  { path: '/admin', name: 'Admin', component: () => import('../views/AdminDashboard.vue'), meta: { title: 'Admin Dashboard' } },
  { path: '/upload-test', name: 'UploadTest', component: () => import('../views/UploadTest.vue'), meta: { title: '이미지 업로드 테스트' } },
  { path: '/admin/trainer', name: 'TrainerAdmin', component: () => import('../views/TrainerAdmin.vue'), meta: { title: '트레이너 등록' } },
  { path: '/admin/trainer/edit', name: 'TrainerEdit', component: () => import('../views/TrainerEdit.vue'), meta: { title: '트레이너 수정' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · Gym PT` : 'Gym PT';
});

export default router;
