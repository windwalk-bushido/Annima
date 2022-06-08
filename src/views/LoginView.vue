<script>
  import { RouterLink } from "vue-router";
  import { createClient } from "@supabase/supabase-js";
  import { supabaseUrl, supabaseKey } from "../api";

  export default {
    data() {
      return {
        email_icon_value: "circle-exclamation",
        password_icon_value: "circle-exclamation",
        sending_data: false,
      };
    },

    methods: {
      CloseNav() {
        this.$root.ToggleMenu();
      },

      HandleModal(command) {
        const modal = document.getElementById("modal");
        if (command === "open") {
          modal.classList.add("is-active");
        } else {
          modal.classList.remove("is-active");
        }
      },

      InformUser(element, input, helper, icon, message, type) {
        if (type === "BAD") {
          input.classList.add("is-danger");
          helper.innerHTML = message;
          helper.classList.add("is-danger");
          icon.classList.remove("is-hidden");
          element === "email"
            ? (this.email_icon_value = "circle-exclamation")
            : (this.password_icon_value = "circle-exclamation");
        } else {
          input.classList.remove("is-danger");
          helper.innerHTML = "";
          helper.classList.remove("is-danger");
          element === "email" ? (this.email_icon_value = "check") : (this.password_icon_value = "check");
        }
      },

      CheckUserData() {
        const email_input = document.getElementById("email_input");
        const email_helper = document.getElementById("email_helper");
        const email_icon = document.getElementById("email_icon");

        const password_input = document.getElementById("password_input");
        const password_helper = document.getElementById("password_helper");
        const password_icon = document.getElementById("password_icon");

        let email_good = false;
        let password_good = false;
        let kul_checked = false;

        if (email_input.value.length === 0) {
          this.InformUser(
            "email",
            email_input,
            email_helper,
            email_icon,
            "Don't leave this field empty.",
            "BAD"
          );
        } else {
          email_good = true;
        }

        if (password_input.value.length === 0) {
          this.InformUser(
            "password",
            password_input,
            password_helper,
            password_icon,
            "Don't leave this field empty.",
            "BAD"
          );
        } else {
          password_good = true;
        }

        if (email_good && password_good) {
          return true;
        } else {
          return false;
        }
      },

      async LoginUser() {
        const submit_btn = document.getElementById("submit_btn");
        submit_btn.classList.add("is-loading");

        if (this.CheckUserData()) {
          this.sending_data = true;

          const email_input = document.getElementById("email_input");
          const password_input = document.getElementById("password_input");

          const supabase = createClient(supabaseUrl, supabaseKey);

          let { user, error } = await supabase.auth.signIn({
            email: email_input.value,
            password: password_input.value,
          });

          if (user != "" && error === null) {
            localStorage.removeItem("supabase.auth.token");

            const kul_checkbox = document.getElementById("kul_checkbox");

            if (kul_checkbox.checked) {
              localStorage.setItem("annima_signed-in_date", new Date().toJSON().split("T")[0]);
              localStorage.setItem("annima_user_uuid", user.id);
            } else {
              sessionStorage.setItem("annima_user_uuid", user.id);
            }

            this.SwapNavBar();
            this.$router.push("/user/dashboard");
          } else {
            console.log(error);

            const email_input = document.getElementById("email_input");
            const email_helper = document.getElementById("email_helper");
            const email_icon = document.getElementById("email_icon");

            const password_input = document.getElementById("password_input");
            const password_helper = document.getElementById("password_helper");
            const password_icon = document.getElementById("password_icon");

            this.InformUser("email", email_input, email_helper, email_icon, "", "BAD");
            this.InformUser("password", password_input, password_helper, password_icon, "", "BAD");

            this.HandleModal("open");

            submit_btn.classList.remove("is-loading");
            this.sending_data = false;
          }
        } else {
          submit_btn.classList.remove("is-loading");
          this.sending_data = false;
        }
      },

      CheckIfUserIsLoggedIn() {
        const uuid_token_session = sessionStorage.getItem("annima_user_uuid");
        const uuid_token_storage = localStorage.getItem("annima_user_uuid");

        if (uuid_token_session != null || uuid_token_storage != null) {
          this.$root.CheckLoggedUser();
          this.$router.push("/user/dashboard");
        }
      },
    },

    mounted() {
      this.CloseNav();
      this.CheckIfUserIsLoggedIn();
    },
  };
</script>

<template>
  <main>
    <div class="is-mobile mt-4">
      <div class="column is-10 is-offset-1">
        <h1 class="is-size-2 has-text-centered mb-4">Login</h1>

        <div class="field">
          <label class="label">Email</label>
          <div class="control has-icons-left has-icons-right">
            <input
              class="input"
              type="email"
              placeholder="user@example.com"
              id="email_input"
              :readonly="sending_data"
              required
            />
            <span class="icon is-small is-left">
              <Icon icon="envelope" />
            </span>
            <span class="icon is-small is-right is-hidden" id="email_icon">
              <Icon :icon="email_icon_value" />
            </span>
          </div>
          <p class="help" id="email_helper"></p>
        </div>
        <div class="field">
          <label class="label">Password</label>
          <div class="control has-icons-left has-icons-right">
            <input
              class="input"
              type="password"
              placeholder="sR9ESQ7sdYzdJ0E07"
              id="password_input"
              :readonly="sending_data"
              required
            />
            <span class="icon is-small is-left">
              <Icon icon="lock" />
            </span>
            <span class="icon is-small is-right is-hidden" id="password_icon">
              <Icon :icon="password_icon_value" />
            </span>
          </div>
          <p class="help" id="password_helper"></p>
        </div>
        <div class="field mt-5">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" id="kul_checkbox" :disabled="sending_data" />
              Keep me logged in for 7 days
            </label>
          </div>
        </div>
        <div class="field is-grouped mt-5">
          <div class="control">
            <button class="button is-link" @click="LoginUser()" :disabled="sending_data" id="submit_btn">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>

  <div class="modal" id="modal">
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Error</p>
        <button class="delete" aria-label="close" @click="HandleModal('close')"></button>
      </header>
      <section class="modal-card-body">
        <h3 class="is-size-5 mb-4">Email and/or password is wrong.</h3>
        <p>Either data you've entered is wrong or we don't have an account with that email.</p>
      </section>
      <footer class="modal-card-foot">
        <RouterLink class="button" to="/register">Sign up</RouterLink>
        <button class="button is-primary" @click="HandleModal('close')">Try again</button>
      </footer>
    </div>
  </div>
</template>
