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
import { aceitarTrocaTurno, rejeitarTrocaTurno, atualizarAlocacao } from '@/utils/gestaoAcoes';
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
    const altShift = shifts.find(s => s.id == req.alternativeShiftId);
    const shiftRequestId = req.id;
    const sala = shift ? classrooms.find(r => r.id == shift.classroomId) : null

    return shift && student && course ? {
      tipo: 'Troca de Turno',
      numero: student.num,
      estatuto: student.specialStatus ? 'Sim' : 'Não',
      turnoAtual: shift.name,
      alteracao: altShift.name,
      capacidade: `${shift.totalStudentsRegistered}/${sala?.capacity || '?'}`,
      decisao: 'Atualizar',
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
  await atualizarAlocacao(item, dados, notifyAllocationUpdated);
}


async function acaoAceitar(item) {
  try {
    await aceitarTrocaTurno(item, dadosFiltrados);
  } catch (error) {
    console.error('Erro ao aceitar pedido de troca:', error);
  }
}

async function acaoRejeitar(item) {
  try {
    await rejeitarTrocaTurno(item, dadosFiltrados);
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
