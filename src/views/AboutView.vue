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
    <h1>About</h1>
  </main>
</template>
