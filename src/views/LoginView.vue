<script>
  import { RouterLink } from "vue-router";
  import { createClient } from "@supabase/supabase-js";
  import { supabaseUrl, supabaseAnonKey } from "../api";

  export default {
    data() {
      return {
        email_icon_value: "circle-exclamation",
        password_icon_value: "circle-exclamation",
        sending_data: false,
      };
    },

    methods: {
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

        const kul_checkbox = document.getElementById("kul_checkbox");

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

        if (kul_checkbox.checked === true) {
          kul_checked = false;
        } else {
          kul_checked = true;
        }

        if (email_good && password_good) {
          return true;
        } else {
          return false;
        }
      },

      LoginUser() {
        if (this.CheckUserData()) {
          this.sending_data = true;

          const email_input = document.getElementById("email_input");
          const password_input = document.getElementById("password_input");

          const supabase = createClient(supabaseUrl, supabaseAnonKey);

          supabase.auth.signIn({
            email: email_input.value,
            password: password_input.value,
          });

          // REDIRECT USER TO THE DASHBOARD PAGE
        } else {
          this.sending_data = false;
        }
      },

      TriggerNavMenu() {
        this.$root.ToggleMenu();
      },
    },

    mounted() {
      this.TriggerNavMenu();
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
            <button class="button is-link" @click="LoginUser()" :disabled="sending_data">Submit</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
