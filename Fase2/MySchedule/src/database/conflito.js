import { getEstatuto } from './aluno.js';
import { getUnidadeCurricular } from './uc.js'; 
import { loadDB } from './server.js'; 
import { getTurnos } from './shifts.js';
import { getNumero } from './aluno.js';

// Função para obter os conflitos tratados e preenchidos
export const getConflitos = () => {
    const db = loadDB();
    const conflitos = db.conflicts || [];
    const tratados = [];
    
    conflitos.forEach(conflito => {
      const { studentId, courseIDs } = conflito;
      
      // Garantir que estamos tratando o segundo courseID
      const courseID = courseIDs[1]; // Ignorando o primeiro e pegando o segundo
  
      // Buscando o nome da Unidade Curricular
      const uc = getUnidadeCurricular(courseID);

      const turnos = getTurnos(courseID);
  
      // Criando uma nova entrada para cada courseID
      tratados.push({
        tipo: 'Conflito',  // Coluna Tipo
        numero: getNumero(studentId), // Coluna Número (studentId)
        estatuto: getEstatuto(studentId), // Obtém o Estatuto do aluno
        uc: uc, // Nome da Unidade Curricular
        turnoAtual: '-----', // Exemplo de Turno Atual, será preenchido conforme necessário
        alteracao: turnos, // Pode ser alterado para um dropdown mais tarde
        escolha: '', 
        capacidade: '-----', // Inicialmente vazio, pode ser atualizado mais tarde
        decisao: 'Atualizar' // Inicialmente com o valor "Atualizar"
      });
    });
  
    return tratados;
  };