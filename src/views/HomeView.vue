<script setup>
  import { onMounted, defineEmits } from "vue";

  const emit = defineEmits(["ToggleMenu"]);

  function CloseNavBar() {
    emit("ToggleMenu");
  }

  onMounted(() => {
    CloseNavBar();
  });
</script>

<template>
  <main>
    <h1>Head to Menu -> Sign up</h1>
  </main>
</template>
