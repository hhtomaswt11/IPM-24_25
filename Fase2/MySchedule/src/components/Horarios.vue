<template>
  <div class="pagina-horarios">
    <div class="legenda">
      <div class="legenda-item">
        <div class="cor-example capacidade-total"></div>
        <span>Capacidade Total</span>
      </div>
      <div class="legenda-item">
        <div class="cor-example capacidade-parcial"></div>
        <span>Capacidade Parcial</span>
      </div>
    </div> 
    <HorarioAno v-for="(horario, index) in processedHorarios" :key="index" :titulo="horario.titulo" :horario="horario"/>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import HorarioAno from './HorarioAno.vue';
import jsonData from '@/database/trabalhodb.json'; 

// Dias da semana para a tabela
const dias = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Horas para a tabela
const horas = [];
for (let i = 9; i <= 18; i++) {
  if(i==9) {
    horas.push(`0${i}:00`);
  } else {
    horas.push(`${i}:00`);
  }
}

// Processa os horários por ano/semestre
const processedHorarios = computed(() => {
  const result = [];
  
  // Agrupa cursos por ano
  const coursesByYear = {};
  jsonData.courses.forEach(course => {
    const key = `${course.year}-${course.semester}`;
    if (!coursesByYear[key]) {
      coursesByYear[key] = [];
    }
    coursesByYear[key].push(course);
  });
  
  // Cria um horário para cada ano/semestre
  Object.keys(coursesByYear).forEach(yearSem => {
    const [year, semester] = yearSem.split('-');
    
    // Obter IDs dos cursos para este ano/semestre
    const courseIds = coursesByYear[yearSem].map(c => c.id);
    
    // Filtrar turnos para estes cursos
    const yearShifts = jsonData.shifts.filter(s => courseIds.includes(s.courseId));
    
    // Adicionar ao resultado
    result.push({
      titulo: `${year}º Ano - ${semester}º Semestre`,
      dias: dias,
      horas: horas,
      shifts: yearShifts,
      courses: jsonData.courses,
      classrooms: jsonData.classrooms
    });
  });
  
  return result;
});
</script>
  
  <style scoped>
  .pagina-horarios {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
}


  .legenda {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    justify-content: flex-end;
  }
  
  .legenda-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .legenda-item span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #3E3E3E
  }
  
  .cor-example {
    width: 20px;
    height: 20px;
    border-radius: 4px;
  }
  
  .capacidade-total {
    background-color: #fca5a5;
  }
  
  .capacidade-parcial {
    background-color: #fde68a;
  }
  </style>