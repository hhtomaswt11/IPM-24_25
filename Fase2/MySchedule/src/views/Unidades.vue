<template>
    <div class="main-content">
      <div class="header">
        <BarraPesquisa v-model="searchQuery" placeholderText="Pesquisar pela Unidade Curricular" />
      </div>
 
      <!-- Agrupar cursos por ano -->
      <div v-for="year in groupedCourses" :key="year.year" class="year-container">
        <h1>{{ year.year }}º ano</h1>
        <div class="year-section">
          <div class="courses">
            <div v-for="course in year.courses" :key="course.id" class="course-card">
              <!-- UC -->
              <router-link :to="`/unidades/${course.name}`" class="course-name">
                <h3>{{ course.name }}</h3>
              </router-link>
  
              <!-- Docente e Turnos -->
              <div class="course-info">
                <p class="teacher-name">Docente: {{ getTeacherName(course.id) }}</p>
                <p class="shifts">Turnos: {{ getShifts(course.id) }}</p>

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
  
  export default {
    components: {
      BarraPesquisa,
    },
    data() {
      return {
        searchQuery: "",
        courses: trabalhodb.courses,
        shifts: trabalhodb.shifts,
        teachers: trabalhodb.teachers,
      };
    },
    computed: {
      // agrupar os cursos por ano e filtrar pela pesquisa
      groupedCourses() {
        const years = [1, 2, 3]; 
        return years.map(year => {
          const coursesForYear = this.courses.filter(course => 
            course.year === year && 
            course.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          );
          return {
            year,
            courses: coursesForYear
          };
        }).filter(yearGroup => yearGroup.courses.length > 0); // remover anos sem cursos
      },
    },
    methods: {
      getTeacherName(courseId) {
        const courseShifts = this.shifts.filter(shift => shift.courseId === courseId);
        if (courseShifts.length > 0) {
          const teacherId = courseShifts[0].teacherId;
          const teacher = this.teachers.find(teacher => teacher.id === teacherId);
          return teacher ? teacher.name : "Professor desconhecido";
        }
        return "Sem docente atribuído";
      },
      getShifts(courseId) {
        const courseShifts = this.shifts.filter(shift => shift.courseId === courseId);
        return courseShifts.map(shift => `${shift.day} ${shift.from}-${shift.to}`).join(", ");
      },
    },
  };
  </script>
  

  <style scoped>
.main-content {
    flex-grow: 1;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.header {
    display: flex;
    justify-content: flex-end;  
    align-items: center;
    margin-bottom: 10px;
    width: 100%;
}

.year-container {
    margin-bottom: 30px;
}

.year-container h1 {

    font-size: 2rem;
    color: #000000;
    margin-bottom: 15px;
    padding-bottom: 5px;
   /* border-bottom: 2px solid #eee; */ 
}

.year-section {
    background-color: #f9f5f5; 
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.courses {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
}

.course-card {
    text-align: center;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.2s;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.course-card:hover {
    transform: translateY(-3px);
}

.course-name {
    padding: 12px 15px;
    font-size: 0.5rem;
    background-color: #ffffff; 
    flex-grow: 1;
    display: flex;             
    align-items: center;       
    justify-content: center;   
}

.course-name h3 {
    font-size: 1.1rem;
    margin: 0;
    color: #333; 
    font-weight: 600;
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
</style>
