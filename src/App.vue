<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div id="main" class="bg-blue-50" style="width: 100%; height: 100vh;">
    <NavBar />
    <RouterView />
  </div>
</template>

<style scoped></style>
