import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/genres',
      name: 'genres',
      component: () => import('../views/GenresView.vue'),
    },
    {
      path: '/genre/:genre',
      name: 'genre',
      component: () => import('../views/GenreView.vue'),
      props: true,
    },
    {
      path: '/film/:id',
      name: 'film',
      component: () => import('../views/FilmView.vue'),
      props: true,
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('../views/AccountView.vue'),
    },
    
  ],
})

export default router
