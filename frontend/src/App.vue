<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="nav">
      <RouterLink to="/" class="link">FORM</RouterLink>
      <RouterLink to="/table" class="link">TABLE</RouterLink>
  </div>
  <div class="main">
    <RouterView />
  </div>
</template>

<style scoped>
  .nav {
    text-align: center;
    font-size: 40px;
  }
  .nav .link {
    padding: 50px;
  }
  .main {
    margin-top: 50px;
  }
</style>
