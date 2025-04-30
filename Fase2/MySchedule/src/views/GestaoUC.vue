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
import db from '@/database/trabalhodb.json'
import Tabela from '@/components/Tabela.vue'
import { useGestaoStore } from '@/stores/capacidade'; 
import { reactive } from 'vue';
const gestaoStore = useGestaoStore();

function getStudentNumber(studentId) {
  const student = db.students.find(s => s.id == studentId);
  return student ? student.num : 'Desconhecido';
}

function getStudentStatus(studentId) {
  const student = db.students.find(s => s.id == studentId);
  return student ? (student.specialStatus !== undefined ? (student.specialStatus ? 'Sim' : 'Não') : 'Não') : 'Desconhecido';
}

const route = useRoute()
const nomeParam = route.params.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
const uc = db.courses.find(c =>
  c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === nomeParam
)

const colunas = ['Tipo', 'Número', 'Estatuto', 'Turno atual', 'Alteração', 'Capacidade', 'Decisão']
const campos = ['tipo', 'numero', 'estatuto', 'turnoAtual', 'alteracao', 'capacidade', 'decisao']
const conflitos = db.conflicts
const todasTrocas = db.shiftRequests.map(req => {
  const shift = db.shifts.find(s => s.id.toString() === req.shiftId.toString())
  const student = db.students.find(s => s.id.toString() === req.studentId.toString())
  const course = shift ? db.courses.find(c => c.id.toString() === shift.courseId.toString()) : null
  const altShift = req.alternativeShiftId
    ? db.shifts.find(s => s.id.toString() === req.alternativeShiftId.toString())
    : null
  const sala = shift ? db.classrooms.find(r => r.id.toString() === shift.classroomId.toString()) : null

  return shift && student && course ? {
    tipo: 'Troca de turno',
    numero: student.num,
    estatuto: student.specialStatus ? 'Sim' : 'Não',
    turnoAtual: shift.name,
    alteracao: altShift?.name || '---',
    capacidade: `${shift.totalStudentsRegistered}/${sala.capacity.toString()}`,
    decisao: '✔ ✖',
    uc: course.id.toString()
  } : null
}).filter(Boolean)

const capacidadePorTurno = {};
    db.shifts.forEach(shift => {
      const sala = db.classrooms.find(c => c.id == shift.classroomId);
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
    const shift = db.shifts.find(s => s.id == shiftID);
    if (shift) {
      const courseId = shift.courseId;
      const turno = shift.name;
      const uc = db.courses.find(c => c.id == courseId)?.name || 'Desconhecido';
      const turnos = db.shifts
      .filter(s => {
         const capacidadeTexto = gestaoStore.getCapacidadeById(s.id.toString());
         const [ocupadosStr, capacidadeStr] = capacidadeTexto.split('/');                     
         const ocupados = parseInt(ocupadosStr);
         const capacidade = parseInt(capacidadeStr);

        return (
           s.courseId == courseId &&          // Mesmo curso
           s.type === shift.type &&            // Mesmo tipo ("PL", "T", etc)
           s.id != shiftID &&                  // Não incluir turno atual
           (!isNaN(ocupados) && !isNaN(capacidade) && ocupados < capacidade)  // Capacidade não cheia
           );
         })
         .map(s => ({ id: s.id, name: s.name }));


      conflitosCompletos.push(reactive({
        tipo: 'Conflito',
        numero: getStudentNumber(studentId),
        estatuto: getStudentStatus(studentId),
        turnoAtual: turno,
        alteracao: turnos,
        escolha: '',
        decisao: 'Atualizar',
        uc: courseId.toString()
      }));
    }
  }
}

const dadosFiltrados = [...todasTrocas, ...conflitosCompletos].filter(d => d.uc === uc?.id?.toString())
console.log(dadosFiltrados)
function acaoAtualizar(i) {
  console.log(`Atualizar clicado na linha ${i}`)
}
function acaoAceitar(i) {
  console.log(`✔ Aceite na linha ${i}`)
}
function acaoRejeitar(i) {
  console.log(`✖ Rejeitado na linha ${i}`)
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
