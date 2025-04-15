<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Sidebar from '@/components/Navegacao.vue'; // Importando o componente Sidebar
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
