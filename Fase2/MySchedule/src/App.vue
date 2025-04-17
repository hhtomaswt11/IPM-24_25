<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router'
import Sidebar from '@/components/Navegacao.vue'
import Caderno from '@/components/Caderno.vue';

const mostrarCaderno = ref(false);

function toggleCaderno() {
  mostrarCaderno.value = !mostrarCaderno.value;
}
</script>

<template>
  <div class="app-container">
    <!-- Sidebar com evento para abrir o caderno -->
    <Sidebar @abrir-caderno="toggleCaderno" />

    <!-- Conteúdo principal -->
    <div class="main-wrapper">
      <main class="main-content">
        <RouterView />
      </main>
    </div>

    <!-- Caderno Overlay -->
    <Caderno v-if="mostrarCaderno" @fechar="toggleCaderno" />
  </div>  
</template>

<style >
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.app-container {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.main-wrapper {
  margin-left: 150px; 
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
}
</style>
