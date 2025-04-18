<template>
    <div class="gestao-container">
      <!-- Retângulo de fundo decorativo -->
      <div class="decoracao-fundo"></div>
  
      <!-- Título -->
      <h1 class="titulo">Conflitos, Trocas de Turnos e Salas</h1>
  
      <!-- Tabela -->
      <div class="tabela-wrapper">
        <table class="tabela-gestao">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Número</th>
              <th>Estatuto</th>
              <th>Unidade Curricular</th>
              <th>Turno atual</th>
              <th>Alteração</th>
              <th>Capacidade</th>
              <th>Decisão</th>
            </tr>
          </thead>
  
          <tbody>
            <tr v-for="(item, index) in dados" :key="index">
              <td>{{ item.tipo }}</td>
              <td>{{ item.numero }}</td>
              <td>{{ item.estatuto }}</td>
              <td class="uc-cell">{{ item.uc }}</td>
              <td>{{ item.turnoAtual }}</td>
              <td>{{ item.alteracao }}</td>
              <td>{{ item.capacidade }}</td>
              <td>
                <span
                  v-if="item.decisao === 'Atualizar'"
                  class="acao atualizar"
                  @click="acaoAtualizar(index)"
                >
                  Atualizar
                </span>
                <span v-else class="acoes">
                  <span class="acao aceitar" @click="acaoAceitar(index)">✔</span>
                  <span class="acao rejeitar" @click="acaoRejeitar(index)">✖</span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
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
  
  function acaoAtualizar(i) {
    console.log(`Atualizar clicado na linha ${i}`);
  }
  function acaoAceitar(i) {
    console.log(`✔ Aceite na linha ${i}`);
  }
  function acaoRejeitar(i) {
    console.log(`✖ Rejeitado na linha ${i}`);
  }
  </script>
  
  <style scoped>
.gestao-container {
  padding: 2rem;
  position: relative;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  /* 🔥 REMOVER ESTA LINHA */
  /* overflow-x: hidden; */
}
/* Retângulo de fundo */
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

/* Título */
.titulo {
  margin-top: 50px;
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  color: #000;
  position: relative;
  z-index: 1;
  text-align: left; 
}

/* Wrapper da Tabela */
.tabela-wrapper {
  margin-top: 60px;
  overflow-y: auto;
  overflow-x: auto;
  max-height: 310px;
  position: relative;
  z-index: 1;
  border-radius: 6px;
}

/* Tabela */
.tabela-gestao {
  width: 100%;
  min-width: 850px;
  border-collapse: collapse;
  table-layout: fixed;
}

/* Células */
.tabela-gestao th,
.tabela-gestao td {
  padding: 0.5rem;
  border: 1px solid #ddd;
  text-align: center;
  font-size: 0.875rem;
  color: #000;
  background-color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Cabeçalho */
.tabela-gestao th {
  padding: 0.75rem 0.5rem;
}

.tabela-gestao thead th {
  background-color: #867D7D;
  color: black;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 2;
}

/* Evita corte no nome da UC */
.uc-cell {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: initial !important;
}

/* Ações */
.acao {
  cursor: pointer;
  margin: 0 5px;
  transition: color 0.2s ease;
}

.atualizar:hover {
  color: #3576E7;
}

.aceitar:hover {
  color: #4DAE54;
}

.rejeitar:hover {
  color: #B52525;
}

/* Responsivo */
@media (max-width: 768px) {
  .titulo {
    font-size: 1.4rem;
    margin-top: 40px;
  }

  .tabela-gestao {
    font-size: 0.75rem;
    min-width: 700px;
  }

  .tabela-wrapper {
    max-height: 260px;
  }

  .gestao-container {
    padding: 1rem;
  }
}
  </style>
  


  