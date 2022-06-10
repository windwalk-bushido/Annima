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
    <h1>About</h1>
  </main>
</template>
