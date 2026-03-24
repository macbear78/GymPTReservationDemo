import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/HomePage.vue'), meta: { title: 'Home' } },
  { path: '/trainers', name: 'Trainers', component: () => import('../views/TrainersPage.vue'), meta: { title: '트레이너 목록' } },
  { path: '/trainers/:id', name: 'TrainerDetail', component: () => import('../views/TrainerDetailPage.vue'), meta: { title: '트레이너 상세' } },
  { path: '/reserve', name: 'Reserve', component: () => import('../views/ReservationPage.vue'), meta: { title: 'PT 예약' } },
  { path: '/dashboard', name: 'Dashboard', component: () => import('../views/MemberDashboard.vue'), meta: { title: '내 PT · 예약' } },
  { path: '/my-reservations', redirect: '/dashboard' },
  { path: '/my-notifications', name: 'MyNotifications', component: () => import('../views/MyNotificationsPage.vue'), meta: { title: '알림' } },
  { path: '/complete', name: 'Complete', component: () => import('../views/ReservationComplete.vue'), meta: { title: 'Reservation Complete' } },
  { path: '/passes', name: 'PassPurchase', component: () => import('../views/PassPurchasePage.vue'), meta: { title: 'PT 패스 구매' } },
  { path: '/payment/success', name: 'PaymentSuccess', component: () => import('../views/PaymentSuccessPage.vue'), meta: { title: '결제 완료' } },
  // Admin (requires auth)
  { path: '/login', name: 'MemberLogin', component: () => import('../views/MemberLoginPage.vue'), meta: { title: '로그인 · 회원가입' } },
  { path: '/admin/login', name: 'AdminLogin', component: () => import('../views/AdminLogin.vue'), meta: { title: '관리자 로그인' } },
  { path: '/admin', name: 'Admin', component: () => import('../views/AdminDashboard.vue'), meta: { title: 'Admin Dashboard', requiresAdmin: true } },
  { path: '/admin/stats', name: 'AdminStats', component: () => import('../views/AdminStats.vue'), meta: { title: '통계', requiresAdmin: true } },
  { path: '/admin/store', name: 'AdminStore', component: () => import('../views/AdminStoreSettings.vue'), meta: { title: '스토어 설정', requiresAdmin: true } },
  { path: '/upload-test', name: 'UploadTest', component: () => import('../views/UploadTest.vue'), meta: { title: '이미지 업로드 테스트' } },
  { path: '/admin/trainer', name: 'TrainerAdmin', component: () => import('../views/TrainerAdmin.vue'), meta: { title: '트레이너 등록', requiresAdmin: true } },
  { path: '/admin/trainer/edit', name: 'TrainerEdit', component: () => import('../views/TrainerEdit.vue'), meta: { title: '트레이너 수정', requiresAdmin: true } },
  { path: '/admin/passes', name: 'AdminPasses', component: () => import('../views/AdminPasses.vue'), meta: { title: '패스 관리', requiresAdmin: true } },
  { path: '/admin/notifications', name: 'AdminNotifications', component: () => import('../views/AdminNotifications.vue'), meta: { title: '알림 관리', requiresAdmin: true } },
  { path: '/admin/members', name: 'AdminMembers', component: () => import('../views/AdminMembers.vue'), meta: { title: '회원 관리', requiresAdmin: true } },
  { path: '/admin/inquiries', name: 'AdminInquiries', component: () => import('../views/AdminInquiries.vue'), meta: { title: '상담 문의', requiresAdmin: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 관리자 인증 가드
router.beforeEach(async (to) => {
  if (!to.meta.requiresAdmin) return true;

  const { checkToken } = useAuth();
  const ok = await checkToken();
  if (!ok) {
    return { name: 'AdminLogin', query: { redirect: to.fullPath } };
  }
  return true;
});

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · Gym PT` : 'Gym PT';
});

export default router;
