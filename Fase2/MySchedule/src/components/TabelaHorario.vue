<template>
  <div class="tabela-wrapper" v-if="horario && horario.dias && horario.horas">
    <table class="tabela-horario">
      <thead>
        <tr>
          <th></th>
          <th v-for="dia in horario.dias" :key="dia">{{ dia }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(hora, horaIndex) in horario.horas" :key="hora">
          <td class="hora-coluna">{{ hora }}</td>
          <template v-for="(dia, diaIndex) in horario.dias" :key="dia">
            <td v-if="!isCelulaOcupada(horaIndex, diaIndex)" :rowspan="getRowspan(hora, dia)">
              <div 
                  v-for="(aula, index) in getAulas(hora, dia)" :key="index" class="aula" :class="{
                    'aula-total': aula.capacidade === 'total',
                    'aula-parcial': aula.capacidade === 'parcial',
                    'aula-livre': !aula.capacidade || aula.capacidade === 'livre'
                  }"
                >
                <strong>{{ aula.disciplina }}</strong><br />
                {{ aula.tp }}<br />
                <small>{{ aula.sala }}</small>
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

// Marcar células ocupadas por rowspans de aulas
const celulaOcupada = computed(() => {
  const matriz = {};

  if (!props.horario || !props.horario.aulas) return matriz;

  props.horario.aulas.forEach(aula => {
    const horaIndex = props.horario.horas.indexOf(aula.hora);
    const diaIndex = props.horario.dias.indexOf(aula.dia);

    if (horaIndex >= 0 && diaIndex >= 0) {
      for (let i = 1; i < aula.duracao; i++) {
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
  return props.horario.aulas.filter(a => a.hora === hora && a.dia === dia);
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
}

.tabela-horario {
  border-collapse: collapse;
  width: 100%;
  text-align: center;
  font-size: 0.875rem;
}

th,
td {
  border: 1px solid #ccc;
  padding: 6px;
  vertical-align: top;
  height: 60px;
}

.hora-coluna {
  font-weight: bold;
  background-color: #f1f1f1;
  width: 80px;
}

.aula {
  padding: 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.aula-total {
  background-color: #fca5a5;
}

.aula-parcial {
  background-color: #fde68a;
}

.aula-livre {
  background-color: #d1d5db;
}
</style>