<template>
  <transition name="fade" @after-leave="emit('fechado')">
    <div v-if="modelValue" class="overlay" @click="handleBackgroundClick">
      <div class="overlay-content">
        <!-- Ícones canto superior direito -->
        <div class="top-icons">
          <Reply
            v-if="!enviada"
            class="icon reply-icon"
            @click="emitResponder"
          />
          <Trash2 class="icon trash-icon" @click="apagarMensagem" />
        </div>

        <!-- Caixa cinza com os dados -->
        <div class="caixa-cinza">
          <div class="campos-superiores">
            <!-- Campo De ou Para -->
            <div class="campo">
              <div class="label-caixa">{{ enviada ? 'Para' : 'De' }}</div>
              <div class="linha-span">{{ enviada ? para : de }}</div>
            </div>

            <!-- Campo Assunto -->
            <div class="campo">
              <div class="label-caixa">Assunto</div>
              <div class="linha-span">{{ assunto }}</div>
            </div>
          </div>

          <!-- Mensagem -->
          <div class="mensagem-conteudo">
            {{ conteudo }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { Reply, Trash2 } from 'lucide-vue-next';

const props = defineProps({
  modelValue: Boolean,
  de: String,
  para: String,
  assunto: String,
  conteudo: String,
  enviada: Boolean
});

const emit = defineEmits(['update:modelValue', 'apagar', 'responder', 'fechado']);

function handleBackgroundClick(event) {
  if (event.target.classList.contains('overlay')) {
    emit('update:modelValue', false);
  }
}

function apagarMensagem() {
  emit('apagar');
  emit('update:modelValue', false);
}

function emitResponder() {
  emit('update:modelValue', false);
  emit('responder', props.de); 
}
</script>

  
  <style scoped>
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
    height: 500px;
    max-width: 95%;
    max-height: 90%;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }
  
  /* Ícones no topo */
  .top-icons {
    position: absolute;
    top: 45px;
    right: 60px;
    display: flex;
    gap: 20px;
  }
  .icon {
    cursor: pointer;
    width: 24px;
    height: 24px;
  }
  .reply-icon {
    color: black;
  }
  .trash-icon {
    color: #BA7070;
  }
  
  .caixa-cinza {
    margin-top: 0;
    width: 100%;
    height: 100%;
    background-color: #f8f8f8;
    border-radius: 8px;
    padding: 20px 30px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
    background-color: #fffbfb;
    border: 1px solid #cec9c9;
    padding: 10px 16px;
    font-weight: bold;
    color: rgba(2, 2, 2, 0.6);
    border-radius: 4px;
    font-size: 16px;
    white-space: nowrap;
  }
  
  .linha-span {
    display: inline-block;
    border-bottom: 1px solid #888;
    font-size: 16px;
    padding: 8px 4px;
    font-family: 'Meera Inimai', sans-serif;
    color: black;
  }
  
  .mensagem-conteudo {
    background-color: white;
    padding: 16px;
    border-radius: 6px;
    font-size: 15px;
    color: black;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
    height: 180px;
    overflow-y: auto;
    font-family: 'Meera Inimai', sans-serif;
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  
  .fade-enter-to,
  .fade-leave-from {
    opacity: 1;
  }
  </style>