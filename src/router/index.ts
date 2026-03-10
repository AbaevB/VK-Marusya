import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: 'Главная' },
    },
    {
      path: '/genres',
      name: 'genres',
      component: () => import('../views/GenresView.vue'),
      meta: { title: 'Жанры' },
    },
    {
      path: '/genre/:genre',
      name: 'genre',
      component: () => import('../views/GenreView.vue'),
      props: true,
      meta: { title: 'Жанр' },
    },
    {
      path: '/film/:id',
      name: 'film',
      component: () => import('../views/FilmView.vue'),
      props: true,
      meta: { title: 'Фильм' },
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/AccountView.vue'),
      meta: { title: 'Аккаунт' },
    },
    
  ],
})

// Установка title страницы
router.afterEach((to) => {
  const title = to.meta?.title as string || 'VK-Маруся'
  document.title = `${title} | VK-Маруся`
})

export default router
