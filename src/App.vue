<script setup lang="ts">
  import { ref } from "vue";
  import { RouterLink, RouterView, useRouter } from "vue-router";

  const router = useRouter();

  let is_menu_active = ref(false);
  let is_user_logged_in = ref(false);

  function NavBarLoggedIn() {
    is_user_logged_in.value = true;
  }

  function NavBarNormal() {
    is_user_logged_in.value = false;
  }

  function ToggleMenu(command: any) {
    const menu_icon = document.getElementById("navbar-burger");
    const menu_links = document.getElementById("navbar-menu");

    if (command === 0) {
      is_menu_active.value = !is_menu_active.value;
    } else {
      is_menu_active.value = false;
    }

    if (is_menu_active.value) {
      menu_icon?.classList.add("is-active");
      menu_links?.classList.add("is-active");
    } else {
      menu_icon?.classList.remove("is-active");
      menu_links?.classList.remove("is-active");
    }
  }

  function LogoutUser() {
    sessionStorage.removeItem("annima_user_uuid");
    localStorage.removeItem("annima_user_uuid");
    localStorage.removeItem("annima_signed-in_date");

    NavBarNormal();
    ToggleMenu(0);
    router.push({ name: "login" });
  }
</script>

<template>
  <header class="is-relative">
    <nav class="navbar is-dark is-floating is-fixed-top">
      <div class="navbar-brand">
        <RouterLink class="navbar-item is-logo" to="/user/dashboard" v-if="is_user_logged_in"
          >Annima</RouterLink
        >
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
          <RouterLink class="navbar-item" to="/user/dashboard" v-if="is_user_logged_in" @click="ToggleMenu(0)">
            Dashboard
          </RouterLink>
          <RouterLink class="navbar-item" to="/" v-else @click="ToggleMenu(0)">Home</RouterLink>
          <RouterLink class="navbar-item" to="/user/settings" v-if="is_user_logged_in" @click="ToggleMenu(0)">
            Settings
          </RouterLink>
          <RouterLink class="navbar-item" to="/about" v-else @click="ToggleMenu(0)">About</RouterLink>
          <div class="navbar-item" v-if="is_user_logged_in">
            <button class="button is-light" @click="LogoutUser">Logout</button>
          </div>
          <div class="navbar-item" v-else>
            <div class="buttons">
              <RouterLink class="button is-primary" to="/register" @click="ToggleMenu(0)">Sign up</RouterLink>
              <RouterLink class="button is-light" to="/login" @click="ToggleMenu(0)">Sign in</RouterLink>
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
