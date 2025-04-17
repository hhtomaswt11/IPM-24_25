<template>
  <div class="perfil-container">
    <div class="top-bar">
      <div class="perfil-info">
        <User class="user-icon" />
        <span class="nome-utilizador">{{ diretor.name }}</span>
      </div>
      <Botao v-if="!editando" label="Editar" @click="ativarEdicao" />
      <Botao v-else label="Guardar" @click="guardarAlteracoes" />
    </div>

    <!-- Conteúdo do perfil -->
    <div class="perfil-conteudo">
      <div class="perfil-colunas">
        <!-- Coluna da esquerda -->
        <div class="coluna">
          <div class="campo">
            <div class="label">Nome completo</div>
            <div class="valor">{{ diretor.name }}</div>
          </div>
          <div class="campo">
            <div class="label">Endereço eletrônico</div>
            <div class="valor">
              <input v-if="editando" v-model="novoEmail" />
              <span v-else>{{ diretor.email }}</span>
            </div>
          </div>
          <div class="campo">
            <div class="label">Data de nascimento</div>
            <div class="valor">{{ diretor.nascimento }}</div>
          </div>
          <div class="campo">
            <div class="label">Morada</div>
            <div class="valor">
              {{ diretor.morada.split(',')[0] }},
              <br />
              {{ diretor.morada.split(',').slice(1).join(',') }}
            </div>
          </div>
          <div class="campo">
            <div class="label">Sexo</div>
            <div class="valor">{{ diretor.sexo }}</div>
          </div>
        </div>

        <!-- Coluna da direita -->
        <div class="coluna">
          <div class="campo">
            <div class="label">Cargos</div>
            <div class="valor">
              <div v-for="(cargo, i) in diretor.cargos" :key="i">
                {{ cargo }}
              </div>
            </div>
          </div>
          <div class="campo">
            <div class="label">Departamento</div>
            <div class="valor">{{ diretor.departamento }}</div>
          </div>
          <div class="campo">
            <div class="label">Telefone</div>
            <div class="valor">
              <input v-if="editando" v-model="novoTelefone" />
              <span v-else>{{ diretor.telefone }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { User } from 'lucide-vue-next';
import Botao from '@/components/Botao.vue';

const diretor = ref({
  name: '',
  email: '',
  nascimento: '',
  morada: '',
  sexo: '',
  telefone: '',
  departamento: '',
  cargos: []
});

const editando = ref(false);
const novoEmail = ref('');
const novoTelefone = ref('');

onMounted(async () => {
  const res = await fetch('http://localhost:3000/director');
  const data = await res.json();
  diretor.value = data;
  novoEmail.value = data.email;
  novoTelefone.value = data.telefone;
});

function ativarEdicao() {
  editando.value = true;
}

async function guardarAlteracoes() {
  const atualizados = {
    email: novoEmail.value,
    telefone: novoTelefone.value
  };

  await fetch('http://localhost:3000/director', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(atualizados)
  });

  diretor.value.email = novoEmail.value;
  diretor.value.telefone = novoTelefone.value;
  editando.value = false;
}
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
  