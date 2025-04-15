<template>
  <div class="tabela-wrapper" v-if="horario && horario.dias && horario.horas">
    <table class="tabela-horario">
      <thead>
        <tr>
          <th class="divisao"></th>
          <th class="dias" v-for="dia in horario.dias" :key="dia">{{ dia }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(hora, horaIndex) in horario.horas" :key="hora">
          <td class="hora-coluna">{{ hora }}</td>
          <template v-for="(dia, diaIndex) in horario.dias" :key="dia">
            <td v-if="!isCelulaOcupada(horaIndex, diaIndex)" :rowspan="getRowspan(hora, dia)">
              <div class="aulas-container">
                <div v-for="(aula, index) in getAulas(hora, dia)" :key="index" class="aula" :class="{
                    'aula-total': aula.capacidade === 'total',
                    'aula-parcial': aula.capacidade === 'parcial',
                    'aula-livre': !aula.capacidade || aula.capacidade === 'livre'
                  }"
                >
                  {{ aula.disciplina }}<br />
                  {{ aula.tp }}<br />
                  {{ aula.sala }}
                </div>
              </div>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['horario']);

// Marca as células ocupadas por rowspans de aulas
const celulaOcupada = computed(() => {
  const matriz = {};

  if (!props.horario || !props.horario.shifts) return matriz;

  props.horario.shifts.forEach(shift => {
    const horaIndex = props.horario.horas.indexOf(`${shift.from}:00`);
    const diaIndex = props.horario.dias.indexOf(shift.day);

    if (horaIndex >= 0 && diaIndex >= 0) {
      const duracao = shift.to - shift.from;
      for (let i = 1; i < duracao; i++) {
        const key = `${horaIndex + i}-${diaIndex}`;
        matriz[key] = true;
      }
    }
  });

  return matriz;
});

function isCelulaOcupada(horaIndex, diaIndex) {
  return celulaOcupada.value[`${horaIndex}-${diaIndex}`] === true;
}

function getAulas(hora, dia) {
  if (!props.horario || !props.horario.shifts) return [];
  
  const horaNum = parseInt(hora.split(':')[0]);
  
  return props.horario.shifts
    .filter(shift => shift.from === horaNum && shift.day === dia)
    .map(shift => {
      // Encontrar informações relacionadas
      const course = props.horario.courses.find(c => c.id === shift.courseId) || {};
      const classroom = props.horario.classrooms.find(c => c.id === shift.classroomId) || {};
      
      // Determinar capacidade com base em totalStudentsRegistered
      let capacidade = 'livre';
      if (shift.totalStudentsRegistered > 50) {
        capacidade = shift.totalStudentsRegistered >= classroom.capacity ? 'total' : 'parcial';
      }
      
      return {
        disciplina: course.abbreviation || 'Unknown',
        tp: `${shift.name}`,
        sala: classroom.name || 'Unknown',
        capacidade: shift.capacity,
        duracao: shift.to - shift.from
      };
    });
}

function getRowspan(hora, dia) {
  const aulas = getAulas(hora, dia);
  if (aulas.length === 0) return 1;
  return Math.max(...aulas.map(aula => aula.duracao || 1));
}
</script>

<style scoped>
.tabela-wrapper {
  overflow-x: auto;
  max-width: 100%;
  margin-bottom: 60px;
}

.tabela-horario {
  table-layout: fixed;
  border-collapse: collapse;
  width: 100%;
  text-align: center;
  font-size: 0.875rem;
  color: #000000;
}

th,
td {
  width: 120px;
  height: 60px;
  border: 1px solid #727272;
  overflow: hidden;
  padding: 6px;
  vertical-align: top;
}

.divisao{
  background-color: white;
  border : 0px;
}

.dias{
  font-weight: bold;
  background-color: #B9B9B9;
}

.hora-coluna {
  font-weight: bold;
  background-color: #B9B9B9;
  width: 80px;
}

.aulas-container {
  display: flex;
  gap: 5px;
  height: 100%;
  width: 100%;
}

.aula {
  flex: 1;
  padding: 6px;
  border-radius: 6px;
  font-size: 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  overflow: hidden;
}

.aula-total {
  background-color: #fca5a5;
}

.aula-parcial {
  background-color: #fde68a;
}

.aula-livre {
  background-color: #EBE7E1;
}
</style>