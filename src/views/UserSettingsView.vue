<script setup>
  import { onMounted, defineEmits } from "vue";

  const emit = defineEmits(["ToggleMenu"]);

  function CloseNavBar() {
    emit("ToggleMenu");
  }

  onMounted(() => {
    CloseNavBar();
    //FetchUsersData();
  });
</script>

<template>
  <main>
    <h1>Settings</h1>
  </main>
</template>
