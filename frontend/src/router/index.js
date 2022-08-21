import { createRouter, createWebHistory } from 'vue-router'
import formView from '../views/formView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'form',
      component: formView
    },
    {
      path: '/table',
      name: 'table',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/tableView.vue')
    }
  ]
})

export default router
