import { readFileSync } from 'fs';
import { join } from 'path';
import { loadDB } from './server.js'; 


// Função para obter o nome da Unidade Curricular com base no ID do curso
export const getUnidadeCurricular = (courseID) => {
  const db = loadDB();
  const courses = db.courses || [];
  
  // Encontrar o curso pelo courseID
  const curso = courses.find(c => c.id === courseID);
  
  // Retornar o nome da UC ou uma mensagem de erro
  return curso ? curso.name : 'Unidade Curricular Não Encontrada';
};
