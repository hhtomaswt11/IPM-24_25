<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <aside class="sidebar">
      <nav class="nav-links">
        <RouterLink to="/perfil" class="nav-link">Perfil</RouterLink>
        <RouterLink to="/unidades" class="nav-link">Unidades Curriculares</RouterLink>
        <RouterLink to="/horarios-dc" class="nav-link">Horário</RouterLink>
        <RouterLink to="/caderno" class="nav-link">Caderno</RouterLink>
        <RouterLink to="/mensagens" class="nav-link">Mensagens</RouterLink>
        <RouterLink to="/gestao" class="nav-link">Gestão</RouterLink>
        <RouterLink to="/terminar" class="nav-link">Terminar Sessão</RouterLink>
      </nav>

      <!-- Ícone da aplicação -->
      <div class="app-icon">
        <img src="@/components/icons/app-icon.png" alt="Ícone da Aplicação" class="footer-icon" />
      </div>
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
  padding-top: 90px; 
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
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

.app-icon {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -20px;
}

.footer-icon {
  width: 150px;
  height: auto;
}
</style>
