<template>
    <transition name="fade">
      <div v-if="modelValue" class="overlay" @click="handleBackgroundClick">
        <div class="overlay-content">
          <!-- Botão Enviar -->
          <div class="send-button-container">
            <Botao @click="emitSend">
              <div class="content-button">
                <SendHorizontal class="icon" />
                <span class="text-button">Enviar</span>
              </div>
            </Botao>
          </div>
  
          <!-- Retângulo cinza -->
          <div class="caixa-cinza">
            <div class="campos-superiores">
              <!-- Campo Para -->
              <div class="campo">
                <div class="label-caixa">Para</div>
                <input v-model="para" type="text" class="linha-input" />
              </div>
  
              <!-- Campo Assunto com dropdown e ícone personalizado -->
              <div class="campo">
                <div class="label-caixa">Assunto</div>
  
                <div class="select-wrapper">
                  <select v-model="tipoAssunto" class="linha-input custom-select">
                    <option disabled value="">Seleciona</option>
                    <option value="Troca de Turno">Troca de Turno</option>
                    <option value="Outro">Outro</option>
                  </select>
                  <ChevronDown class="select-icon" />
                </div>
  
                <input
                  v-if="tipoAssunto === 'Outro'"
                  v-model="assuntoPersonalizado"
                  type="text"
                  class="linha-input"
                  placeholder="Escreva o assunto"
                />
              </div>
            </div>
  
            <textarea
              v-model="mensagem"
              placeholder="Escreva a sua mensagem"
              class="textarea-mensagem"
            ></textarea>
          </div>
  
          <slot />
        </div>
      </div>
    </transition>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import { defineProps, defineEmits } from 'vue';
  import { SendHorizontal, ChevronDown } from 'lucide-vue-next';
  import Botao from '@/components/Botao.vue';
  
  const props = defineProps({
    modelValue: Boolean,
    paraInicial: String,
  });
  
  const emit = defineEmits(['update:modelValue', 'send', 'notificar']);
  
  const para = ref(props.paraInicial || '');
  const tipoAssunto = ref('Troca de Turno'); // default
  const assuntoPersonalizado = ref('');
  const mensagem = ref('');
  
  watch(() => props.paraInicial, (novoValor) => {
    para.value = novoValor || '';
  });
  
  function handleBackgroundClick(event) {
    if (event.target.classList.contains('overlay')) {
      emit('update:modelValue', false);
    }
  }
  
  function emitSend() {
    if (para.value.trim() === '') {
      alert('Preencha o campo "Para" antes de enviar.');
      return;
    }
  
    const assuntoFinal = tipoAssunto.value === 'Outro' ? assuntoPersonalizado.value.trim() : tipoAssunto.value;
  
    if (assuntoFinal === '') {
      alert('Preencha o campo "Assunto" antes de enviar.');
      return;
    }
  
    emit('send', {
      para: para.value,
      assunto: assuntoFinal,
      conteudo: mensagem.value
    });
  
    emit('update:modelValue', false);
    emit('notificar');
  }
  </script>
  
  <style scoped>
  /* Igual ao EnviarMensagem.vue – pode copiar os estilos diretamente se for partilhado */
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .overlay-content {
    position: relative;
    background-color: white;
    padding: 30px 40px;
    border-radius: 10px;
    width: 920px;
    height: 585px;
    max-width: 95%;
    max-height: 90%;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }
  
  .send-button-container {
    position: absolute;
    left: 45px;
    top: 35px;
  }
  
  .send-button-container .botao {
    width: 140px;
    height: 50px;
    font-size: 17px;
    border-radius: 0;
    padding-left: 12px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
  }
  
  .content-button {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  
  .icon {
    width: 18px;
    height: 18px;
    color: #BA7070;
    transition: color 0.3s ease;
  }
  
  .text-button {
    color: rgba(0, 0, 0, 0.718);;
    font-weight: bold;
    transition: color 0.3s ease;
  }
  
  .send-button-container .botao:hover {
    background-color: #DF9898;
  }
  
  .send-button-container .botao:hover .icon,
  .send-button-container .botao:hover .text-button {
    color: #FFFFFF;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-to, .fade-leave-from {
    opacity: 1;
  }
  
  .caixa-cinza {
    margin-top: 100px;
    width: 830px;
    height: 400px;
    background-color: #F8F8F8;
    border-radius: 8px;
    margin-left: auto;
    margin-right: auto;
    padding: 20px 30px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
  
  .textarea-mensagem {
    width: 100%;
    height: 100%;
    background-color: white;
    border: none;
    border-radius: 6px;
    padding: 12px;
    resize: none;
    font-size: 16px;
    font-family: 'Meera Inimai', sans-serif;
    color: black;
    box-shadow: 0px 0px 4px rgba(0,0,0,0.1);
  }
  
  .textarea-mensagem:focus {
    outline: none;
    box-shadow: 0 0 6px rgba(0,0,0,0.3);
  }
  
  .campos-superiores {
    display: flex;
    flex-direction: column;
    gap: 25px;
    margin-bottom: 20px;
  }
  
  .campo {
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  .label-caixa {
    background-color: #FFFBFB;
    border: 1px solid #CEC9C9;
    padding: 10px 16px;
    font-weight: bold;
    color: rgba(2, 2, 2, 0.6);
    border-radius: 4px;
    font-size: 16px;
    white-space: nowrap;
  }
  
  .linha-input {
    width: 300px;
    height: 30px;
    background-color: #888;
    border: none;
    border-bottom: 1px solid #888;
    font-size: 16px;
    padding: 8px 4px;
    background: transparent;
    font-family: 'Meera Inimai', sans-serif;
  }
  
  .linha-input:focus {
    outline: none;
    border-bottom: 2px solid #BA7070;
  }
  
  /* Novos estilos para o dropdown */
  .select-wrapper {
    position: relative;
    display: inline-block;
  }
  
  .custom-select {
    appearance: none;
    width: 250px;
    height: 30px;
    padding-right: 25px;
    cursor: pointer;
    border-bottom: none; /* Remove a linha após selecionar */
  }
  
  .select-icon {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    width: 16px;
    height: 16px;
    color: #888;
  }
  
  /* Estilize as opções do dropdown */
  .custom-select option {
    background-color: #FFFBFB;
    color: rgba(2, 2, 2, 0.6);
    padding: 8px;
    font-size: 14px;
    border: none;
  }
  
  /* Remover o contorno quando focado */
  .custom-select:focus {
    outline: none;
    border-bottom: none;
  }
  </style>