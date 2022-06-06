<script>
  import { RouterLink, RouterView } from "vue-router";

  export default {
    data() {
      return {
        menu_active: false,
      };
    },

    methods: {
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
    },
  };
</script>

<template>
  <header>
    <nav class="navbar is-dark">
      <div class="navbar-brand">
        <RouterLink class="navbar-item logo" to="/">Annima</RouterLink>
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

  <RouterView />
</template>

<style>
  .logo {
    font-size: 1.5rem;
    font-family: "Playball", cursive;
  }
</style>
