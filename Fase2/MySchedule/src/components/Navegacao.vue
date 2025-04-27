<template>
  <aside class="navegacao">
    <nav class="nav-links">
      <template v-if="tipoUtilizador === 'director'">
        <RouterLink to="/perfil" class="nav-link">Perfil</RouterLink>
        <RouterLink to="/unidades/director" class="nav-link">Unidades Curriculares</RouterLink>
        <RouterLink to="/horarios-dc" class="nav-link">Horário</RouterLink>
        <button class="nav-link" @click="$emit('abrir-caderno')">Caderno</button>
        <RouterLink to="/mensagens" class="nav-link mensagens-link">
          Mensagens
          <span v-if="mensagensNaoLidas > 0" class="badge">+{{ mensagensNaoLidas }}</span>
        </RouterLink>
        <RouterLink to="/gestao" class="nav-link">Gestão</RouterLink>
        <RouterLink to="/terminar" class="nav-link">Terminar Sessão</RouterLink>
      </template>

      <template v-else-if="tipoUtilizador === 'student'">
        <RouterLink to="/perfil" class="nav-link">Perfil</RouterLink>
        <RouterLink to="/unidades/student" class="nav-link">Unidades Curriculares</RouterLink>
        <RouterLink to="/horario-aluno" class="nav-link">Horário</RouterLink>
        <RouterLink to="/mensagens" class="nav-link mensagens-link">
          Mensagens
          <span v-if="mensagensNaoLidas > 0" class="badge">+{{ mensagensNaoLidas }}</span>
        </RouterLink>
        
        <!-- <RouterLink to="/terminar" class="nav-link">Terminar Sessão</RouterLink> -->
        <RouterLink to="/terminar" class="nav-link terminar-sessao">Terminar Sessão</RouterLink>

      </template>
    </nav>

    <div class="app-icon">
      <img src="@/components/icons/app-icon.png" alt="Ícone da Aplicação" class="footer-icon" />
    </div>
  </aside>
</template>

  
  <script setup>
  defineProps({
    tipoUtilizador: {
      type: String,
      required: true
    },
    mensagensNaoLidas: Number
  })
  defineEmits(['abrir-caderno']);
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
  z-index: 9999;
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
  background-color: #373737;
  width: 100%;
  display: block;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}
  
.nav-link:hover {
  background-color: #ffffff;
  color: #373737;
}

.nav-link.terminar-sessao {
  margin-top: 270px; 
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

  .mensagens-link {
  position: relative;
}

.badge {
  position: absolute;
  top: 3px;
  right: 15px;
  background-color: #F6E7B8;
  color: #373737;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  font-weight: bold;
}



@media (max-width: 768px) {
  .navegacao {
    width: 100px;
    padding-top: 70px;
  }

  .nav-link {
    padding: 1rem;
    font-size: 0.85rem;
  }

  .footer-icon {
    width: 100px;
  }

  .badge {
    top: 4px;
    right: 10px;
    padding: 2px 6px;
    font-size: 10px;
  }
}


</style>
  