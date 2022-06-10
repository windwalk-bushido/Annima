<script setup>
  import { onMounted } from "vue";

  function CloseNav() {
    this.$root.ToggleMenu();
  }

  onMounted(() => {
    CloseNav();
  });
</script>

<template>
  <main>
    <h1>Head to Menu -> Sign up</h1>
  </main>
</template>
