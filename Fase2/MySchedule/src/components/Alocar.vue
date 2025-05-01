<template>
  <div v-if="visivel" class="overlay-fundo" @click.self="fecharOverlay">
    <transition name="slide-in">
      <div class="overlay-conteudo">
        <div class="lado-esquerdo">
          <div class="tabela-escala-wrapper">
            <TabelaHorario :horario="horarioVazio" tipo="pessoal" />
          </div>
        </div>
        <div class="lado-direito">
          <div v-if="studentData" class="info-item">
            <span class="label">Nome:</span>
            <span class="value">{{ studentData.name }}</span>
          </div>
          <div class="info-item">
            <span class="label">Número:</span>
            <span class="value">{{ aluno }}</span>
          </div>

          <!-- Cabeçalho com títulos -->
          <div class="colunas-opcoes cabecalho">
            <div class="coluna-opcao">
              <button class="botao-opcao">Unidades Curriculares</button>
            </div>
            <div class="coluna-opcao">
              <button class="botao-opcao">Turno Teórico</button>
            </div>
            <div class="coluna-opcao">
              <button class="botao-opcao">Turno Prático</button>
            </div>
          </div>

          <!-- Conjunto de colunas para cada curso inscrito -->
          <div v-for="(course, index) in enrolledCourses" :key="index" class="colunas-opcoes linha-opcoes">
            <div class="coluna-opcao">
              <div class="curso-retangulo" :title="course.name">
                {{ course.name }}
              </div>
            </div>
            <div class="coluna-opcao">
              <div class="dropdown">
                <select class="dropbox" v-model="selectedTheoretical[index]">
                  <option value="" disabled selected>Selecionar</option>
                  <option value="T1">T1</option>
                  <option value="T2">T2</option>
                  <option value="T3">T3</option>
                </select>
                <ChevronDown class="select-icon" />
              </div>
            </div>
            <div class="coluna-opcao">
              <div class="dropdown">
                <select class="dropbox" v-model="selectedPractical[index]">
                  <option value="" disabled selected>Selecionar</option>
                  <option value="P1">P1</option>
                  <option value="P2">P2</option>
                  <option value="P3">P3</option>
                </select>
                <ChevronDown class="select-icon" />
              </div>
            </div>
          </div>

          <!-- Mensagem se não houver cursos inscritos -->
          <div v-if="enrolledCourses.length === 0" class="mensagem-sem-cursos">
            Este aluno não está inscrito em nenhuma unidade curricular.
          </div>

          <!-- Botão Confirmar -->
          <div class="container-botao-confirmar">
            <button class="botao-confirmar" @click="salvarAlocacoes">Confirmar</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import TabelaHorario from './TabelaHorario.vue'
import axios from 'axios'

const props = defineProps({
  visivel: Boolean,
  aluno: String
})

// Dados do estudante
const studentData = ref(null)
const enrolledCourses = ref([])

// Criar tabela vazia com dias úteis e horas até às 18h
const horarioVazio = reactive({
  dias: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
  horas: ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  shifts: [],
  courses: [],
  classrooms: []
})

const emit = defineEmits(['fechar'])

function fecharOverlay() {
  emit('fechar')
}

// Buscar dados do estudante quando o componente for montado ou quando o aluno mudar
watch(() => props.aluno, async (newVal) => {
  if (newVal) {
    await fetchStudentData()
  }
}, { immediate: true })

// Função para buscar dados do estudante
async function fetchStudentData() {
  try {
    // Buscar todos os estudantes
    const studentsResponse = await axios.get('http://localhost:3000/students')
    // Encontrar o estudante pelo número
    const student = studentsResponse.data.find(s => s.num === props.aluno)
    
    if (student) {
      studentData.value = student
      
      // Buscar todos os cursos
      const coursesResponse = await axios.get('http://localhost:3000/courses')
      
      // Filtrar apenas os cursos em que o estudante está inscrito
      enrolledCourses.value = coursesResponse.data.filter(course => 
        student.enrolled.includes(parseInt(course.id))
      )
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
  }
}

// Armazenar as seleções dos turnos
const selectedTheoretical = ref([])
const selectedPractical = ref([])

// Inicializar arrays quando os cursos forem carregados
watch(enrolledCourses, (newCourses) => {
  selectedTheoretical.value = new Array(newCourses.length).fill('')
  selectedPractical.value = new Array(newCourses.length).fill('')
}, { immediate: true })

// Função para salvar as alocações
async function salvarAlocacoes() {
  // Criar objeto com as alocações
  const alocacoes = enrolledCourses.value.map((course, index) => {
    return {
      curso: course.name,
      turnoTeorico: selectedTheoretical.value[index],
      turnoPratico: selectedPractical.value[index]
    }
  })
  
  // Implementar lógica para salvar as alocações
  console.log('Alocações confirmadas:', alocacoes)
  fecharOverlay()
}
</script>

<style scoped>
:global(html),
:global(body) {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.overlay-fundo {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 99999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay-conteudo {
  display: flex;
  flex-direction: row;
  width: min(98vw, 1400px);
  height: min(95vh, 800px);
  max-height: 80%;
  background-color: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.lado-esquerdo {
  flex: 3;
  padding: 1.5rem;
  background-color: white;
  overflow-y: hidden;
  font-size: 1rem;
}

.lado-direito {
  flex: 2;
  background-color: #FFEFEF;
  overflow-y: auto;
  padding: 1.5rem;
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.3rem;
}

.info-item {
  display: flex;
  gap: 0.5rem;
  font-size: 1rem;
  align-items: center;
}

.label {
  color: black;
  font-weight: 600;
}

.value {
  color: black;
  font-weight: 400;
}

.info-item:first-of-type {
  margin-top: 3rem;
}

/* Tabela ajustada */
.tabela-escala-wrapper {
  transform: scale(0.75);
  transform-origin: top left;
  margin-top: 1.5rem;
  margin-left: 4rem;
}

/* Botões */
.botoes-wrapper {
  margin-top: 1.5rem;
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.botao-opcao {
  background-color: #DF9898;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  width: 160px; /* largura fixa para todos */
  height: 48px;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Novo estilo para o retângulo de curso */
.curso-retangulo {
  width: 160px; /* igual ao botão */
  height: 32px;
  background-color: white;
  border: 1px solid #BA7070;
  border-radius: 4px;
  color: black;
  font-family: 'Inter', sans-serif;
  font-size: 0.70rem;
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
  justify-content: left; /* Align text to start from left */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-sizing: border-box;
}

.dropdown {
  position: relative;
  display: inline-block;
  width: 160px; /* igual ao botão */
}

.dropbox {
  width: 100%;
  padding: 0.4rem 2rem 0.4rem 0.5rem;
  border: 1px solid #BA7070;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #333;
  appearance: none;
  background-color: #fff;
  height: 32px;
}

.select-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #BA7070;
  width: 1rem;
  height: 1rem;
}

.colunas-opcoes {
  margin-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.linha-opcoes {
  margin-top: 0.75rem;
}

.cabecalho {
  margin-bottom: 1rem;
}

.coluna-opcao {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

/* Botão Confirmar */
.container-botao-confirmar {
  margin-top: 2rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-end;
}

.botao-confirmar {
  background-color: #FFFBFB;
  color: #333;
  border: 1px solid #CEC9C9;
  padding: 0.6rem 2rem;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.botao-confirmar:hover {
  background-color: #f8f8f8;
}

/* Mensagem sem cursos */
.mensagem-sem-cursos {
  margin-top: 2rem;
  text-align: center;
  font-style: italic;
  color: #666;
}

/* Transições */
.slide-in-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-in-enter-active,
.slide-in-leave-active {
  transition: all 0.4s ease;
}

.slide-in-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-in-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Responsividade */
@media (max-width: 768px) {
  .overlay-conteudo {
    width: 95vw;
    height: 90vh;
  }

  .lado-esquerdo,
  .lado-direito {
    padding: 1rem;
    font-size: 0.9rem;
  }
}
</style>