import { reactive } from 'vue';

export function prepararTrocasDeSala({ classroomRequests, shifts, classrooms, teachers, courses }) {
  const trocas = [];

  for (const pedido of classroomRequests) {
    const teacher = teachers.find(t => t.id == pedido.teacherId);
    const shift = shifts.find(s => s.id == pedido.shiftId);
    const novaSala = classrooms.find(c => c.id == pedido.classroomId);
    const salaAtual = classrooms.find(c => c.id == shift?.classroomId);
    const uc = courses.find(c => c.id == shift?.courseId)?.name || '---';

    if (!teacher || !shift || !novaSala || !salaAtual) continue;

    trocas.push(reactive({
      tipo: 'Troca de Sala',
      numero: teacher.numero || '---',
      estatuto: '---',
      uc: uc, // Pode ser ajustado se necessário
      turnoAtual: salaAtual.name,
      alteracao: novaSala.name,
      capacidade: novaSala.capacity,
      decisao: 'Atualizar',
      teacherId: teacher.id,
      shiftId: shift.id,
      classroomRequestId: pedido.id,
      novaSalaId: novaSala.id
    }));
  }

  return trocas;
}
