import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'MyUrls',
      component: () => import('@/pages/MyUrls.vue'),
    },
    {
      path: '/shortener',
      name: 'Shortener',
      component: () => import('@/pages/Shortener.vue'),
    },
    {
      path: '/:urlCode',
      name: 'Redirect',
      component: () => import('@/pages/Redirect.vue'),
    },
  ],
})

export default router
