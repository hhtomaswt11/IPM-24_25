<template>
  <div class="search-bar">
    <img src="@/components/icons/Lupa.svg" alt="Ícone de Lupa" />
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      :placeholder="placeholderText || 'Pesquise uma mensagem'"
    />
  </div>
</template>

<script setup>
defineProps(['modelValue', 'placeholderText']); // Definindo a propriedade placeholderText
defineEmits(['update:modelValue']);
</script>

<style scoped>
.search-bar {
  width: 250px;
  height: 53px;
  background-color: #FFFBFB;
  border: 1px solid #dad6d6;

  display: flex;
  align-items: center;
  padding: 0 6px;
  position: relative;
}

.search-bar input {
  flex-grow: 1;
  border: none;
  background: none;
  font-size: 14px;
  margin-bottom: -2px;

  color: #020202;
  outline: none;
  font-family: "Meera Inimai", sans-serif;
  padding-left: 30px;
}

.search-bar img {
  width: 24px;
  height: 24px; 
  position: absolute;
  left: 10px;
  opacity: 0.6;
}

.search-bar input::placeholder {
  color: #676565;
}

.search-bar input:focus::placeholder {
  visibility: hidden;
}
</style>
