<template>
<div v-if="visivel" class="overlay-fundo" @click.self="fecharOverlay">
    <transition name="slide-in">
    <div class="overlay-conteudo">
        <div class="lado-esquerdo">
        <p>Overlay aberto para {{ aluno }}</p>
        <!-- Podes colocar mais conteúdo aqui -->
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
        </div>
    </div>
    </transition>
</div>
</template>

<script setup>
const props = defineProps({
visivel: Boolean,
aluno: String
});

const emit = defineEmits(['fechar']);

function fecharOverlay() {
emit('fechar');
}
</script>

<style scoped>
/* Garante que html e body ocupam toda a altura e removem margens */
:global(html), :global(body) {
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
height: 100vh; /* fallback */
height: 100dvh; /* altura real em browsers modernos */
background-color: rgba(0, 0, 0, 0.4);
z-index: 99999;
display: flex;
justify-content: center;
align-items: center;
}

.overlay-conteudo {
  display: flex;
  flex-direction: row;
  width: min(98vw, 1400px); /* AUMENTA largura */
  height: min(95vh, 800px); /* AUMENTA altura */
  max-height: 80%;
  background-color: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}


/* Metade esquerda */
.lado-esquerdo {
flex: 3;
padding: 1.5rem;
background-color: white;
overflow-y: auto;
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
  justify-content: flex-start; /* alinhar ao topo */
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
  font-weight: 600; /* semibold */
}

.value {
  color: black;
  font-weight: 400; /* normal */
}

.info-item:first-of-type {
  margin-top: 3rem; /* ajusta o valor como quiseres */
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

/* Responsividade — manter lado a lado, mas adaptar tamanhos */
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
