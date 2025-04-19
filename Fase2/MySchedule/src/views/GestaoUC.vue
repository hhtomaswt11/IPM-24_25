<template>
    <div class="gestao-container">
      <div class="decoracao-fundo"></div>
  
      <Tabela
        titulo="Conflitos, Trocas de Turnos e Salas"
        :colunas="colunas"
        :campos="campos"
        :dados="dadosFiltrados"
        @atualizar="acaoAtualizar"
        @aceitar="acaoAceitar"
        @rejeitar="acaoRejeitar"
      />
    </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router'
  import db from '@/database/trabalhodb.json'
  import Tabela from '@/components/Tabela.vue'
  
  const route = useRoute()
  const nomeUC = route.params.nome.toLowerCase()
  const uc = db.courses.find(c => c.name.toLowerCase().includes(nomeUC))
  
  const colunas = ['Tipo', 'Número', 'Estatuto', 'Turno atual', 'Alteração', 'Capacidade', 'Decisão']
  const campos = ['tipo', 'numero', 'estatuto', 'turnoAtual', 'alteracao', 'capacidade', 'decisao']
  
  // Exemplo estático, deves adaptar à tua lógica real de pedidos no backend/json
  const todasTrocas = db.shiftRequests.map((req, index) => {
    const shift = db.shifts.find(s => s.id === req.shiftId)
    const student = db.students.find(s => s.id === req.studentId)
    const course = db.courses.find(c => c.id === shift.courseId)
  
    return {
      tipo: 'Troca de turno',
      numero: `a${student.id.toString().padStart(3, '0')}`,
      estatuto: student.specialStatus ? 'TE' : 'Não',
      turnoAtual: shift.name,
      alteracao: 'T2', // Exemplo fixo; pode-se puxar de alternativeShiftId
      capacidade: `${shift.totalStudentsRegistered}/42`,
      decisao: '✔ ✖',
      ucId: course.id,
    }
  })
  
  const todosConflitos = db.conflicts.map((conf) => {
    const student = db.students.find(s => s.id === conf.studentId)
    const uc1 = db.courses.find(c => c.id === conf.courseIDs[0])
    const shift1 = db.shifts.find(s => s.courseId === uc1.id)
  
    return {
      tipo: 'Conflito',
      numero: `a${student.id.toString().padStart(3, '0')}`,
      estatuto: student.specialStatus ? 'TE' : 'Não',
      turnoAtual: shift1?.name ?? '---',
      alteracao: 'Seleciona',
      capacidade: '-----',
      decisao: 'Atualizar',
      ucId: uc1.id,
    }
  })
  
  const dadosFiltrados = [...todasTrocas, ...todosConflitos].filter(d => d.ucId === uc?.id)
  
  function acaoAtualizar(i) {
    console.log(`Atualizar clicado na linha ${i}`)
  }
  function acaoAceitar(i) {
    console.log(`✔ Aceite na linha ${i}`)
  }
  function acaoRejeitar(i) {
    console.log(`✖ Rejeitado na linha ${i}`)
  }
  </script>
  
  <style scoped>
  .gestao-container {
    padding: 2rem;
    position: relative;
    max-width: 100%;
    width: 100%;
    box-sizing: border-box;
  }
  
  .decoracao-fundo {
    background-color: #FDF7F7;
    position: absolute;
    top: 165px;
    left: 0;
    right: 0;
    height: 370px;
    z-index: 0;
    border-radius: 8px;
  }
  </style>
  