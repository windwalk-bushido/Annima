<script>
  import { RouterLink, RouterView } from "vue-router";

  export default {
    data() {
      return {
        menu_active: false,
        user_logged_in: false,
      };
    },

    methods: {
      SwapNavBar() {
        const uuid_token_session = sessionStorage.getItem("annima_user_uuid");
        const uuid_token_storage = localStorage.getItem("annima_user_uuid");

        if (uuid_token_session != null || uuid_token_storage != null) {
          this.user_logged_in = true;
        } else {
          this.user_logged_in = false;
        }
      },

      ToggleMenu(command) {
        const menu_icon = document.getElementById("navbar-burger");
        const menu_links = document.getElementById("navbar-menu");

        if (command === 0) {
          this.menu_active = !this.menu_active;
        } else {
          this.menu_active = false;
        }

        if (this.menu_active) {
          menu_icon.classList.add("is-active");
          menu_links.classList.add("is-active");
        } else {
          menu_icon.classList.remove("is-active");
          menu_links.classList.remove("is-active");
        }
      },

      LogoutUser() {
        sessionStorage.removeItem("annima_user_uuid");
        localStorage.removeItem("annima_user_uuid");
        localStorage.removeItem("annima_signed-in_date");

        this.SwapNavBar();
        this.$router.push("/login");
      },
    },
  };
</script>

<template>
  <header class="is-relative">
    <nav class="navbar is-dark is-floating is-fixed-top" v-if="user_logged_in">
      <div class="navbar-brand">
        <RouterLink class="navbar-item is-logo" to="/user/dashboard">Annima</RouterLink>
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
          <RouterLink class="navbar-item" to="/user/dashboard">Dashboard</RouterLink>
          <RouterLink class="navbar-item" to="/user/settings">Settings</RouterLink>
          <div class="navbar-item">
            <button class="button is-light" @click="LogoutUser()">Logout</button>
          </div>
        </div>
      </div>
    </nav>

    <nav class="navbar is-dark is-floating is-fixed-top" v-else>
      <div class="navbar-brand">
        <RouterLink class="navbar-item is-logo" to="/">Annima</RouterLink>
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
          <RouterLink class="navbar-item" to="/">Home</RouterLink>
          <RouterLink class="navbar-item" to="/about">About</RouterLink>
          <div class="navbar-item">
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
