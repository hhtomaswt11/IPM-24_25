<template>
    <div class="pagina">
      <TabelaHorario :horario="horarioCurso" tipo="curso"/>
    </div>
  </template>
  
  <script setup>
import { ref, computed, onMounted } from 'vue'
import TabelaHorario from '@/components/TabelaHorario.vue'
  
const props = defineProps({
  studentId: {
    type: Number,
    required: true
  }
})

  const dias = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  
  const horas = []
  for (let i = 9; i <= 18; i++) {
    horas.push((i < 10 ? "0" : "") + i + ":00")
  }
  
// variáveis para guardar os dados da API
const students = ref([]);
const courses = ref([]);
const shifts = ref([]);
const classrooms = ref([]);

// Fetch dados
onMounted(async () => {
  const [resStudents, resCourses, resShifts, resClassrooms] = await Promise.all([
    fetch('http://localhost:3000/students'),
    fetch('http://localhost:3000/courses'),
    fetch('http://localhost:3000/shifts'),
    fetch('http://localhost:3000/classrooms')
  ]);

  students.value = await resStudents.json();
  courses.value = await resCourses.json();
  shifts.value = await resShifts.json();
  classrooms.value = await resClassrooms.json();
});

// Primeiro, descobrir quais são as UCs onde o aluno está inscrito
const ucsAluno = computed(() => {
  const aluno = students.value.find(s => Number(s.id) === props.studentId);
  return aluno ? aluno.enrolled : [];
});

// Depois, buscar TODOS os turnos dessas UCs
const turnosCurso = computed(() => {
  return shifts.value.filter(s => ucsAluno.value.includes(s.courseId));
});

// Finalmente, montar o horário
const horarioCurso = computed(() => ({
  dias,
  horas,
  shifts: turnosCurso.value,
  courses: courses.value,
  classrooms: classrooms.value
}));
</script>
  
  <style scoped>
  .pagina {
    padding: 1rem;
    max-width: 80%;
    margin: 0 auto;
    overflow: hidden; 
    position: relative;
  }
  </style>
  