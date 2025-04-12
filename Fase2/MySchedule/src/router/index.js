import { createRouter, createWebHistory } from 'vue-router'
import HorariosDC from '@/views/HorariosDC.vue'
import Mensagens from '@/views/Mensagens.vue' 

import uc_DC from '@/views/uc_DC.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/horarios-dc',
      name: 'Horarios',
      component: HorariosDC,
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
    },
    {

      path: '/mensagens',
      name: 'Mensagens',
      component: Mensagens  // Componente Mensagens.vue

      path: '/unidades',
      name: 'UnidadesC',
      component: uc_DC,

    },
  ],
})


export default router