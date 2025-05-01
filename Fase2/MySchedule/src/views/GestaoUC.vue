<template>
  <div class="gestao-container">
    <div class="decoracao-fundo"></div>
    <Tabela
      titulo="Conflitos, Trocas de Turnos e Salas"
      :colunas="colunas"
      :campos="campos"
      :dados="dadosFiltrados"
      @atualizar="acaoAtualizar"
      @aceitar="acaoAceitar"
      @rejeitar="acaoRejeitar"
    />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import Tabela from '@/components/Tabela.vue'
import { useGestaoStore } from '@/stores/capacidade'; 
import axios from 'axios';
import { ref, onMounted } from 'vue';

const gestaoStore = useGestaoStore();
const route = useRoute();
const dadosFiltrados = ref([]);
const colunas = ['Tipo', 'Número', 'Estatuto', 'Turno atual', 'Alteração', 'Capacidade', 'Decisão']
const campos = ['tipo', 'numero', 'estatuto', 'turnoAtual', 'alteracao', 'capacidade', 'decisao']
let estudantes = [];

function getStudentNumber(studentId) {
  const student = estudantes.find(s => s.id == studentId);
  return student ? student.num : 'Desconhecido';
}

function getStudentStatus(studentId) {
  const student = estudantes.find(s => s.id == studentId);
  return student ? (student.specialStatus !== undefined ? (student.specialStatus ? 'Sim' : 'Não') : 'Não') : 'Desconhecido';
}

function notifyAllocationUpdated() {
  window.dispatchEvent(new Event('allocationsUpdated'));
}

onMounted(async () => {
  const [
    conflictsRes,
    shiftsRes,
    coursesRes,
    studentsRes,
    classroomsRes,
    shiftRequestsRes
  ] = await Promise.all([
    axios.get('http://localhost:3000/conflicts'),
    axios.get('http://localhost:3000/shifts'),
    axios.get('http://localhost:3000/courses'),
    axios.get('http://localhost:3000/students'),
    axios.get('http://localhost:3000/classrooms'),
    axios.get('http://localhost:3000/shiftRequests')
  ]);

  const conflitos = conflictsRes.data;
  const shifts = shiftsRes.data;
  const courses = coursesRes.data;
  estudantes = studentsRes.data;
  const classrooms = classroomsRes.data;
  const shiftRequests = shiftRequestsRes.data;

  const nomeParam = route.params.nome?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  const uc = courses.find(c =>
    c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === nomeParam
  )

  const capacidadePorTurno = {};
  shifts.forEach(shift => {
    const sala = classrooms.find(c => c.id == shift.classroomId);
    if (sala) {
      capacidadePorTurno[Number(shift.id)] = `${shift.totalStudentsRegistered}/${sala.capacity}`;
    }
  });
  gestaoStore.setCapacidades(capacidadePorTurno);

  const todasTrocas = shiftRequests.map(req => {
    const shift = shifts.find(s => s.id == req.shiftId)
    const student = estudantes.find(s => s.id == req.studentId)
    const course = shift ? courses.find(c => c.id == shift.courseId) : null
    const altShift = req.alternativeShiftId
    const shiftRequestId = req.id
      ? shifts.find(s => s.id == req.alternativeShiftId)
      : null
    const sala = shift ? classrooms.find(r => r.id == shift.classroomId) : null

    return shift && student && course ? {
      tipo: 'Troca de Turno',
      numero: student.num,
      estatuto: student.specialStatus ? 'Sim' : 'Não',
      turnoAtual: shift.name,
      alteracao: altShift?.name || '---',
      capacidade: `${shift.totalStudentsRegistered}/${sala?.capacity || '?'}`,
      decisao: '✔ ✖',
      uc: course.id.toString(),
      studentId: student.id,
      turnoAtualId: shift.id,
      alternativeShiftId: altShift,
      shiftRequestId: shiftRequestId
    } : null
  }).filter(Boolean)

  const conflitosCompletos = [];

  for (const conflito of conflitos) {
    const studentId = conflito.studentId;
    const shiftIDs = conflito.shiftID;

    for (const shiftID of shiftIDs) {
      const shift = shifts.find(s => s.id == shiftID);
      if (shift) {
        const courseId = shift.courseId;
        const turno = shift.name;

        const turnosDisponiveis = shifts.filter(s => {
          const capacidadeTexto = gestaoStore.getCapacidadeById(s.id.toString());
          const [ocupadosStr, capacidadeStr] = capacidadeTexto?.split('/') || ['0', '0'];
          const ocupados = parseInt(ocupadosStr);
          const capacidade = parseInt(capacidadeStr);

          return (
            s.courseId == courseId &&
            s.type === shift.type &&
            s.id != shiftID &&
            !isNaN(ocupados) && !isNaN(capacidade) && ocupados < capacidade
          );
        }).map(s => ({ id: s.id, name: s.name }));
        conflitosCompletos.push({
          tipo: 'Conflito',
          numero: getStudentNumber(studentId, estudantes),
          estatuto: getStudentStatus(studentId, estudantes),
          turnoAtual: turno,
          alteracao: turnosDisponiveis,
          escolha: '',
          capacidade: '',
          decisao: 'Atualizar',
          uc: courseId.toString(),
          studentId: studentId,
          turnoAtualId: shiftID, 
          conflitoId: conflito.id, 
          todosShifts: shiftIDs
        });
      }
    }
  }
  console.log(conflitosCompletos)
  console.log(uc.id)

  dadosFiltrados.value = [...todasTrocas, ...conflitosCompletos].filter(d => d.uc === uc?.id?.toString());
})

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
      dadosFiltrados.value = dadosFiltrados.value.filter(d => d !== item);
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
      dadosFiltrados.value = dadosFiltrados.value.filter(d =>
        d.studentId != studentId || !conflito.shiftID.includes(Number(d.turnoAtualId))
      );
    } else {
      dadosFiltrados.value = dadosFiltrados.value.filter(d => d !== item);
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

    // Remover o pedido de troca da base de dadosFiltrados
    await axios.delete(`http://localhost:3000/shiftRequests/${shiftRequestId}`);
    console.log(`✔ Pedido de troca ${shiftRequestId} removido`);

    // Remover do frontend
    dadosFiltrados.value = dadosFiltrados.value.filter(d => d !== item);
  } catch (error) {
    console.error('Erro ao aceitar pedido de troca:', error);
  }
}

async function acaoRejeitar(item) {
  try {
    const { shiftRequestId } = item;

    // Remover o pedido de troca da base de dadosFiltrados
    await axios.delete(`http://localhost:3000/shiftRequests/${shiftRequestId}`);
    console.log(`✖ Pedido de troca ${shiftRequestId} rejeitado e removido`);

    // Remover do frontend
    dadosFiltrados.value = dadosFiltrados.value.filter(d => d !== item);
  } catch (error) {
    console.error('Erro ao rejeitar pedido de troca:', error);
  }
}

</script>

<style scoped>
.gestao-container {
  padding: 2rem;
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
</style>
