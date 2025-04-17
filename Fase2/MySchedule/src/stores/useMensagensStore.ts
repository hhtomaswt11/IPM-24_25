import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMensagensStore = defineStore('mensagens', () => {
  const mensagens = ref([]);

  async function carregarMensagens() {
    try {
      const res = await fetch('http://localhost:3000/mensagens');
      const data = await res.json();
      mensagens.value = data;
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
    }
  }

  async function marcarComoLida(id: number) {
    try {
      await fetch(`http://localhost:3000/mensagens/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lida: true })
      });
      await carregarMensagens(); // Atualiza a lista após a alteração
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  }
  


  // Atualiza automaticamente de X em X segundos
  const iniciarAtualizacaoAutomatica = () => {
    carregarMensagens(); // carregar imediatamente
    setInterval(carregarMensagens, 5000); // a cada 5 segundos
  };

  const mensagensNaoLidas = computed(() =>
    mensagens.value.filter(m => !m.enviada && !m.lida).length
  );

  iniciarAtualizacaoAutomatica();

  return {
    mensagens,
    mensagensNaoLidas,
    carregarMensagens,
    marcarComoLida
  };
});
