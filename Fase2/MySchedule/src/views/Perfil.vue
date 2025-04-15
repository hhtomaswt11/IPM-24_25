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
        <div class="perfil-colunas">
          <!-- Coluna da esquerda -->
          <div class="coluna">
            <div class="campo">
              <div class="label">Nome completo</div>
              <div class="valor">José Pedro Castro</div>
            </div>
            <div class="campo">
              <div class="label">Endereço eletrônico</div>
              <div class="valor">jose@di.uminho.pt</div>
            </div>
            <div class="campo">
              <div class="label">Data de nascimento</div>
              <div class="valor">12/01/1980</div>
            </div>
            <div class="campo">
              <div class="label">Código Postal</div>
              <div class="valor">
                Rua 10 de Junho<br />
                4704-514 - BRAGA<br />
                Portugal
              </div>
            </div>
            <div class="campo">
              <div class="label">Sexo</div>
              <div class="valor">Masculino</div>
            </div>
          </div>
  
          <!-- Coluna da direita -->
          <div class="coluna">
            <div class="campo">
              <div class="label">Cargos</div>
              <div class="valor">
                Diretor do curso de Engenharia Informática<br />
                Docente do Ensino Superior
              </div>
            </div>
            <div class="campo">
              <div class="label">Departamento</div>
              <div class="valor">Escola de Engenharia</div>
            </div>
            <div class="campo">
              <div class="label">Telefone</div>
              <div class="valor">(+351) 939999999</div>
            </div>
          </div>
        </div>
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
    margin-top: 10px;
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
    font-size: 28px;
    font-weight: bold;
    color: #222;
  }
  
  /* Conteúdo do perfil */
  .perfil-conteudo {
    margin-top:30px;
    padding: 20px 0;
    margin-left: 50px; /* Aumenta espaço à esquerda */
  }
  
  /* Duas colunas */
  .perfil-colunas {
    display: flex;
    justify-content: space-between;
    gap: 100px;
  }
  
  /* Cada coluna */
  .coluna {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  
  /* Estilo dos campos */
  .campo .label {
    font-weight: bold;
    color: #222;
    font-size: 20px;
    margin-bottom: 5px;
  }
  
  .campo .valor {
    color: #444;
    font-size: 18px;
  }
  </style>
  