<template>
    <div class="uc-container">
      <h1>Unidades Curriculares</h1>
      
      <div class="uc-table-container">
        <table class="uc-table">
          <thead>
            <tr>
              <th>Unidade Curricular</th>
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
            <tr v-for="shift in teacherShifts" :key="shift.id">
              <td>{{ getCourseName(shift.courseId) }}</td>
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
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import trabalhodb from '@/database/trabalhodb.json'
  
  const route = useRoute()
  const teacherId = ref(parseInt(route.params.id) || 1) // Default to teacher with ID 1 if not specified
  const teacherShifts = ref([])
  
  onMounted(() => {
    loadTeacherShifts()
  })
  
  function loadTeacherShifts() {
    // Filter shifts where teacherId matches
    teacherShifts.value = trabalhodb.shifts.filter(shift => shift.teacherId === teacherId.value)
  }
  
  function getCourseName(courseId) {
    const course = trabalhodb.courses.find(c => c.id === courseId)
    return course ? course.name : 'Unknown Course'
  }
  
  function getClassroomName(classroomId) {
    const classroom = trabalhodb.classrooms.find(c => c.id === classroomId)
    const building = classroom ? trabalhodb.buildings.find(b => b.id === classroom.buildingId) : null
    return classroom && building ? `${building.abbreviation} - ${classroom.name}` : 'Unknown'
  }
  
  function getClassroomCapacity(classroomId) {
    const classroom = trabalhodb.classrooms.find(c => c.id === classroomId)
    return classroom ? classroom.capacity : 0
  }
  
  function calculateOccupancyRate(shift) {
    const classroom = trabalhodb.classrooms.find(c => c.id === shift.classroomId)
    if (!classroom || classroom.capacity === 0) return 0
    return Math.round((shift.totalStudentsRegistered / classroom.capacity) * 100)
  }
  
  function getOccupancyClass(shift) {
    const rate = calculateOccupancyRate(shift)
    if (rate >= 80) return 'high-occupancy'
    if (rate >= 50) return 'medium-occupancy'
    return 'low-occupancy'
  }
  
  function formatTime(hour) {
    return `${hour}:00`
  }
  
  function translateDay(day) {
    const days = {
      'Monday': 'Segunda-feira',
      'Tuesday': 'Terça-feira',
      'Wednesday': 'Quarta-feira',
      'Thursday': 'Quinta-feira',
      'Friday': 'Sexta-feira'
    }
    return days[day] || day
  }
  </script>
  
  <style scoped>
  .uc-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  h1 {
    color: #2c3e50;
    margin-bottom: 20px;
  }
  
  .uc-table-container {
    overflow-x: auto;
  }
  
  .uc-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .uc-table th, .uc-table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .uc-table th {
    background-color: #f5f5f5;
    font-weight: 600;
    color: #333;
  }
  
  .uc-table tr:hover {
    background-color: #f9f9f9;
  }
  
  .high-occupancy {
    color: #ef4444;
    font-weight: 600;
  }
  
  .medium-occupancy {
    color: #f59e0b;
    font-weight: 600;
  }
  
  .low-occupancy {
    color: #10b981;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    .uc-table {
      display: block;
    }
    
    .uc-table thead {
      display: none;
    }
    
    .uc-table tr {
      display: block;
      margin-bottom: 15px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
    }
    
    .uc-table td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 15px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .uc-table td::before {
      content: attr(data-label);
      font-weight: 600;
      margin-right: 10px;
      color: #666;
    }
  }
  </style>