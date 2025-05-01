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
  try {
    if (item.tipo === 'Troca de Sala') {
      // 1. Eliminar o pedido de troca de sala
      await axios.delete(`http://localhost:3000/classroomRequests/${item.classroomRequestId}`);
      console.log(`Pedido de troca de sala removido: ${item.classroomRequestId}`);

      // 2. Atualizar o shift correspondente com a nova sala
      await axios.patch(`http://localhost:3000/shifts/${item.shiftId}`, {
        classroomId: item.novaSalaId
      });
      console.log(`Shift ${item.shiftId} atualizado para nova sala: ${item.novaSalaId}`);

      // 3. Remover o item da tabela (frontend)
      dados.value = dados.value.filter(d => d !== item);
      return;
    }

    //Lógica normal para Conflitos e Trocas de Turno:
    if (!item.escolha) {
      alert('Por favor, selecione um turno para alteração.');
      return;
    }

    const studentId = item.studentId;
    const turnoAtualId = item.turnoAtualId;
    const novoShiftId = item.escolha;

    const alocacoesRes = await axios.get('http://localhost:3000/allocations');
    const alocacoes = alocacoesRes.data;

    const alocacao = alocacoes.find(a => a.studentId == studentId && a.shiftId == turnoAtualId);
    if (!alocacao) {
      console.error('Alocação não encontrada');
      return;
    }

    await axios.patch(`http://localhost:3000/allocations/${alocacao.id}`, {
      shiftId: Number(novoShiftId)
    });

    // Atualizar contadores dos shifts
    const turnoAtual = (await axios.get(`http://localhost:3000/shifts/${turnoAtualId}`)).data;
    const novoTurno = (await axios.get(`http://localhost:3000/shifts/${novoShiftId}`)).data;

    if (turnoAtual.totalStudentsRegistered > 0) {
      await axios.patch(`http://localhost:3000/shifts/${turnoAtualId}`, {
        totalStudentsRegistered: turnoAtual.totalStudentsRegistered - 1
      });
    }

    await axios.patch(`http://localhost:3000/shifts/${novoShiftId}`, {
      totalStudentsRegistered: (novoTurno.totalStudentsRegistered || 0) + 1
    });

    // Notificar e remover item do frontend
    notifyAllocationUpdated();

    const conflitos = (await axios.get('http://localhost:3000/conflicts')).data;
    const conflito = conflitos.find(c =>
      c.studentId == studentId && Array.isArray(c.shiftID) && c.shiftID.includes(Number(turnoAtualId))
    );

    if (conflito) {
      await axios.delete(`http://localhost:3000/conflicts/${conflito.id}`);
      dados.value = dados.value.filter(d =>
        d.studentId != studentId || !conflito.shiftID.includes(Number(d.turnoAtualId))
      );
    } else {
      dados.value = dados.value.filter(d => d !== item);
    }

  } catch (error) {
    console.error('Erro ao atualizar:', error);
    alert(`Erro: ${error.message}`);
  }
}


// Implementar função para aceitar (se necessário)
async function acaoAceitar(item) {
  try {
    const { studentId, turnoAtualId, escolha, shiftRequestId } = item;
    const novoShiftId = item.alternativeShiftId;

    // Buscar todas as alocações
    const resAlocacoes = await axios.get('http://localhost:3000/allocations');
    const alocacoes = resAlocacoes.data;

    // Procurar a alocação existente
    const alocacao = alocacoes.find(a =>
      a.studentId == studentId && a.shiftId == turnoAtualId
    );

    if (alocacao) {
      // Atualizar shiftId da alocação
      await axios.patch(`http://localhost:3000/allocations/${alocacao.id}`, {
        shiftId: novoShiftId
      });
      console.log(`✔ Alocação atualizada para turno ${novoShiftId}`);
    } else {
      console.warn('⚠ Alocação não encontrada para troca de turno.');
    }

    // Remover o pedido de troca da base de dados
    await axios.delete(`http://localhost:3000/shiftRequests/${shiftRequestId}`);
    console.log(`✔ Pedido de troca ${shiftRequestId} removido`);

    // Remover do frontend
    dados.value = dados.value.filter(d => d !== item);
  } catch (error) {
    console.error('Erro ao aceitar pedido de troca:', error);
  }
}

async function acaoRejeitar(item) {
  try {
    const { shiftRequestId } = item;

    // Remover o pedido de troca da base de dados
    await axios.delete(`http://localhost:3000/shiftRequests/${shiftRequestId}`);
    console.log(`✖ Pedido de troca ${shiftRequestId} rejeitado e removido`);

    // Remover do frontend
    dados.value = dados.value.filter(d => d !== item);
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
