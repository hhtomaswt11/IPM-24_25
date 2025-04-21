import { loadDB } from './server.js';  // Importando a função loadDB para acessar os dados da base de dados

/**
 * Função para obter os turnos disponíveis para um curso com base no courseId.
 * @param {number} courseId - ID do curso.
 * @returns {Array} - Retorna um array de nomes dos turnos disponíveis para o curso.
 */
export const getTurnos = (courseId) => {
  const db = loadDB();  // Carrega os dados do banco de dados
  const shifts = db.shifts || [];  // Obtém os turnos da base de dados
  
  // Filtra os turnos que correspondem ao courseId
  const turnosDisponiveis = shifts.filter(shift => shift.courseId === courseId);
  
  // Retorna os nomes dos turnos disponíveis
  return turnosDisponiveis.map(shift => shift.name);
};
