<template>
  <div v-if="uc" class="uc-container">
    <div class="uc-header">
      <h1>[24/25] {{ uc.name }}</h1>
      <span>Docente: {{ teacherName }}</span>
    </div>

    <TabelaTurnosAl :shifts="ucShifts" />

    <div class="uc-footer">
      <button class="gestao-btn">Gestão da UC</button>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import db from '@/database/trabalhodb.json'
import TabelaTurnosAl from '@/components/TabelaTurnosAl.vue'

const route = useRoute()
const router = useRouter()

const nome = route.params.nome.toLowerCase()
const uc = db.courses.find(c => c.name.toLowerCase().includes(nome))

if (!uc) {
  router.replace('/unidades')
}

const ucShifts = db.shifts.filter(s => s.courseId === uc.id)
const theoreticalShift = ucShifts.find(s => s.type === 'T')
const teacher = theoreticalShift ? db.teachers.find(t => t.id === theoreticalShift.teacherId) : null
const teacherName = teacher ? teacher.name : 'Desconhecido'
</script>

<style scoped>
.uc-container {
  max-width: 1200px;
  margin: auto;
  background: #fdf9f9;
  padding: 30px;
  border-radius: 8px;
  position: relative;
  min-height: 90vh;
}

.uc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.uc-header h1 {
  font-size: 26px;
  font-weight: 700;
  color: #1f2937;
}

.uc-header span {
  font-size: 16px;
  color: #444;
  text-decoration: underline;
}

.uc-footer {
  position: absolute;
  bottom: 30px;
  right: 30px;
}

.gestao-btn {
  background-color: #ffffff;
  border: 1px solid #d1d1d1;
  padding: 10px 30px;
  font-size: 15px;
  font-weight: 500;
  color: #444;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.gestao-btn:hover {
  background-color: #db8686;
  color: #fff;
}
</style>
