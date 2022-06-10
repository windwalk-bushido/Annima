<script setup>
  import { onMounted } from "vue";

  function CloseNav() {
    this.$root.ToggleMenu();
  }

  function CheckIfUserIsNotLoggedIn() {
    const uuid_token_session = sessionStorage.getItem("annima_user_uuid");
    const uuid_token_storage = localStorage.getItem("annima_user_uuid");

    if (uuid_token_session === null || uuid_token_storage === null) {
      this.$router.push("/login");
      return true;
    } else {
      return false;
    }
  }

  onMounted(() => {
    CloseNav();
    if (!CheckIfUserIsNotLoggedIn()) {
      console.log("WORKS!");
      //FetchUsersData();
    }
  });
</script>

<template>
  <main>
    <h1>Settings</h1>
  </main>
</template>
