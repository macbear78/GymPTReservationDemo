<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">
      <nav class="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <router-link to="/" class="text-xl font-semibold text-slate-800 hover:text-primary-600 transition">
          Gym PT
        </router-link>
        <div class="flex items-center gap-4">
          <router-link
            to="/"
            class="text-slate-600 hover:text-slate-900 transition"
          >
            Home
          </router-link>
          <div class="relative group">
            <button
              type="button"
              class="text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
            >
              회원
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div class="absolute top-full left-0 pt-2 -mt-1 py-2 w-44 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all">
              <router-link
                to="/trainers"
                class="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                트레이너 목록
              </router-link>
              <router-link
                to="/my-reservations"
                class="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                예약 확인
              </router-link>
            </div>
          </div>
          <div class="relative group">
            <button
              type="button"
              class="text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
            >
              관리자
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div class="absolute top-full left-0 pt-2 -mt-1 py-2 w-44 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all">
              <router-link
                to="/admin"
                class="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                대시보드
              </router-link>
              <router-link
                to="/admin/trainer"
                class="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                트레이너 등록
              </router-link>
              <router-link
                to="/admin/trainer/edit"
                class="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                트레이너 수정
              </router-link>
              <router-link
                to="/upload-test"
                class="block px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              >
                업로드 테스트
              </router-link>
            </div>
          </div>
        </div>
      </nav>
    </header>
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer class="border-t border-slate-200 bg-white py-6 mt-auto">
      <div class="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
        Gym PT Reservation Demo · Personal Training Booking
      </div>
    </footer>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
