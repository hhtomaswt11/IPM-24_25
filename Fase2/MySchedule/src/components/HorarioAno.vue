<template>
    <div class="secao-horario">
      <h2 class="titulo-horario">{{ titulo }}</h2>
      <TabelaHorario :horario="horario" />
    </div>
</template>
  
<script setup>
  import TabelaHorario from './TabelaHorario.vue'
  
  const props = defineProps({
    titulo: {
        type: String,
        required: true
    },
    horario: {
        type: Object,
        required: true
    }
    })
    
</script>
  
  <style scoped>
  .secao-horario {
    margin-bottom: 2.5rem;
  }
  
  .titulo-horario {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  </style>