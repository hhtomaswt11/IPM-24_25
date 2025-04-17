import { createRouter, createWebHistory } from 'vue-router'
import HorariosDC from '@/views/HorariosDC.vue'
import Mensagens from '@/views/Mensagens.vue'
import Perfil from '@/views/Perfil.vue'
import DetalheUC from '@/views/DetalheUC.vue'

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
      path: '/unidades/:nome',
      name: 'DetalheUC',
      component: DetalheUC,
    },
    {
      path: '/perfil',
      name: 'Perfil',
      component: Perfil,
    },
  ],
})

export default router