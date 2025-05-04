<template>
  <transition name="fade" @after-leave="emit('fechado')">
    <div v-if="modelValue" class="overlay" @click.self="handleBackgroundClick">
      <div class="overlay-content">
        <!-- Ícones canto superior direito -->
        <div class="top-icons">

          <!-- Botão de seta apenas se houver conflitos -->
          <button
            v-if="assunto.includes('Troca de Turno') && !semConflitos"
            class="seta-button"
            :style="setaStyle"
            @click="navegarParaGestaoUC"
          >
            &#8594;  <!-- Seta Direita -->
          </button>

          <!-- Ícones de resposta e lixo -->
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
              <div class="linha-span">
                <span
                  v-if="assunto.includes('Troca de Turno') && !semConflitos"
                  @click="navegarParaGestaoUC"
                  class="link-navegavel"
                >
                  {{ assunto }}
                </span>
                <span v-else>
                  {{ assunto }}
                </span>
              </div>
            </div>
          </div>

          <!-- Mensagem -->
          <div class="mensagem-conteudo">
            {{ conteudo }}
            <p v-if="assunto.includes('Troca de Turno') && semConflitos">De momento, esta Unidade Curricular não apresenta conflitos, trocas de turnos nem trocas de sala!</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Reply, Trash2 } from 'lucide-vue-next';
import axios from 'axios';

const props = defineProps({
  modelValue: Boolean,
  de: String,
  para: String,
  assunto: String,
  conteudo: String,
  enviada: Boolean
});

const emit = defineEmits(['update:modelValue', 'apagar', 'responder', 'fechado']);
const router = useRouter();
const semConflitos = ref(false);

// Verifica se existe algum conflito ou troca para esta UC
onMounted(async () => {
  if (props.assunto.includes('Troca de Turno')) {
    try {
      const nomeUC = extrairNomeUC(props.assunto);
      if (!nomeUC) return;
      
      // Buscar dados necessários
      const [
        shiftsRes,
        coursesRes,
        conflictsRes,
        shiftRequestsRes,
        classroomRequestsRes
      ] = await Promise.all([
        axios.get('http://localhost:3000/shifts'),
        axios.get('http://localhost:3000/courses'),
        axios.get('http://localhost:3000/conflicts'),
        axios.get('http://localhost:3000/shiftRequests'),
        axios.get('http://localhost:3000/classroomRequests')
      ]);
      
      const shifts = shiftsRes.data;
      const courses = coursesRes.data;
      const conflicts = conflictsRes.data;
      const shiftRequests = shiftRequestsRes.data;
      const classroomRequests = classroomRequestsRes.data;
      
      // Encontrar o curso pelo nome
      const nomeFiltrado = nomeUC.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const uc = courses.find(c => 
        c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === nomeFiltrado
      );
      
      if (!uc) {
        semConflitos.value = true;
        return;
      }
      
      const ucId = uc.id.toString();
      
      // Verificar se há turnos desta UC com conflitos
      const turnosUC = shifts.filter(s => s.courseId == ucId).map(s => s.id);
      
      // Verificar se há conflitos ou pedidos relacionados a esta UC
      const temConflitos = conflicts.some(c => 
        c.shiftID.some(sId => turnosUC.includes(Number(sId)))
      );
      
      const temPedidosTroca = shiftRequests.some(req => {
        const shift = shifts.find(s => s.id == req.shiftId);
        return shift && shift.courseId == ucId;
      });
      
      const temPedidosSala = classroomRequests.some(req => {
        const shift = shifts.find(s => s.id == req.shiftId);
        return shift && shift.courseId == ucId;
      });
      
      semConflitos.value = !(temConflitos || temPedidosTroca || temPedidosSala);
      
    } catch (error) {
      console.error('Erro ao verificar conflitos:', error);
      // Se houver erro, assumimos que não há conflitos
      semConflitos.value = true;
    }
  }
});

// Computed property para determinar o estilo da seta
const setaStyle = computed(() => {
  return semConflitos.value ? { color: 'gray', cursor: 'not-allowed' } : { color: 'black' };
});

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

function extrairNomeUC(assunto) {
  const semPrefixo = assunto.replace('Troca de Turno - ', '');
  const partes = semPrefixo.split(/T\d|PL\d/);
  return partes[0]?.trim() || null;
}

function navegarParaGestaoUC() {
  const nomeUC = extrairNomeUC(props.assunto);
  if (!nomeUC || semConflitos.value) return;

  const destino = `/gestao-uc/${encodeURIComponent(nomeUC)}`;
  
  emit('update:modelValue', false); // fecha o modal

  setTimeout(() => {
    router.push(destino);
  }, 100);
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

/* Estilos para o novo botão de seta */
.seta-button {
  background: none;
  border: none;
  font-size: 28px;
  color: black; 
  cursor: pointer;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: color 0.2s ease;
  margin-top: -6px;
}

.seta-button:hover {
  color: black;
}

/* Novo estilo para a seta desabilitada */
.seta-button[style*="cursor: not-allowed"] {
  color: gray;
  pointer-events: none;
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

.link-navegavel {
  cursor: pointer;
  color: inherit;
  transition: color 0.2s ease;
}

.link-navegavel:hover {
  color: #BA7070;
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