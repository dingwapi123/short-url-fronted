import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/pages/Shortener.vue'),
    },
    {
      path: '/my-urls',
      name: 'MyUrls',
      component: () => import('@/pages/MyUrls.vue'),
    },
    {
      path: '/:urlCode',
      name: 'Redirect',
      component: () => import('@/pages/Redirect.vue'),
    },
  ],
})

export default router
