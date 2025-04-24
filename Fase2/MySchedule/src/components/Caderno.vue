<template>
  <div class="overlay" @click.self="fechar">
    <!-- Apenas o caderno é animado -->
    <transition name="slide">
      <div v-if="mostrar" class="caderno">
        <div class="cabecalho">Anotações</div>
        <div class="bloco-branco">
          <textarea
            v-model="texto"
            class="textarea-linhas"
            placeholder="Escreva aqui as suas anotações.."
          ></textarea>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const texto = ref('');
const mostrar = ref(false);
const emit = defineEmits(['fechar']);

onMounted(() => {
  mostrar.value = true;
});

function fechar() {
  mostrar.value = false;
  setTimeout(() => emit('fechar'), 500); 
}
</script>


<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* fundo escuro SEM transição */
  z-index: 9999;
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
  overflow: hidden;
}

/* painel do caderno */
.caderno {
  width: 40%;
  height: 85%;
  margin:auto 0;
  background-color: #373737;
  padding: 20px;
  border-radius: 4px;
  box-shadow: -4px 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

/* título */
.cabecalho {
  color: white;
  font-size: 20px;
  font-weight: bold;
  padding-bottom: 5px;
  text-align: center;
}

/* bloco branco de escrita */
.bloco-branco {
  background-color: white;
  flex: 1;
  border-radius: 4px;
  padding: 20px;
  /* Remover isto: overflow-y: auto; */
  overflow: hidden;
  display: flex;
}

/* textarea com linhas */
.textarea-linhas {
  width: 100%;
  height: 100%;
  resize: none;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: 'Courier New', monospace;
  padding: 4px 8px 8px 8px; /* top ajustado */
  line-height: 24px;

  background: repeating-linear-gradient(
    to bottom,
    white,
    white 23px,
    #ccc 24px
  );
}



/* apenas o caderno é animado */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.45s ease; /* <- mais lenta */
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

</style>