<template>
    <div class="pagina">
      <TabelaHorario :horario="horarioCurso" tipo="curso"/>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import TabelaHorario from '@/components/TabelaHorario.vue'
  
  // Dados simulados
  const alunoId = 1
  import { allocations, shifts, courses, classrooms } from '@/database/trabalhodb.json'
  
  const dias = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  
  const horas = []
  for (let i = 9; i <= 18; i++) {
    horas.push((i < 10 ? "0" : "") + i + ":00")
  }
  
  const turnoAluno = computed(() => {
    const turnoIds = allocations.filter(a => a.studentId === alunoId).map(a => a.shiftId)
    return shifts.filter(s => turnoIds.includes(s.id))
  })

  const horarioCurso = computed(() => ({
    //titulo: `${year}º Ano - ${semester}º Semestre`,
    dias,
    horas,
    shifts: turnoAluno.value,
    courses,
    classrooms
  }))
  </script>
  
  <style scoped>
  .pagina {
    padding: 1rem;
  }
  </style>
  