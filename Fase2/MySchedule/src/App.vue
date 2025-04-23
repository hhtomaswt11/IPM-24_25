<!-- <script setup lang="ts">
import { ref, computed, onMounted, onUnmounted} from 'vue';
import { RouterView } from 'vue-router';
import Sidebar from '@/components/Navegacao.vue';
import Caderno from '@/components/Caderno.vue';
import { useMensagensStore } from '@/stores/useMensagensStore';

const store = useMensagensStore();
const mensagensNaoLidas = computed(() => store.mensagensNaoLidas);

const mostrarCaderno = ref(false);

function toggleCaderno() {
  mostrarCaderno.value = !mostrarCaderno.value;
}

let intervalo: number;

onMounted(() => {
  store.carregarMensagens(); // Atualiza no início
  intervalo = setInterval(() => {
    store.carregarMensagens(); // Atualiza a cada 5 segundos
  }, 5000);
});

onUnmounted(() => {
  clearInterval(intervalo);
});
</script>


<template>
  <div class="app-container">
    <Sidebar
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

@media (max-width: 768px) {
  .main-wrapper {
    margin-left: 100px;
    width: calc(100% - 100px);
  }
}

</style> -->




































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
