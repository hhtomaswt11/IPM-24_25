<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Sidebar from '@/components/Navegacao.vue'; // Importando o componente Sidebar
</script>

<template>
  <div class="app-container">
    <!-- Barra de navegação como componente -->
    <Sidebar />

    <div class="main-wrapper">
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* Sem scroll geral */
}

.app-container {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.main-wrapper {
  width: calc(100% - 150px);
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
