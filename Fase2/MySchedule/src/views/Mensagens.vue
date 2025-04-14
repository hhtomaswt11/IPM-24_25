<template>
  <div class="messages-container">
    <div class="top-bar">
      <Botao label="Nova Mensagem" @click="abrirOverlay" />
      <SearchBar />
    </div>

    <div class="messages-boxes">
      <div class="message-box received">
        <div class="header">Recebidas</div>
        <div class="message-list"></div>
      </div>

      <div class="message-box sent">
        <div class="header">Enviadas</div>
        <div class="message-list"></div>
      </div>
    </div>

    <!-- Usa o componente NovaMensagem -->
    <EnviarMensagem v-model="showOverlay">
    </EnviarMensagem>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SearchBar from '@/components/BarraPesquisa.vue';
import Botao from '@/components/Botao.vue';
import EnviarMensagem from '@/components/EnviarMensagem.vue'; // Importa o componente que criaste!

const showOverlay = ref(false);

function abrirOverlay() {
  showOverlay.value = true;
}

function fecharOverlay() {
  showOverlay.value = false;
}
</script>

<style scoped>
/* Container principal */
.messages-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  margin-left: 60px;
}

.top-bar {
  display: flex;
  width: 100%;
  justify-content: flex-end;
  gap: 20px;
  align-items: center;
  margin-bottom: 20px;
}

.messages-boxes {
  display: flex;
  gap: 150px;
  margin-top: 50px;
}

/* Caixa de mensagens */
.message-box {
  width: 488px;
  height: 535px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  position: relative;
}

.message-box .header {
  width: 146px;
  height: 32px;
  background-color: #ba7070;
  color: white;
  text-align: center;
  line-height: 32px;
  margin: 0 0 0 20px;
  font-size: 18px;
  font-weight: bold;
  position: absolute;
  top: -10px;
  left: 0;
  border-radius: 10px 10px 0 0;
}

.message-list {
  padding: 15px;
  max-height: 400px;
  overflow-y: auto;
}

.message-item {
  background-color: #f9f9f9;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.received .header {
  background-color: #ba7070;
}

.sent .header {
  background-color: #ba7070;
}

/* Barra de navegação */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 150px;
  height: 100vh;
  background-color: #373737;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 90px;
  justify-content: flex-start;
}

.nav-links {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.nav-link {
  padding: 1.5rem;
  text-decoration: none;
  color: white;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid #444;
  transition: background-color 0.3s, color 0.3s;
}

.nav-link:hover {
  background-color: #ffffff;
  color: #373737;
}

.nav-link.router-link-exact-active {
  background-color: #ffffff;
  color: #373737;
}
</style>
