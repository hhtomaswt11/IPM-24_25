<template>
  <div class="gestao-container">
    <!-- Retângulo de fundo decorativo -->
    <div class="decoracao-fundo"></div>

    <!-- Tabela genérica -->
    <Tabela
      titulo="Conflitos, Trocas de Turnos e Salas"
      :colunas="colunas"
      :campos="campos"
      :dados="dados"
      @atualizar="acaoAtualizar"
      @aceitar="acaoAceitar"
      @rejeitar="acaoRejeitar"
    />
  </div>
</template>

<script setup>
import Tabela from '@/components/Tabela.vue';
import { ref, onMounted, reactive } from 'vue';
import { useGestaoStore } from '@/stores/capacidade';
import { getTurnosDisponiveis } from '@/utils/getTurnosDisponiveis';
import { prepararShiftRequests } from '@/utils/prepararShiftRequests';  
import { aceitarTrocaTurno, rejeitarTrocaTurno, atualizarAlocacao } from '@/utils/gestaoAcoes';
import {prepararTrocasDeSala} from '@/utils/prepararTrocasdeSalas'
import {tratarConflitos} from '@/utils/tratarConflitos'
import axios from 'axios';

const gestaoStore = useGestaoStore();
const colunas = ['Tipo', 'Número', 'Estatuto', 'Unidade Curricular', 'Turno atual', 'Alteração', 'Capacidade', 'Decisão'];
const campos = ['tipo', 'numero', 'estatuto', 'uc', 'turnoAtual', 'alteracao', 'capacidade', 'decisao'];
const dados = ref([]);
let estudantes = [];

function getStudentNumber(studentId) {
  const student = estudantes.find(s => s.id == studentId);
  return student ? student.num : 'Desconhecido';
}

function getStudentStatus(studentId) {
  const student = estudantes.find(s => s.id == studentId);
  return student ? (student.specialStatus !== undefined ? (student.specialStatus ? 'Sim' : 'Não') : 'Não') : 'Desconhecido';
}

// Função para disparar evento de atualização de alocações
function notifyAllocationUpdated() {
  window.dispatchEvent(new Event('allocationsUpdated'));
}

onMounted(async () => {
  try {
    const [conflictsRes, shiftsRes, coursesRes, studentsRes, classroomsRes, 
           shiftRequestsRes, classroomRequestsRes, teachersRes] = await Promise.all([
      axios.get('http://localhost:3000/conflicts'),
      axios.get('http://localhost:3000/shifts'),
      axios.get('http://localhost:3000/courses'),
      axios.get('http://localhost:3000/students'),
      axios.get('http://localhost:3000/classrooms'),
      axios.get('http://localhost:3000/shiftRequests'),
      axios.get('http://localhost:3000/classroomRequests'),
      axios.get('http://localhost:3000/teachers')
    ]);
    const conflitos = conflictsRes.data;
    const shifts = shiftsRes.data;
    const courses = coursesRes.data;
    estudantes = studentsRes.data;
    const classrooms = classroomsRes.data;
    const shiftRequests = shiftRequestsRes.data;
    const classroomRequests = classroomRequestsRes.data;
    const teachers = teachersRes.data;
    
    const capacidadePorTurno = {};
    shifts.forEach(shift => {
      const sala = classrooms.find(c => c.id == shift.classroomId);
      if (sala) {
        capacidadePorTurno[Number(shift.id)] = `${shift.totalStudentsRegistered}/${sala.capacity}`;
      }
    });
    gestaoStore.setCapacidades(capacidadePorTurno);
    

    const conflitosCompletos = await tratarConflitos({ conflitos, shifts, courses, estudantes, gestaoStore });
    const pedidosTroca = prepararShiftRequests({ shiftRequests,shifts, courses,estudantes });

    const pedidosSala = prepararTrocasDeSala({ classroomRequests, shifts, classrooms, teachers, courses});


    dados.value = [...conflitosCompletos, ...pedidosTroca, ...pedidosSala];
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
});

async function acaoAtualizar(item) {
  await atualizarAlocacao(item, dados, notifyAllocationUpdated);
}

// Implementar função para aceitar (se necessário)
async function acaoAceitar(item) {
  try {
    await aceitarTrocaTurno(item, dados);
  } catch (error) {
    console.error('Erro ao aceitar pedido de troca:', error);
  }
}

async function acaoRejeitar(item) {
  try {
    await rejeitarTrocaTurno(item, dados);
  } catch (error) {
    console.error('Erro ao rejeitar pedido de troca:', error);
  }
}

</script>


<style scoped>
.gestao-container {
  padding: 1rem;
  position: relative;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
}

.decoracao-fundo {
  background-color: #FDF7F7;
  position: absolute;
  top: 165px;
  left: 0;
  right: 0;
  height: 370px;
  z-index: 0;
  border-radius: 8px;
}

::v-deep(.uc-cell) {
  width: 220px;
  white-space: normal;
  overflow: visible;
  text-overflow: initial;
}

::v-deep(th:nth-child(4)) {
  width: 220px;
}
</style>
