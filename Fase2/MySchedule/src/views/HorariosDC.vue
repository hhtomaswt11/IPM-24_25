<template>
  <div class="horarios-container">
    <Horarios />
  </div>
</template>

<script setup>
import Horarios from '@/components/Horarios.vue'
</script>

<style scoped>
.horarios-container {
  height: 100vh;
  overflow: auto;
}
</style>