// Aluno.js
import { loadDB } from './server.js'; // Fazendo a importação para carregar os dados da base de dados

/**
 * Função para buscar o aluno pelo ID e retornar o "Estatuto".
 * @param {number} studentId - ID do aluno.
 * @returns {string} - O "Estatuto" do aluno: "Sim" ou "Não".
 */
export const getEstatuto = (studentId) => {
  const db = loadDB(); // Carrega o banco de dados
  const aluno = db.students.find(student => student.id === studentId); // Busca o aluno

  if (!aluno) {
    throw new Error(`Aluno com ID ${studentId} não encontrado`); // Lida com erro caso o aluno não seja encontrado
  }

  return aluno.specialStatus ? 'Sim' : 'Não'; // Retorna "Sim" ou "Não" dependendo do status especial
};

export const getNumero = (studentId) => {
    const db = loadDB();
    const aluno = db.students.find(student => student.id === studentId);
    
    if (!aluno) return null;
    
    return aluno.numero;  // Retorna o número do aluno
  };
