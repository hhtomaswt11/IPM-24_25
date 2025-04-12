<template>
    <aside class="navegacao">
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
  </template>
  
  <script setup>
  // Não há necessidade de lógica no componente navegacao
  </script>
  
  <style scoped>
  .navegacao {
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
    z-index: 9999; /* Garantir que a sidebar fique por cima de tudo */
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
  