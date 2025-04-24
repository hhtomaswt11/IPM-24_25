   <template>
    <div class="container">
      <div class="message-container">
        <h1>Sessão Terminada</h1>
        <p class="success-message">A sua sessão foi terminada com sucesso.</p>
        <router-link to="/login" class="login-link">Voltar para o Login</router-link>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { useMensagensStore } from '@/stores/useMensagensStore'; // Importando a store de mensagens
  import { useSessionStorage } from '@/stores/session'; // Importando a store de sessão
  
  export default {
    mounted() {
      this.terminarSessao(); // Chama a função para terminar a sessão ao carregar a página
    },
  
    methods: {
      terminarSessao() {
        const session = useSessionStorage(); // Obtém a store de sessão
        const mensagensStore = useMensagensStore(); // Obtém a store de mensagens
  
        session.logout(); // Chama a ação de logout para resetar os dados da sessão
  
        mensagensStore.setMensagemTemp('Sessão terminada com sucesso'); // Define a mensagem de sucesso
  
        // Redireciona para a página de login
        this.$router.push('/login'); 
      }
    }
  }
  </script>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  
  .message-container {
    text-align: center;
  }
  
  .success-message {
    font-size: 1.5rem;
    color: #4caf50; /* Verde para sucesso */
    margin-bottom: 20px;
  }
  
  .login-link {
    font-size: 1.2rem;
    color: #007bff;
    text-decoration: none;
  }
  
  .login-link:hover {
    text-decoration: underline;
  }
  </style>
  