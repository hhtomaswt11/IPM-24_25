<template>
  <div>
    <div class="botoes-container">
      <button
        :class="{ ativo: vistaAtual === 'pessoal' }"
        @click="vistaAtual = 'pessoal'"
      >
        Horário Pessoal
      </button>
      <button
        :class="{ ativo: vistaAtual === 'curso' }"
        @click="vistaAtual = 'curso'"
      >
        Horário do Curso
      </button>
    </div>

    <HorarioPessoalAluno v-if="vistaAtual === 'pessoal'" />
    <HorarioCursoAluno v-else />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import HorarioPessoalAluno from '@/components/HorarioPessoalAluno.vue';
import HorarioCursoAluno from '@/components/HorarioCursoAluno.vue';

const vistaAtual = ref('pessoal');
</script>

<style scoped>
.botoes-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

button {
  padding: 0.75rem 1.25rem;
  background-color: #FFFBFB;
  border: 2px solid #CEC9C9;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  width: 200px;
  height: 50px;
  font-size: 1rem;  
  color: #727272;
}

button.ativo {
  background-color: #DF9898;
  color: white;
}

button:hover {
  background-color: #DF9898;
  color: white;
}
</style>