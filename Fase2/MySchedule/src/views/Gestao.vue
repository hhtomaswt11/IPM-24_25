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
    const [conflictsRes, shiftsRes, coursesRes, studentsRes, classroomsRes] = await Promise.all([
      axios.get('http://localhost:3000/conflicts'),
      axios.get('http://localhost:3000/shifts'),
      axios.get('http://localhost:3000/courses'),
      axios.get('http://localhost:3000/students'),
      axios.get('http://localhost:3000/classrooms')
    ]);
    const conflitos = conflictsRes.data;
    const shifts = shiftsRes.data;
    const courses = coursesRes.data;
    estudantes = studentsRes.data;
    const classrooms = classroomsRes.data;
    
    const capacidadePorTurno = {};
    shifts.forEach(shift => {
      const sala = classrooms.find(c => c.id == shift.classroomId);
      if (sala) {
        capacidadePorTurno[Number(shift.id)] = `${shift.totalStudentsRegistered}/${sala.capacity}`;
      }
    });
    gestaoStore.setCapacidades(capacidadePorTurno);
    
    const conflitosCompletos = [];
    for (const conflito of conflitos) {
      const studentId = conflito.studentId;
      const shiftIDs = conflito.shiftID;
      const conflitoId = conflito.id;
      
      for (const shiftID of shiftIDs) {
        const shift = shifts.find(s => s.id == shiftID);
        if (shift) {
          const courseId = shift.courseId;
          const turno = shift.name;
          const uc = courses.find(c => c.id == courseId)?.name || 'Desconhecido';
          const turnosDisponiveis = await getTurnosDisponiveis(studentId, courseId, shift.type, shiftID);
          const turnos = turnosDisponiveis
            .filter(s => {
              const capacidadeTexto = gestaoStore.getCapacidadeById(s.id);
              const [ocupadosStr, capacidadeStr] = capacidadeTexto?.split('/') || [];
              const ocupados = parseInt(ocupadosStr);
              const capacidade = parseInt(capacidadeStr);
              return (
                s.courseId == courseId &&
                s.type === shift.type &&
                s.id != shiftID &&
                (!isNaN(ocupados) && !isNaN(capacidade) && ocupados < capacidade)
              );
            })
            .map(s => ({ id: s.id, name: s.name }));
          
          conflitosCompletos.push(reactive({
            tipo: 'Conflito',
            numero: getStudentNumber(studentId),
            estatuto: getStudentStatus(studentId),
            uc: uc,
            turnoAtual: turno,
            alteracao: turnos,
            escolha: '', // Inicializado como string vazio
            decisao: 'Atualizar',
            studentId: studentId, // Adicionado para facilitar atualizações
            turnoAtualId: shiftID, // Adicionado para facilitar atualizações
            conflitoId: conflitoId, // Adicionado para relacionar com o conflito original
            todosShifts: shiftIDs // Adicionados todos os shifts do conflito
          }));
        }
      }
    }
    dados.value = conflitosCompletos;
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }
});

async function acaoAtualizar(item) {
  try {
    console.log('Atualizando:', item);
    
    // Verificar se um turno foi selecionado
    if (!item.escolha) {
      alert('Por favor, selecione um turno para alteração.');
      return;
    }
    
    const studentId = item.studentId;
    if (!studentId) {
      console.error('ID do estudante não encontrado.');
      return;
    }
    
    const turnoAtualId = item.turnoAtualId;
    if (!turnoAtualId) {
      console.error('ID do turno atual não encontrado.');
      return;
    }
    
    // Obter o ID do novo turno selecionado no dropdown
    const novoShiftId = item.escolha;
    
    // Buscar alocações
    const alocacoesRes = await axios.get('http://localhost:3000/allocations');
    const alocacoes = alocacoesRes.data;
    
    // Encontrar a alocação existente para este aluno e turno
    const alocacao = alocacoes.find(a => 
      a.studentId == studentId && a.shiftId == turnoAtualId
    );
    
    if (!alocacao) {
      console.error('Alocação não encontrada para:', { studentId, turnoAtualId });
      return;
    }
    
    // Atualizar a alocação com o novo ID de turno
    await axios.patch(`http://localhost:3000/allocations/${alocacao.id}`, {
      shiftId: Number(novoShiftId)
    });
    console.log('Alocação atualizada com sucesso:', {
      alocacaoId: alocacao.id,
      de: turnoAtualId,
      para: novoShiftId
    });
    
    // Atualizar os dados de turno no banco de dados
    try {
      // Obter o turno atual
      const turnoAtualRes = await axios.get(`http://localhost:3000/shifts/${turnoAtualId}`);
      const turnoAtual = turnoAtualRes.data;
      
      // Obter o novo turno
      const novoTurnoRes = await axios.get(`http://localhost:3000/shifts/${novoShiftId}`);
      const novoTurno = novoTurnoRes.data;
      
      // Decrementar o número de alunos no turno antigo
      if (turnoAtual && turnoAtual.totalStudentsRegistered > 0) {
        await axios.patch(`http://localhost:3000/shifts/${turnoAtualId}`, {
          totalStudentsRegistered: turnoAtual.totalStudentsRegistered - 1
        });
      }
      
      // Incrementar o número de alunos no novo turno
      if (novoTurno) {
        await axios.patch(`http://localhost:3000/shifts/${novoShiftId}`, {
          totalStudentsRegistered: (novoTurno.totalStudentsRegistered || 0) + 1
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar dados de turno:', error);
    }
    
    // Notificar que as alocações foram atualizadas
    notifyAllocationUpdated();
    
    // Buscar conflitos
    const conflitosRes = await axios.get('http://localhost:3000/conflicts');
    const conflitos = conflitosRes.data;
    
    // Encontrar o conflito que contém este turno
    const conflito = conflitos.find(c =>
      c.studentId == studentId &&
      Array.isArray(c.shiftID) &&
      c.shiftID.includes(Number(turnoAtualId))
    );
    
    if (conflito) {
      // Guardar o ID do conflito e todos os turnos associados a ele
      const conflitoId = conflito.id;
      const todosShiftsDoConflito = conflito.shiftID;
      
      // Remover o conflito do banco de dados
      await axios.delete(`http://localhost:3000/conflicts/${conflitoId}`);
      console.log('Conflito removido com sucesso:', conflitoId);
      
      // Remover TODOS os itens relacionados ao mesmo conflito do frontend
      dados.value = dados.value.filter(d => {
        // Se for um item de outro estudante, mantém
        if (d.studentId != studentId) return true;
        
        // Se o turno atual deste item estiver no array de turnos do conflito, remove
        return !todosShiftsDoConflito.includes(Number(d.turnoAtualId));
      });
      
      console.log('Todos os itens relacionados ao conflito foram removidos do frontend.');
    } else {
      console.warn('Conflito não encontrado para remoção.');
      // Remover apenas o item atual
      dados.value = dados.value.filter(d => d !== item);
    }
    
  } catch (error) {
    console.error('Erro ao atualizar alocação/conflito:', error);
    alert(`Erro ao atualizar: ${error.message}`);
  }
}

// Implementar função para aceitar (se necessário)
async function acaoAceitar(item) {
  // Implemente conforme necessário
}

// Implementar função para rejeitar (se necessário)
async function acaoRejeitar(item) {
  // Implemente conforme necessário
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
