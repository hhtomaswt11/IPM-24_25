<template>
  <div class="container">
    <div class="left">
      <img src="/src/assets/main_logo.png" alt="Login Image" class="background-image" />
    </div>
    <div class="separator"></div>
    <!-- Formulário à direita -->
    <div class="right">
      <div class="form-container">
        <!-- Título -->
        <div class="title">
          <h1 class="heading">
            My<span class="highlight">Schedule</span><sup class="subscript">®</sup>
          </h1>
          <p class="description">Solution to schedule and class logistics</p>
        </div>

        <!-- Formulário de Login -->
        <form class="login-form" @submit.prevent="login">
          <div class="input-group">
            <label for="email" class="sr-only"></label>
            <div class="input-wrapper">
              <i class="fas fa-user"></i>
              <input
                type="email"
                id="email"
                required
                class="input-field"
                placeholder="Insira o seu endereço eletrónico"
                v-model="email"
              />
              <div class="bottom-border-email"></div>
            </div>
          </div>

          <!-- Campo de Password -->
          <div class="input-group">
            <label for="password" class="sr-only"></label>
            <div class="input-wrapper">
              <i class="fas fa-key"></i>
              <input
                type="password"
                id="password"
                required
                class="input-field"
                placeholder="Insira a sua palavra-passe"
                v-model="password"
              />
              <div class="bottom-border-password"></div>
            </div>
          </div>

          <!-- Mensagem de sucesso -->
          <div v-if="mensagemTemp" class="success-message">
            {{ mensagemTemp }}
          </div>

          <!-- Botão de Login -->
          <button type="submit" class="login-button">Iniciar Sessão</button>

          <!-- Mensagem de erro -->
          <p v-if="error" class="error-message">{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import * as api from '../api.ts'; // funções de login da API
import { useSessionStorage } from '@/stores/session.ts'; // store de sessão para guardar o login
import { useMensagensStore } from '@/stores/useMensagensStore'; // Importando a store de mensagens

export default {
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },

  computed: {
    mensagemTemp() {
      const store = useMensagensStore();
      return store.mensagemTemp; // A mensagem temporária da store
    }
  },

  methods: {
    async login() {
      this.error = '';  // resetar erro ao tentar logar
      try {
        let user = null;
        let userType = '';

        // Tenta autenticar o estudante
        user = await api.loginStudent(this.email, this.password);
        if (user) {
          userType = 'student';
        }

        // Se não for estudante, tenta autenticar o professor
        if (!user) {
          user = await api.loginTeacher(this.email, this.password);
          if (user) {
            userType = 'teacher';
          }
        }

        // Se não for nem estudante nem professor, tenta autenticar o diretor
        if (!user) {
          user = await api.loginDirector(this.email, this.password);
          if (user) {
            userType = 'director';
          }
        }

        // Se algum tipo de usuário foi encontrado, faz o login e redireciona
        if (user) {
          this.handleLogin(user, userType);
        } else {
          // Se não for possível fazer login, exibe a mensagem de erro
          this.error = 'Endereço eletrónico ou palavra-passe inválidos';
        }
      } catch (error) {
        // Se houver algum erro durante o login, exibe a mensagem de erro
        this.error = 'Ocorreu um erro ao tentar fazer login. Tente novamente.';
      }
    },

    handleLogin(user: any, type: string) {
      const session = useSessionStorage();
      // Usando as propriedades reativas diretamente
      session.id = user.id;  // atribuir o id do user à store
      session.name = user.name;  // atribuir o nome do user à store

      session.type = type;  // atribuir o tipo de user

      this.error = ''; // Resetar a mensagem de erro

      // Redireciona para a página de unidades
      this.$router.push('/unidades');
    }
  },

  beforeDestroy() {
    const store = useMensagensStore();
    store.limparMensagemTemp(); // Limpa a mensagem temporária após ser exibida
  }
};
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Container principal */
.container {
  display: flex;
  height: 100vh;
  width: 100vw;
}

/* Parte esquerda com a imagem */
.left {
  display: none;
  width: 50%;
  background-color: #f5f1e9;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Parte direita com o formulário */
.right {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #ffffff;
  padding: 2rem;
}

.form-container {
  width: 598px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}


.input-field::placeholder {
  font-size: 1.5rem; 
  color: #b8b6b6;   
}


/* Logo + Título */
.title {
  text-align: center;
}

.heading {
  padding-left: 15%;
  font-size: 6.5rem;
  font-weight: bold;
  color: #A6A6A6;
  line-height: 1.2;
}

.highlight { /* schedule */ 
  font-weight: bolder;
  color: #545050;
}

.subscript {
  font-size: 1rem;
  color: #6b7280;
  vertical-align: super;
}

.description {
  padding-left: 32%;
  font-size: 1.5rem;
  color: #716D6D;
  margin-top: 0.5rem;
}

/* Formulário */
.login-form {
  
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1.2rem;
}

.input-group {
  margin-top: 45px;
  padding-left: 40%;
  width: 140%;
}

.input-wrapper {
  position: relative;
  margin-top: 5%;
  width: 100%;
}

.input-wrapper i {
  font-family: 'Font Awesome 5 Free'; 
  font-weight: 900; 
  position: absolute;
  top: 50%;
  left: 90px;  
  transform: translateY(-50%);
  color: #9f9e9e; 
  font-size: 1.2rem;
  pointer-events: none; 
}

/* Ajustar a posição do campo do e-mail */
.input-group:first-of-type {
  margin-top: 40px; /* Aumenta a margem superior do primeiro campo de entrada */
}

/* Ajustar a posição do campo da password */
.input-group:last-of-type {
  margin-top: 0px;
}


.bottom-border-email,
.bottom-border-password {
  margin-bottom: -4px;
  width: 100%; 
  height: 2px;
  background-color: #9f9e9e; 
  position: absolute; 
  bottom: 0; 
  left: 0; 
}

.input-field {
  margin-bottom: -5px;
  width: 100%;
  height: 58px;
  text-align: center;
  padding: 1rem;

  padding-left: 35px; 

  background-color: #f5f3f3;
  border: 1px solid #e8e4da;

  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.input-field:focus {
  border-color: #6b7280;
  outline: none;
}

.login-button {
  
  width: 450.5px;
  height: 73px;
  background-color: #676766;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 2rem;
  transition: background-color 0.3s;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15%;
  margin-left: 65%; 
}

.login-button:hover {
  background-color: #4b5563;
}

/* Erros */
.error-message {
  margin-top: -15px;
  color: #be0000;
  font-size: 0.9rem;
  text-align: center;
  padding-left: 265px;
}

/* Mensagem de sucesso (sessão terminada) */
.success-message {
  font-size: 1rem;
  color: #c5bda6;
  margin-bottom: 20px;
  text-align: center;
  padding-right: 120px;
}

.separator {
  width: 15px; 
  background-color: #878376; 
  height: 100vh;
}

/* Ocultar em mobile */
@media (max-width: 767px) {
  .separator {
    display: none;
  }
}

/* Mostrar imagem lateral apenas em telas médias e grandes */
@media (min-width: 768px) {
  .left {
    display: block;
  }

  .right {
    width: 50%;
  }
}
</style>
