<script>
  export default {
    methods: {
      CloseNav() {
        this.$root.ToggleMenu();
      },
    },

    mounted() {
      this.CloseNav();
    },
  };
</script>

<template>
  <main>
    <h1>Head to Menu -> Sign up</h1>
  </main>
</template>
