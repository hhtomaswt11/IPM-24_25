<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Sidebar from '@/components/Navegacao.vue';
import Caderno from '@/components/Caderno.vue';
import { useMensagensStore } from '@/stores/useMensagensStore';

const store = useMensagensStore();
const mensagensNaoLidas = computed(() => store.mensagensNaoLidas);
const mostrarCaderno = ref(false);
const route = useRoute();

function toggleCaderno() {
  mostrarCaderno.value = !mostrarCaderno.value;
}

let intervalo: number;

onMounted(() => {
  store.carregarMensagens();
  intervalo = setInterval(() => {
    store.carregarMensagens();
  }, 5000);
});

onUnmounted(() => {
  clearInterval(intervalo);
});
</script>

<template>
  <div :class="['app-container', { 'no-sidebar': route.name === 'Login' }]">
    <Sidebar
      v-if="route.name !== 'Login'"
      :mensagensNaoLidas="mensagensNaoLidas"
      tipoUtilizador="dc"
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

<style scoped>
/* Layout base seguro */
.app-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

/* Estilo padrão com sidebar */
.main-wrapper {
  flex: 1;
  margin-left: 150px;
  background-color: #fff;
  padding: 2rem;
}

/* Override para login */
.app-container.no-sidebar .main-wrapper {
  margin-left: 0;
  padding: 0;
}

/* Componente Caderno (se necessário) */
.caderno-wrapper {
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
}

@media (max-width: 768px) {
  .main-wrapper {
    margin-left: 100px;
    padding: 1rem;
  }
}
</style>
