<template>
    <div class="perfil-container">
      <!-- Top bar com ícone, nome e botão -->
      <div class="top-bar">
        <div class="perfil-info">
          <User class="user-icon" />
          <span class="nome-utilizador">José Castro</span>
        </div>
        <Botao label="Editar" />
      </div>
  
      <!-- Conteúdo do perfil -->
      <div class="perfil-conteudo">
        <!-- Aqui virá o conteúdo do perfil -->
      </div>
    </div>
  </template>
  
  <script setup>
  import { User } from 'lucide-vue-next';
  import Botao from '@/components/Botao.vue';
  </script>
  
  <style scoped>
  .perfil-container {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  
  /* Top bar */
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }
  
  /* Ícone + nome */
  .perfil-info {
    margin-top: 30px;
    display: flex;
    align-items: center;
    gap: 20px;
  }
  
  /* Ícone User */
  .user-icon {
    width: 60px;
    height: 60px;
    color: #02020299;
  }
  
  /* Nome do utilizador */
  .nome-utilizador {
    font-size: 25px;
    font-weight: bold;
    color: #222;
  }
  
  /* Conteúdo do perfil */
  .perfil-conteudo {
    padding: 20px 0;
  }
  </style>
  