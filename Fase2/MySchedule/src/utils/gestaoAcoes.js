import axios from 'axios';

export async function aceitarTrocaTurno(item, dadosFiltrados) {
  const studentId = item.studentId;
  const oldShiftId = item.turnoAtualId;
  const newShiftId = item.alternativeShiftId.id ?? item.alternativeShiftId; // suporta objeto ou id direto

  // 1. Remover alocação antiga
  const oldAllocations = await axios.get(`http://localhost:3000/allocations?studentId=${studentId}&shiftId=${oldShiftId}`);
  for (const alloc of oldAllocations.data) {
    await axios.delete(`http://localhost:3000/allocations/${alloc.id}`);
  }

  // 2. Criar nova alocação
  await axios.post("http://localhost:3000/allocations", {
    studentId,
    shiftId: newShiftId
  });

  // 3. Atualizar contadores dos turnos
  const oldShift = await axios.get(`http://localhost:3000/shifts/${oldShiftId}`);
  const newShift = await axios.get(`http://localhost:3000/shifts/${newShiftId}`);

  await axios.patch(`http://localhost:3000/shifts/${oldShiftId}`, {
    totalStudentsRegistered: oldShift.data.totalStudentsRegistered - 1
  });

  await axios.patch(`http://localhost:3000/shifts/${newShiftId}`, {
    totalStudentsRegistered: newShift.data.totalStudentsRegistered + 1
  });

  // 4. Remover o pedido de troca
  await axios.delete(`http://localhost:3000/shiftRequests/${item.shiftRequestId}`);

  // 5. Atualizar interface
  const index = dadosFiltrados.value.findIndex(d => d.shiftRequestId === item.shiftRequestId);
  if (index !== -1) dadosFiltrados.value.splice(index, 1);
}

export async function rejeitarTrocaTurno(item, dadosRef) {
  const { shiftRequestId } = item;

  await axios.delete(`http://localhost:3000/shiftRequests/${Number(shiftRequestId)}`);
  dadosRef.value = dadosRef.value.filter(d => d !== item);
}

export async function atualizarAlocacao(item, dadosRef, notifyFn) {
  const {
    tipo,
    studentId,
    turnoAtualId,
    classroomRequestId,
    shiftId,
    novaSalaId,
    escolha
  } = item;

  try {
    if (tipo === 'Troca de Sala') {
      await axios.delete(`http://localhost:3000/classroomRequests/${Number(classroomRequestId)}`);
      await axios.patch(`http://localhost:3000/shifts/${Number(shiftId)}`, {
        classroomId: Number(novaSalaId)
      });
      dadosRef.value = dadosRef.value.filter(d => d !== item);
      return;
    }

    if (!escolha) {
      alert('Por favor, selecione um turno para alteração.');
      return;
    }

    const novoShiftId = Number(escolha);

    const resAlocacoes = await axios.get('http://localhost:3000/allocations');
    const alocacoes = resAlocacoes.data;

    const alocacao = alocacoes.find(a =>
      a.studentId == studentId && a.shiftId == turnoAtualId
    );

    if (!alocacao) {
      console.error('Alocação não encontrada');
      return;
    }

    await axios.patch(`http://localhost:3000/allocations/${alocacao.id}`, {
      shiftId: novoShiftId
    });

    const turnoAtual = (await axios.get(`http://localhost:3000/shifts/${turnoAtualId}`)).data;
    const novoTurno = (await axios.get(`http://localhost:3000/shifts/${novoShiftId}`)).data;

    if (turnoAtual.totalStudentsRegistered > 0) {
      await axios.patch(`http://localhost:3000/shifts/${turnoAtualId}`, {
        totalStudentsRegistered: turnoAtual.totalStudentsRegistered - 1
      });
    }

    await axios.patch(`http://localhost:3000/shifts/${novoShiftId}`, {
      totalStudentsRegistered: (novoTurno.totalStudentsRegistered || 0) + 1
    });

    if (notifyFn) notifyFn();

    const conflitos = (await axios.get('http://localhost:3000/conflicts')).data;
    const conflito = conflitos.find(c =>
      c.studentId == studentId &&
      Array.isArray(c.shiftID) &&
      c.shiftID.includes(Number(turnoAtualId))
    );

    if (conflito) {
      await axios.delete(`http://localhost:3000/conflicts/${conflito.id}`);
      dadosRef.value = dadosRef.value.filter(d =>
        d.studentId != studentId || !conflito.shiftID.includes(Number(d.turnoAtualId))
      );
    } else {
      dadosRef.value = dadosRef.value.filter(d => d !== item);
    }

  } catch (error) {
    console.error('Erro ao atualizar alocação:', error);
    alert(`Erro: ${error.message}`);
  }
}
