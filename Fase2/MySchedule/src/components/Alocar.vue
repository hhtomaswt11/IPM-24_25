<template>
    <div v-if="visivel" class="overlay-fundo" @click.self="fecharOverlay">
      <transition name="slide-in">
        <div class="overlay-conteudo">
          <div class="lado-esquerdo">
            <div class="tabela-escala-wrapper">
                <TabelaHorario :horario="horarioVazio" tipo="pessoal" />
            </div>
          </div>
          <div class="lado-direito">
            <div class="info-item">
              <span class="label">Nome:</span>
              <span class="value">Roberto Freitas Almeida</span>
            </div>
            <div class="info-item">
              <span class="label">Número:</span>
              <span class="value">{{ aluno }}</span>
            </div>
            <!-- Botões -->
            <div class="botoes-wrapper">
                <button class="botao-opcao">Unidades Curriculares</button>
                <button class="botao-opcao">Turno Teórico</button>
                <button class="botao-opcao">Turno Prático</button>
            </div>
        </div>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue'
  import TabelaHorario from './TabelaHorario.vue'
  
  const props = defineProps({
    visivel: Boolean,
    aluno: String
  })
  
  // Criar tabela vazia com dias úteis e horas até às 18h
  const horarioVazio = reactive({
    dias: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
    horas: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
    shifts: [],
    courses: [],
    classrooms: []
  })
  
  const emit = defineEmits(['fechar'])
  
  function fecharOverlay() {
    emit('fechar')
  }
  </script>
  
  <style scoped>
  :global(html),
  :global(body) {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
  
  .overlay-fundo {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 99999;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .overlay-conteudo {
    display: flex;
    flex-direction: row;
    width: min(98vw, 1400px);
    height: min(95vh, 800px);
    max-height: 80%;
    background-color: white;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  }
  
  .lado-esquerdo {
    flex: 3;
    padding: 1.5rem;
    background-color: white;
    overflow-y: hidden;
    font-size: 1rem;
    
  }
  
  .lado-direito {
    flex: 2;
    background-color: #FFEFEF;
    overflow-y: auto;
    padding: 1.5rem;
    font-family: 'Inter', sans-serif;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 0.3rem;
  }
  
  .info-item {
    display: flex;
    gap: 0.5rem;
    font-size: 1rem;
    align-items: center;
  }
  
  .label {
    color: black;
    font-weight: 600;
  }
  
  .value {
    color: black;
    font-weight: 400;
  }
  
  .info-item:first-of-type {
    margin-top: 3rem;
  }
  
  /* Transições */
  .slide-in-enter-from {
    transform: translateX(100%);
    opacity: 0;
  }
  .slide-in-enter-active,
  .slide-in-leave-active {
    transition: all 0.4s ease;
  }
  .slide-in-enter-to {
    transform: translateX(0);
    opacity: 1;
  }
  .slide-in-leave-to {
    transform: translateX(100%);
    opacity: 0;
  }
  

  .tabela-escala-wrapper {
  transform: scale(0.75);
  transform-origin: top left;
  margin-top: 1.5rem;   /* sobe a tabela */
  margin-left: 4rem;  /* encosta mais à esquerda */
}


.botoes-wrapper {
  margin-top: 1.5rem;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.botao-opcao {
  background-color: #DF9898;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}


  
  /* Responsividade */
  @media (max-width: 768px) {
    .overlay-conteudo {
      width: 95vw;
      height: 90vh;
    }
  
    .lado-esquerdo,
    .lado-direito {
      padding: 1rem;
      font-size: 0.9rem;
    }
  }
  </style>
  