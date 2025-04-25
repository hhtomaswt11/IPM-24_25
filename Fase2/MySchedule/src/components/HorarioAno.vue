<template>
  <div class="seccao-horario">
    <h2 class="titulo-horario">{{ titulo }}</h2>
    <TabelaHorario :horario="horario" />
  </div>
</template>

<script setup>
import TabelaHorario from './TabelaHorario.vue';

defineProps({
  titulo: String,
  horario: Object
});
</script>

  <style scoped>
  .seccao-horario {
    margin-bottom: 2.5rem;
  }
  
  .titulo-horario {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 2rem;
    color: #3E3E3E
  }
  </style>