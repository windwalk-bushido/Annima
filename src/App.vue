<script setup>
  import { ref } from "vue";
  import { RouterLink, RouterView, useRouter } from "vue-router";

  const router = useRouter();

  let menu_active = ref(false);
  let user_logged_in = ref(false);

  function NavBarLoggedIn() {
    user_logged_in.value = true;
  }

  function NavBarNormal() {
    user_logged_in.value = false;
  }

  function ToggleMenu(command) {
    const menu_icon = document.getElementById("navbar-burger");
    const menu_links = document.getElementById("navbar-menu");

    if (command === 0) {
      menu_active.value = !menu_active.value;
    } else {
      menu_active.value = false;
    }

    if (menu_active.value) {
      menu_icon.classList.add("is-active");
      menu_links.classList.add("is-active");
    } else {
      menu_icon.classList.remove("is-active");
      menu_links.classList.remove("is-active");
    }
  }

  function LogoutUser() {
    sessionStorage.removeItem("annima_user_uuid");
    localStorage.removeItem("annima_user_uuid");
    localStorage.removeItem("annima_signed-in_date");

    NavBarNormal();
    router.push("/login");
  }
</script>

<template>
  <header class="is-relative">
    <nav class="navbar is-dark is-floating is-fixed-top">
      <div class="navbar-brand">
        <RouterLink class="navbar-item is-logo" to="/user/dashboard" v-if="user_logged_in">Annima</RouterLink>
        <RouterLink class="navbar-item is-logo" to="/" v-else>Annima</RouterLink>
        <a
          role="button"
          class="navbar-burger"
          id="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          @click="ToggleMenu(0)"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div class="navbar-menu" id="navbar-menu">
        <div class="navbar-end">
          <RouterLink class="navbar-item" to="/user/dashboard" v-if="user_logged_in">Dashboard</RouterLink>
          <RouterLink class="navbar-item" to="/" v-else>Home</RouterLink>
          <RouterLink class="navbar-item" to="/user/settings" v-if="user_logged_in">Settings</RouterLink>
          <RouterLink class="navbar-item" to="/about" v-else>About</RouterLink>
          <div class="navbar-item" v-if="user_logged_in">
            <button class="button is-light" @click="LogoutUser">Logout</button>
          </div>
          <div class="navbar-item" v-else>
            <div class="buttons">
              <RouterLink class="button is-primary" to="/register">Sign up</RouterLink>
              <RouterLink class="button is-light" to="/login">Sign in</RouterLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <main class="is-lowered-down">
    <RouterView />
  </main>
</template>

<style>
  .is-logo {
    font-size: 1.5rem;
    font-family: "Playball", cursive;
  }

  .is-floating {
    position: absolute;
  }

  .is-lowered-down {
    margin-top: 4.25rem;
  }
</style>
