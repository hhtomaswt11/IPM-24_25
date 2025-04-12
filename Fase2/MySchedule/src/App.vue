<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
<<<<<<< HEAD
  <div class="app-container">
    <aside class="sidebar">
      <nav class="nav-links">
        <RouterLink to="/perfil">Perfil</RouterLink>
        <RouterLink to="/unidades">Unidades Curriculares</RouterLink>
        <RouterLink to="/horarios-dc">Horário</RouterLink>
        <RouterLink to="/caderno">Caderno</RouterLink>
        <RouterLink to="/mensagens">Mensagens</RouterLink>
        <RouterLink to="/gestao">Gestão</RouterLink>
        <RouterLink to="/terminar">Terminar Sessão</RouterLink>
      </nav>
    </aside>

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

.sidebar {
  width: 150px;
  background-color: #373737;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 1rem;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
}

.nav-links {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.nav-links a {
  padding: 1.5rem;
  text-decoration: none;
  color: white;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid #444;
  transition: background-color 0.3s;
}

.nav-links a:hover {
  background-color: #555; 
}

.nav-links a.router-link-exact-active {
  background-color: #ffffff; 
  color: black;
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
  max-width: 1400px; /* Opcional para limitar muito grandes */
}
</style>