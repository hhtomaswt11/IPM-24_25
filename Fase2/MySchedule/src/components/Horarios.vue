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
  
      <HorarioAno
        v-for="(horario, index) in horarios.anos"
        :key="index"
        :titulo="horario.titulo"
        :horario="horario"
      />
    </div>
  </template>
  
  <script setup>
  import HorarioAno from './HorarioAno.vue'
  import horarios from '@/assets/horarios.json'
  </script>
  
  <style scoped>
  .pagina-horarios {
    padding: 1rem;
    max-width: 1200px;
    margin: 0 auto;
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