<script setup>
  import { onMounted, defineEmits } from "vue";

  const emit = defineEmits(["ToggleMenu"]);

  function CloseNav() {
    emit("ToggleMenu");
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
