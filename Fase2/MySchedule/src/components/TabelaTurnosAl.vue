<template>
  <div class="uc-table-container">
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
          <th></th>
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
              v-if="!alunoInscrito(shift.id)"
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

function pedirTroca(novoTurnoId) {
  const turnoAtual = alunoShifts.find(id => {
    const t = db.shifts.find(s => s.id === id)
    return t?.courseId === ucId
  })

  const novoPedido = {
    id: Date.now(), // ID fictício único
    shiftId: turnoAtual,
    studentId: alunoId,
    response: null,
    alternativeShiftId: novoTurnoId,
    responseSeenByStudent: false
  }

  // Guardar em localStorage (simular backend)
  const existentes = JSON.parse(localStorage.getItem("shiftRequests") || "[]")
  existentes.push(novoPedido)
  localStorage.setItem("shiftRequests", JSON.stringify(existentes))

  alert("Pedido de troca registado com sucesso!")
}
</script>

<style scoped>
.uc-table-container {
  overflow-x: auto;
}

.uc-table {
  width: 100%;
  border-collapse: collapse;
}

.uc-table th,
.uc-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.uc-table th {
  background-color: #555;
  color: #fff;
  font-weight: 600;
}

.uc-table tr:nth-child(even) {
  background-color: #fafafa;
}

.highlight {
  background-color: #fef08a !important;
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

.swap-btn {
  background-color: #e0b4b4;
  color: #fff;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.swap-btn:hover {
  background-color: #cc9b9b;
}
</style>
