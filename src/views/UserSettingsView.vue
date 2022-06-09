<script>
  export default {
    methods: {
      CloseNav() {
        this.$root.ToggleMenu();
      },

      CheckIfUserIsNotLoggedIn() {
        const uuid_token_session = sessionStorage.getItem("annima_user_uuid");
        const uuid_token_storage = localStorage.getItem("annima_user_uuid");

        if (uuid_token_session == null || uuid_token_storage == null) {
          this.$router.push("/login");
          return true;
        } else {
          return false;
        }
      },
    },

    mounted() {
      this.CloseNav();
      if (!this.CheckIfUserIsNotLoggedIn()) {
        console.log("WORKS!");
        //this.FetchUsersData();
      }
    },
  };
</script>

<template>
  <main>
    <h1>Settings</h1>
  </main>
</template>
