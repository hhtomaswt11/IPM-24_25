import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMensagensStore = defineStore('mensagens', () => {
  const mensagens = ref([]);
  let isLoading = ref(false);  // Adicionando a flag de carregamento

  // Função para carregar as mensagens
  async function carregarMensagens() {
    if (isLoading.value) return; // Impede que múltiplas requisições sejam feitas ao mesmo tempo
    isLoading.value = true;

    try {
      const res = await fetch('http://localhost:3000/mensagens');
      const data = await res.json();
      mensagens.value = data;
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
    } finally {
      isLoading.value = false;
    }
  }

  // Função para marcar uma mensagem como lida
  async function marcarComoLida(id) {
    try {
      const response = await fetch(`http://localhost:3000/mensagens/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lida: true })
      });

      if (response.ok) {
        await carregarMensagens();  // Recarrega as mensagens após a atualização
      } else {
        console.error('Erro ao marcar como lida:', response.status);
      }
    } catch (error) {
      console.error('Erro ao marcar como lida:', error);
    }
  }

  // Atualiza automaticamente de X em X segundos
  const iniciarAtualizacaoAutomatica = () => {
    carregarMensagens(); // carregar imediatamente
    setInterval(carregarMensagens, 5000); // a cada 5 segundos
  };

  // Computed para contar mensagens não lidas
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
