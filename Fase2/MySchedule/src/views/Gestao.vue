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
  
  const colunas = ['Tipo', 'Número', 'Estatuto', 'Unidade Curricular', 'Turno atual', 'Alteração', 'Capacidade', 'Decisão'];
  const campos = ['tipo', 'numero', 'estatuto', 'uc', 'turnoAtual', 'alteracao', 'capacidade', 'decisao'];
  
  const dados = [
    { tipo: 'Troca de turno', numero: 'a100', estatuto: 'Não', uc: 'Álgebra para Engenharia', turnoAtual: 'T1', alteracao: 'T2', capacidade: '50/60', decisao: '✔ ✖' },
    { tipo: 'Troca de turno', numero: 'a101', estatuto: 'TE', uc: 'Cálculo para Engenharia', turnoAtual: 'TP1', alteracao: 'TP3', capacidade: '25/26', decisao: '✔ ✖' },
    { tipo: 'Conflito', numero: 'a100', estatuto: 'Não', uc: 'Laboratórios de Informática I', turnoAtual: 'PL4', alteracao: 'Seleciona', capacidade: '-----', decisao: 'Atualizar' },
    { tipo: 'Troca de turno', numero: 'a103', estatuto: 'Não', uc: 'Lógica', turnoAtual: 'T1', alteracao: 'T2', capacidade: '98/100', decisao: '✔ ✖' },
    { tipo: 'Troca de sala', numero: 'di100', estatuto: 'Não', uc: 'Interface Pessoa-Máquina', turnoAtual: 'T1', alteracao: 'Seleciona', capacidade: '-----', decisao: 'Atualizar' },
    { tipo: 'Troca de turno', numero: 'a100', estatuto: 'Não', uc: 'Álgebra para Engenharia', turnoAtual: 'T1', alteracao: 'T2', capacidade: '50/60', decisao: '✔ ✖' },
    { tipo: 'Troca de turno', numero: 'a101', estatuto: 'TE', uc: 'Cálculo para Engenharia', turnoAtual: 'TP1', alteracao: 'TP3', capacidade: '25/26', decisao: '✔ ✖' },
    { tipo: 'Conflito', numero: 'a100', estatuto: 'Não', uc: 'Laboratórios de Informática I', turnoAtual: 'PL4', alteracao: 'Seleciona', capacidade: '-----', decisao: 'Atualizar' },
    { tipo: 'Troca de turno', numero: 'a103', estatuto: 'Não', uc: 'Lógica', turnoAtual: 'T1', alteracao: 'T2', capacidade: '98/100', decisao: '✔ ✖' },
    { tipo: 'Troca de sala', numero: 'di100', estatuto: 'Não', uc: 'Interface Pessoa-Máquina', turnoAtual: 'T1', alteracao: 'Seleciona', capacidade: '-----', decisao: 'Atualizar' },
  ];
  
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
  
  