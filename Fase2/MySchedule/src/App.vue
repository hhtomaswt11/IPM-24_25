<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterView } from 'vue-router';
import Sidebar from '@/components/Navegacao.vue';
import Caderno from '@/components/Caderno.vue';
import { useMensagensStore } from '@/stores/useMensagensStore';

// Store
const store = useMensagensStore();
const mensagensNaoLidas = computed(() => store.mensagensNaoLidas);

// Carrega mensagens ao iniciar app
onMounted(() => {
  store.carregarMensagens();
});

const mostrarCaderno = ref(false);

function toggleCaderno() {
  mostrarCaderno.value = !mostrarCaderno.value;
}
</script>

<template>
  <div class="app-container">
    <Sidebar
      :mensagensNaoLidas="mensagensNaoLidas"
      @abrir-caderno="toggleCaderno"
    />

    <div class="main-wrapper">
      <main class="main-content">
        <RouterView />
      </main>
    </div>

    <Caderno v-if="mostrarCaderno" @fechar="toggleCaderno" />
  </div>
</template>

<style>
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

.mensagens-link {
  position: relative;
}

.link-text {
  display: inline-block;
}

.badge {
  background-color: #F6E7B8;
  color: #373737;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}
</style>
