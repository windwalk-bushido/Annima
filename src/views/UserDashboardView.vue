<script>
  export default {
    methods: {
      TriggerNavMenu() {
        this.$root.ToggleMenu();
      },
    },

    mounted() {
      this.TriggerNavMenu();
    },
  };
</script>

<template>
  <main>
    <h1>Dashboard</h1>
  </main>
</template>
