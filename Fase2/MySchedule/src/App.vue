<script setup lang="ts">
import { ref, provide } from 'vue';
import { RouterView } from 'vue-router';
import Sidebar from '@/components/Navegacao.vue';

// Simulação do tipo de utilizador: 'aluno' ou 'dc'
const userType = ref<'aluno' | 'dc'>('aluno'); // troca para 'dc' se quiseres testar o outro

// Disponibiliza o tipo de utilizador globalmente
provide('userType', userType);
</script>

<template>
  <div class="app-container">
    <Sidebar />

    <div class="main-wrapper">
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style >
html, body, #app {
  height: 100%;
  width: 100%;
  margin: 10;
  padding: 0;
}

.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.main-wrapper {
  flex: 1;  
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #fff;
  padding: 2rem;
  box-sizing: border-box;
}

.main-content {
  width: 100%;
  max-width: 1400px;
}
</style>
