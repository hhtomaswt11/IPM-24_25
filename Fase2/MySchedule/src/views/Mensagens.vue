<template>
  <div class="messages-container">
    <div class="top-bar">
      <Botao label="Nova Mensagem" />
      <SearchBar />
    </div>
  
      <div class="messages-boxes">
        <!-- Caixa de Mensagens Recebidas -->
        <div class="message-box received">
          <div class="header">Recebidas</div>
          <div class="message-list">
            <!-- Caixa vazia por enquanto -->
          </div>
        </div>
  
        <!-- Caixa de Mensagens Enviadas -->
        <div class="message-box sent">
          <div class="header">Enviadas</div>
          <div class="message-list">
            <!-- Caixa vazia por enquanto -->
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import SearchBar from '@/components/BarraPesquisa.vue';
  import Botao from '@/components/Botao.vue';
  </script>
  
  <style scoped>
  /* Container principal da página */
  .messages-container {
    display: flex;
    flex-direction: column;
    padding: 20px;
    margin-left: 60px; /* Espaço suficiente para a barra de navegação */
  }

  .top-bar {
  display: flex;
  width: 100%; /* Ocupar toda a largura disponível */
  justify-content: flex-end;
  gap: 20px; /* Adiciona espaço entre o botão e a barra */
  align-items: center; /* Centralizar verticalmente */
  margin-bottom: 20px; /* Espaço abaixo antes das caixas */
}
  
  .messages-boxes {
    display: flex;
    gap: 150px; /* Espaçamento entre os retângulos */
    margin-top: 50px; /* Distância da barra de navegação */
  }


  
  /* Caixa de mensagens */
  .message-box {
    width: 488px;  /* Largura fixa */
    height: 535px;  /* Altura fixa */
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2); /* Maior destaque com drop shadow */
    position: relative; /* Para garantir que o título se mova com a caixa */
  }
  
  .message-box .header {
  width: 146px;  /* Largura fixa para o título */
  height: 32px;  /* Altura fixa para o título */
  background-color: #ba7070; /* Cor do header */
  color: white;
  text-align: center;
  line-height: 32px;  /* Alinha o texto verticalmente */
  margin: 0 0 0 20px;  /* Margem superior e à esquerda para afastar o título */
  font-size: 18px;
  font-weight: bold;  /* Traz o texto para negrito */
  position: absolute; /* Fixa o título fora da caixa */
  top: -16px; /* Faz com que o header fique acima da caixa */
  left: 0;
  border-radius: 10px 10px 0 0; /* Cantos arredondados apenas no topo */
}
  
  /* Lista de mensagens */
  .message-list {
    padding: 15px;
    max-height: 400px;
    overflow-y: auto;
  }
  
  .message-item {
    background-color: #f9f9f9;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .received .header {
    background-color: #ba7070;
  }
  
  .sent .header {
    background-color: #ba7070;
  }
  
  /* Barra de navegação */
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 150px; /* Largura fixa da barra de navegação */
    height: 100vh;
    background-color: #373737;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 90px;
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
  </style>
  