<script setup>
  import { onMounted, defineEmits } from "vue";
  import { useRouter } from "vue-router";

  const emit = defineEmits(["ToggleMenu"]);
  const router = useRouter();

  function CloseNavBar() {
    emit("ToggleMenu");
  }

  function CheckIfUserIsNotLoggedIn() {
    const uuid_token_session = sessionStorage.getItem("annima_user_uuid");
    const uuid_token_storage = localStorage.getItem("annima_user_uuid");

    if (uuid_token_session === null && uuid_token_storage === null) {
      router.push("/login");
      return false;
    } else {
      emit("NavBarLoggedIn");
      return true;
    }
  }

  onMounted(() => {
    CloseNavBar();
    if (CheckIfUserIsNotLoggedIn()) {
      //FetchUsersData();
    }
  });
</script>

<template>
  <main>
    <h1>Settings</h1>
  </main>
</template>
