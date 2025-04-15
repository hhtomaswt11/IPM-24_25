import { createRouter, createWebHistory } from 'vue-router'
import HorariosDC from '@/views/HorariosDC.vue'
import Mensagens from '@/views/Mensagens.vue' 
import Perfil from '@/views/Perfil.vue'

import uc_DC from '@/views/uc_DC.vue'
import { preProcessFile } from 'typescript'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/horarios-dc',
      name: 'Horarios',
      component: HorariosDC,
    },
    {
      path: '/mensagens',
      name: 'Mensagens',
      component: Mensagens,
    },
    {
      path: '/unidades',
      name: 'UnidadesC',
      component: uc_DC,
    },
    {
      path: '/perfil',
      name: 'Perfil',
      component: Perfil,
    },
  ],
})


export default router