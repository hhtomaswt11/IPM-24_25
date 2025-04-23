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
import { useGestaoStore } from '@/stores/capacidade'; // importa a store

const gestaoStore = useGestaoStore(); // instancia a store

// Títulos das colunas e respetivos campos
const colunas = ['Tipo', 'Número', 'Estatuto', 'Unidade Curricular', 'Turno atual', 'Alteração', 'Capacidade', 'Decisão'];
const campos = ['tipo', 'numero', 'estatuto', 'uc', 'turnoAtual', 'alteracao', 'capacidade', 'decisao'];

const dados = ref([]);
let estudantes = [];

// Funções utilitárias para extrair dados do estudante
function getStudentNumber(studentId) {
  const student = estudantes.find(s => s.id == studentId);
  return student ? student.num : 'Desconhecido';
}

function getStudentStatus(studentId) {
  const student = estudantes.find(s => s.id == studentId);
  return student ? (student.specialStatus !== undefined ? (student.specialStatus ? 'Sim' : 'Não') : 'Não') : 'Desconhecido';
}

onMounted(async () => {
  try {
    const [conflictsRes, shiftsRes, coursesRes, studentsRes, classroomsRes] = await Promise.all([
      fetch('http://localhost:3000/conflicts'),
      fetch('http://localhost:3000/shifts'),
      fetch('http://localhost:3000/courses'),
      fetch('http://localhost:3000/students'),
      fetch('http://localhost:3000/classrooms')
    ]);

    const conflitos = await conflictsRes.json();
    const shifts = await shiftsRes.json();
    const courses = await coursesRes.json();
    estudantes = await studentsRes.json();
    const classrooms = await classroomsRes.json();

    // Criar mapa de capacidade real por turno (usando o ID do turno como chave!)
    const capacidadePorTurno = {};
    shifts.forEach(shift => {
      const sala = classrooms.find(c => c.id == shift.classroomId); // usa ==
      if (sala) {
        capacidadePorTurno[Number(shift.id)] = `${shift.totalStudentsRegistered}/${sala.capacity}`;
      }
    });

    // Guardar capacidades no store
    gestaoStore.setCapacidades(capacidadePorTurno);

    const conflitosCompletos = [];

    for (const conflito of conflitos) {
      const studentId = conflito.studentId;
      const shiftIDs = conflito.shiftID;

      for (const shiftID of shiftIDs) {
        const shift = shifts.find(s => s.id == shiftID);
        if (shift) {
          const courseId = shift.courseId;
          const turno = shift.name;
          const uc = courses.find(c => c.id == courseId)?.name || 'Desconhecido';
          const turnos = shifts
            .filter(s => s.courseId == courseId)
            .map(s => ({ id: s.id, name: s.name }));

          conflitosCompletos.push(reactive({
            tipo: 'Conflito',
            numero: getStudentNumber(studentId),
            estatuto: getStudentStatus(studentId),
            uc: uc,
            turnoAtual: turno,
            alteracao: turnos,
            escolha: '',
            decisao: 'Atualizar',
          }));
        }
      }
    }

    dados.value = conflitosCompletos;
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
});
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
