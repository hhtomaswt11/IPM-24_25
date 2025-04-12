<template>
    <div class="tabela-uc">
      <h2 class="titulo-uc">{{ titulo }}</h2>
      <table>
        <thead>
          <tr>
            <th>Turno</th>
            <th>Sala</th>
            <th>Capacidade</th>
            <th>Taxa Ocupação</th>
            <th>Nº Alunos</th>
            <th>Hora</th>
            <th>Dia</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(turno, index) in turnos" :key="index">
            <td>{{ turno.name }}</td>
            <td>{{ getClassroom(turno.classroomId).name }}</td>
            <td>{{ getClassroom(turno.classroomId).capacity }}</td>
            <td>{{ (turno.totalStudentsRegistered / getClassroom(turno.classroomId).capacity * 100).toFixed(0) }}%</td>
            <td>{{ turno.totalStudentsRegistered }}</td>
            <td>{{ formatTime(turno.from) }} - {{ formatTime(turno.to) }}</td>
            <td>{{ turno.day }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    titulo: {
      type: String,
      required: true
    },
    turnos: {
      type: Array,
      required: true
    },
    classrooms: {
      type: Array,
      required: true
    }
  })
  
  const getClassroom = (classroomId) => {
    return props.classrooms.find(classroom => classroom.id === classroomId)
  }
  
  const formatTime = (hour) => {
    const hours = Math.floor(hour)
    const minutes = (hour % 1) * 60
    return `${String(hours).padStart(2, '0')}:${String(Math.round(minutes)).padStart(2, '0')}`
  }
  </script>
  
  <style scoped>
  .tabela-uc {
    margin-top: 2rem;
  }
  
  .titulo-uc {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
  }
  
  th, td {
    padding: 8px;
    text-align: center;
    border: 1px solid #ccc;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  td {
    background-color: #f9f9f9;
  }
  </style>
  