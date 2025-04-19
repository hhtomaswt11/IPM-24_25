import { createRouter, createWebHistory } from 'vue-router'
import HorariosDC from '@/views/HorariosDC.vue'
import Mensagens from '@/views/Mensagens.vue' 
import HorarioAluno from '@/views/HorarioAluno.vue'
import Perfil from '@/views/Perfil.vue'
import DetalheUC from '@/views/DetalheUC.vue'
import Gestao from '@/views/Gestao.vue'
import GestaoUC from '@/views/GestaoUC.vue' // ✅ NOVO

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
    {
      path: '/gestao',
      name: 'Gestao',
      component: Gestao,
    },
    {
      path: '/gestao-uc/:nome', // ✅ NOVA ROTA
      name: 'GestaoUC',
      component: GestaoUC,
    },
    {
      path: '/horario-aluno',
      name: 'HorarioAluno',
      component: HorarioAluno,
    }
  ],
})

export default router
