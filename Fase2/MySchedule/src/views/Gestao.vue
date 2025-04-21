<template>
    <div class="gestao-container">
      <!-- Retângulo de fundo decorativo -->
      <div class="decoracao-fundo"></div>
  
      <!-- Tabela genérica -->
      <Tabela
        titulo="Conflitos, Trocas de Turnos e Salas"
        :colunas="colunas"
        :campos="campos"
        :dados="dados"
        @atualizar="acaoAtualizar"
        @aceitar="acaoAceitar"
        @rejeitar="acaoRejeitar"
      />
    </div>
  </template>
  
  <script setup>
  import Tabela from '@/components/Tabela.vue';
  import { ref, onMounted } from 'vue';
  
  const colunas = ['Tipo', 'Número', 'Estatuto', 'Unidade Curricular', 'Turno atual', 'Alteração', 'Capacidade', 'Decisão'];
  const campos = ['tipo', 'numero', 'estatuto', 'uc', 'turnoAtual', 'alteracao', 'capacidade', 'decisao'];
  
  const dados = ref([]);
  

  onMounted(async () => {
  const res = await fetch('http://localhost:3000/conflitos');
  const conflitos = await res.json();
  dados.value = conflitos;
});
  </script>
  
  <style scoped>
  .gestao-container {
    padding: 1rem;
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
  
  /* 🔽 Alterações específicas só nesta página */
  ::v-deep(.uc-cell) {
    width: 220px;
    white-space: normal;
    overflow: visible;
    text-overflow: initial;
  }
  
  ::v-deep(th:nth-child(4)) {
    width: 220px;
  }
  </style>
  
  