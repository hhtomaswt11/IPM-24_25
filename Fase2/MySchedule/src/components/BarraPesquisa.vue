<template>
  <div class="search-bar">
    <img src="@/components/icons/Lupa.svg" alt="Ícone de Lupa" />
    <input
      v-model="searchQuery"
      type="text"
      :placeholder="searchQuery ? '' : 'Pesquise uma mensagem'"
      @focus="searchQuery = ''"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const searchQuery = ref('');
</script>

<style scoped>
.search-bar {
  width: 250px;
  height: 53px;
  background-color: #FFFBFB;
  border: 1px solid #CEC9C9;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  position: relative;
}

.search-bar input {
  flex-grow: 1;
  border: none;
  background: none;
  font-size: 14px;
  color: #020202;
  outline: none;
  font-family: "Meera Inimai", sans-serif;
  padding-left: 30px;
}

.search-bar img {
  width: 20px;
  height: 20px;
  position: absolute;
  left: 10px;
  opacity: 0.6;
}

.search-bar input::placeholder {
  color: #020202;
}

.search-bar input:focus::placeholder {
  visibility: hidden;
}
</style>
