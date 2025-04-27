<template>
  <div class="main-content">
    <div class="header">
      <DropDownAlternarSem />
      <DropDownAlternarAnos v-model:year="selectedYear" />
      <BarraPesquisa v-model="searchQuery" placeholderText="Pesquisar pela Unidade Curricular" />
    </div>

    <!-- Agrupar cursos por ano -->
    <div v-for="year in filteredCourses" :key="year.year" class="year-container">
      <h2>{{ year.year }}º ano</h2>
      <div class="year-section">
        <div class="courses">
          <div v-for="course in year.courses" :key="course.id" class="course-card">
            <!-- UC -->
            <router-link :to="`/unidades/${course.name}`" class="course-name">
              <h4>{{ course.name }}</h4>
            </router-link>

            <!-- Docente e Turnos -->
            <div class="course-info">
              <p class="teacher-name">Docente: {{ getTeacherName(course.id) }}</p>
              <!-- <p class="shifts">Turnos: {{ getShifts(course.id) }}</p> --> 
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BarraPesquisa from "@/components/BarraPesquisa.vue";
import trabalhodb from "@/database/trabalhodb.json";
import DropDownAlternarSem from "@/components/DropDownAlternarSem.vue";
import DropDownAlternarAnos from "@/components/DropDownAlternarAnos.vue";

export default {
  components: {
    BarraPesquisa,
    DropDownAlternarSem,
    DropDownAlternarAnos,
  },
  data() {
    return {
      searchQuery: "",
      courses: trabalhodb.courses,
      shifts: trabalhodb.shifts,
      teachers: trabalhodb.teachers,
      selectedYear: null, // Ano selecionado, iniciado como null
    };
  },
  computed: {
    // Filtrar os cursos com base no ano selecionado
    filteredCourses() {
      // Se não houver ano selecionado, mostrar todos os cursos
      if (!this.selectedYear) {
        return this.groupedCourses;
      }

      return this.groupedCourses.filter((yearGroup) => yearGroup.year === this.selectedYear);
    },
    groupedCourses() {
      const years = [1, 2, 3];
      return years.map((year) => {
        const coursesForYear = this.courses.filter(
          (course) =>
            course.year === year &&
            course.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
        return {
          year,
          courses: coursesForYear,
        };
      }).filter((yearGroup) => yearGroup.courses.length > 0); // Remover anos sem cursos
    },
  },
  methods: {
    getTeacherName(courseId) {
      const courseShifts = this.shifts.filter((shift) => shift.courseId === courseId);
      if (courseShifts.length > 0) {
        const teacherId = courseShifts[0].teacherId;
        const teacher = this.teachers.find((teacher) => teacher.id === teacherId);
        return teacher ? teacher.name : "Professor desconhecido";
      }
      return "Sem docente atribuído";
    },
    getShifts(courseId) {
      const courseShifts = this.shifts.filter((shift) => shift.courseId === courseId);
      return courseShifts.map((shift) => `${shift.day} ${shift.from}-${shift.to}`).join(", ");
    },
  },
};
</script>


  <style scoped>
.main-content {
    flex-grow: 1;
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;
}

.header {
    display: flex;
    justify-content: flex-end;  
    align-items: center;
    margin-bottom: 62px; /* ajustar ? */ 
    width: 100%;
}

.header > * {
  margin-right: 40px; /* Espaçamento entre os componentes */
}

.year-container {
    margin-bottom: 30px;
}

.year-container h2 {

    font-size: 1.65rem;
    color: #000000;
    margin-bottom: 15px;
    padding-bottom: 5px;
   /* border-bottom: 2px solid #eee; */ 
}

.year-section {
    background-color: #f9f5f5; 
    /* border-radius: 8px; */
  
    padding: 44.2px;
    border: 1px solid #dad6d6;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

}

.courses {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 57px;
}

.course-card {
    text-align: center;
    background-color: #ffffff;

    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.2s;
    display: flex;
    flex-direction: column;
    height: 100%;

    border: 1px solid #dad6d6;
    box-shadow: 0 4px 13px rgba(0, 0, 0, 0.1);

}

.course-card:hover {
    transform: translateY(-3px);
}

.course-name {

    padding: 12px 15px;
    background-color: #ffffff;
    flex-grow: 1;

        /* Centralizar o conteúdo */
        display: flex;
    justify-content: center; /* Centraliza horizontalmente */
    align-items: center; /* Centraliza verticalmente */
}

.course-name h4 {

    font-size: 1.1rem;
    margin: 0;
    color: #333;
    font-weight: 650;
    text-decoration: none;
}

.course-info {
 
    background-color: #fceace; 
    padding: 10px 15px;
    width: 100%;
    box-sizing: border-box;
    position: relative;
}

.course-info::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #fceace;
}

.teacher-name,
.shifts {
    font-size: 0.9rem;
    color: #000000;
    margin: 5px 0;
    line-height: 1.3;
}

.search-bar {
    margin: 0;
}

h2 {
  font-weight: bold;
}


</style>