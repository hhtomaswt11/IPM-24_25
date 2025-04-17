import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMensagensStore = defineStore('mensagens', () => {
  const mensagens = ref([]);

  const mensagensNaoLidas = computed(() =>
    mensagens.value.filter(m => !m.enviada && !m.lida).length
  );

  async function carregarMensagens() {
    const res = await fetch('http://localhost:3000/mensagens');
    mensagens.value = await res.json();
  }

  async function marcarComoLida(id: number) {
    await fetch(`http://localhost:3000/mensagens/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lida: true }),
    });
    await carregarMensagens(); // 🔁 atualizar após alteração
  }

  return {
    mensagens,
    mensagensNaoLidas,
    carregarMensagens,
    marcarComoLida
  };
});
