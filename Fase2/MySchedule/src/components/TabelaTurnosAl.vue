<template>
  <div class="uc-table-wrapper">
    <table class="uc-table">
      <thead>
        <tr>
          <th>Turno</th>
          <th>Sala</th>
          <th>Capacidade</th>
          <th>Taxa ocupação</th>
          <th>Nº alunos</th>
          <th>Hora</th>
          <th>Dia</th>
          <th></th> <!-- nova coluna para os botões -->
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="shift in shifts"
          :key="shift.id"
          :class="{ highlight: alunoInscrito(shift.id.toString()) }"
        >
          <td>{{ shift.name }}</td>
          <td>{{ getClassroomName(shift.classroomId) }}</td>
          <td>{{ getClassroomCapacity(shift.classroomId) }}</td>
          <td>
            <span :class="getOccupancyClass(shift)">
              {{ calculateOccupancyRate(shift) }}%
            </span>
          </td>
          <td>{{ shift.totalStudentsRegistered }}</td>
          <td>{{ formatTime(shift.from) }} - {{ formatTime(shift.to) }}</td>
          <td>{{ translateDay(shift.day) }}</td>
          <td>
            <button
              v-if="!alunoInscrito(shift.id.toString())"
              class="swap-btn"
              @click="pedirTroca(shift.id)"
            >
              ⇄
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import db from '@/database/trabalhodb.json'

const alunoId = Number(sessionStorage.getItem("userId"))
console.log("ID do aluno em sessão:", alunoId);

defineProps({
  ucId: Number,
  shifts: Array
})

// Turnos onde o aluno está inscrito
const alunoShifts = db.allocations
  .filter(a => a.studentId.toString() === alunoId.toString()) 
  .map(a => a.shiftId.toString()) 


function alunoInscrito(shiftId) {
  return alunoShifts.includes(shiftId)
}

function getClassroomName(classroomId) {
  const room = db.classrooms.find(r => r.id.toString() === classroomId.toString())
  const building = room ? db.buildings.find(b => b.id.toString() === room.buildingId.toString()) : null
  return room && building ? `${building.abbreviation} - ${room.name}` : 'Desconhecida'
}

function getClassroomCapacity(classroomId) {
  const room = db.classrooms.find(r => r.id.toString() === classroomId.toString())
  return room ? room.capacity : 0
}

function calculateOccupancyRate(shift) {
  const room = db.classrooms.find(r => r.id.toString() === shift.classroomId.toString())
  if (!room || room.capacity === 0) return 0
  return Math.round((shift.totalStudentsRegistered / room.capacity) * 100)
}

function getOccupancyClass(shift) {
  const rate = calculateOccupancyRate(shift)
  if (rate >= 80) return 'high-occupancy'
  if (rate >= 50) return 'medium-occupancy'
  return 'low-occupancy'
}

function formatTime(hour) {
  return `${hour.toString().padStart(2, '0')}:00`
}

function translateDay(day) {
  const dias = {
    Monday: 'segunda-feira',
    Tuesday: 'terça-feira',
    Wednesday: 'quarta-feira',
    Thursday: 'quinta-feira',
    Friday: 'sexta-feira'
  }
  return dias[day] || day
}

async function pedirTroca(novoTurnoId) {
  const turnoAtual = alunoShifts.find(id => {
    const t = db.shifts.find(s => s.id === id)
    return t?.courseId === ucId
  })

  const novoPedido = {
    shiftId: Number(turnoAtual),
    studentId: alunoId,
    alternativeShiftId: novoTurnoId
  }

  try {
    await axios.post("http://localhost:3000/shiftRequests", novoPedido)
    alert("Pedido de troca registado com sucesso!")
  } catch (e) {
    console.error("Erro ao criar pedido:", e)
    alert("Erro ao registar o pedido.")
  }
}

</script>

<style scoped>
.uc-table-wrapper {
  position: relative;
  padding: 2rem;
  background-color: #fdf7f7; 
  border-radius: 8px;
  overflow-x: auto;
  min-height: 100%; 
}

.uc-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 6px 8px;
}

.uc-table th,
.uc-table td {
  padding: 12px 16px;
  text-align: center;
  border: 1px solid #e0e0e0;
  background-color: white;
}

.uc-table th {
  background-color: #867D7D;
  color: rgb(10, 10, 10);
  text-align: center;
  font-weight: bold;
}

.highlight td {
  background-color: #F7E58F;
  font-weight: bold;
}

.high-occupancy {
  color: #dc2626;
  font-weight: bold;
}

.medium-occupancy {
  color: #f59e0b;
  font-weight: bold;
}

.low-occupancy {
  color: #10b981;
  font-weight: bold;
}

.swap-floating-btn {
  position: absolute;
  right: -40px;
  background-color: #cda2a2;
  color: white;
  border: none;
  padding: 10px 12px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.swap-floating-btn:hover {
  background-color: #ba7070;
}

.swap-btn {
  background-color: #cda2a2;
  color: #fff;
  border: none;
  padding: 13px 10px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;               
  width: 100%;
  border-radius: 3px;
  font-weight: bold;
}

.swap-btn:hover {
  background-color: #ba7070;
}

</style>
