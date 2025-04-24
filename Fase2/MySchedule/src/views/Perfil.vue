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
import axios from 'axios';  // Importando o Axios

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

// Campos editáveis
const novoNome = ref('');
const novoEmail = ref('');
const novoNascimento = ref('');
const novaMorada = ref('');
const novoSexo = ref('');
const novoTelefone = ref('');
const novoDepartamento = ref('');
const novosCargos = ref([]);

// Buscar dados do diretor
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/directors');
    const data = response.data;

    diretor.value = data[0];

    // Inicializar campos editáveis
    novoNome.value = data[0].name;
    novoEmail.value = data[0].email;
    novoNascimento.value = data[0].nascimento;
    novaMorada.value = data[0].morada;
    novoSexo.value = data[0].sexo;
    novoTelefone.value = data[0].telefone;
    novoDepartamento.value = data[0].departamento;
    novosCargos.value = [...data[0].cargos];
  } catch (error) {
    console.error('Erro ao buscar dados do diretor:', error);
  }
});

// Ativar modo de edição
function ativarEdicao() {
  editando.value = true;
}

// Guardar alterações no servidor
async function guardarAlteracoes() {
  const atualizados = {
    name: novoNome.value,
    email: novoEmail.value,
    nascimento: novoNascimento.value,
    morada: novaMorada.value,
    sexo: novoSexo.value,
    telefone: novoTelefone.value,
    departamento: novoDepartamento.value,
    cargos: [...novosCargos.value]
  };

  try {
    await axios.patch('http://localhost:3000/directors/1', atualizados);

    // Atualizar localmente
    diretor.value = { ...diretor.value, ...atualizados };
    editando.value = false;
  } catch (error) {
    console.error('Erro ao salvar alterações:', error);
  }
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
  