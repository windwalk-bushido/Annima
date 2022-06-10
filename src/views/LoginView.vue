<script setup>
  import { ref, defineEmits } from "vue";
  import { RouterLink, useRouter } from "vue-router";
  import supabase from "../api";

  let email_input_icon = ref("circle-exclamation");
  let password_input_icon = ref("circle-exclamation");
  let is_data_being_sent = ref(false);
  let error_message = ref("");

  const emit = defineEmits(["NavBarLoggedIn"]);
  const router = useRouter();

  function ToggleModal(command) {
    const modal = document.getElementById("modal");
    if (command === "open") {
      modal.classList.add("is-active");
    } else {
      modal.classList.remove("is-active");
    }
  }

  function InformUserAboutInputtedData(element, input, helper, icon, message, type) {
    if (type === "BAD") {
      input.classList.add("is-danger");
      helper.innerHTML = message;
      helper.classList.add("is-danger");
      icon.classList.remove("is-hidden");
      element === "email"
        ? (email_input_icon.value = "circle-exclamation")
        : (password_input_icon.value = "circle-exclamation");
    } else {
      input.classList.remove("is-danger");
      helper.innerHTML = "";
      helper.classList.remove("is-danger");
      element === "email" ? (email_input_icon.value = "check") : (password_input_icon.value = "check");
    }
  }

  function CheckUsersInputtedData() {
    const email_input = document.getElementById("email_input");
    const email_helper = document.getElementById("email_helper");
    const email_icon = document.getElementById("email_icon");

    const password_input = document.getElementById("password_input");
    const password_helper = document.getElementById("password_helper");
    const password_icon = document.getElementById("password_icon");

    let is_email_good = false;
    let is_password_good = false;

    if (email_input.value.length === 0) {
      InformUserAboutInputtedData(
        "email",
        email_input,
        email_helper,
        email_icon,
        "Don't leave this field empty.",
        "BAD"
      );
    } else {
      is_email_good = true;
    }

    if (password_input.value.length === 0) {
      InformUserAboutInputtedData(
        "password",
        password_input,
        password_helper,
        password_icon,
        "Don't leave this field empty.",
        "BAD"
      );
    } else {
      is_password_good = true;
    }

    if (is_email_good && is_password_good) {
      return true;
    } else {
      return false;
    }
  }

  async function LoginUser() {
    const submit_button = document.getElementById("submit_button");
    submit_button.classList.add("is-loading");

    if (CheckUsersInputtedData()) {
      is_data_being_sent.value = true;

      const email_input = document.getElementById("email_input");
      const password_input = document.getElementById("password_input");

      const { user, error } = await supabase.auth.signIn({
        email: email_input.value,
        password: password_input.value,
      });

      if (user !== "" && error === null) {
        localStorage.removeItem("supabase.auth.token");

        // kul = Keep User Logged in
        const kul_checkbox = document.getElementById("kul_checkbox");

        if (kul_checkbox.checked) {
          localStorage.setItem("annima_signed-in_date", new Date().toJSON().split("T")[0]);
          localStorage.setItem("annima_user_uuid", user.id);
        } else {
          sessionStorage.setItem("annima_user_uuid", user.id);
        }

        emit("NavBarLoggedIn");
        router.push({ name: "dashboard" });
      } else {
        console.log(error);

        const email_input = document.getElementById("email_input");
        const email_helper = document.getElementById("email_helper");
        const email_icon = document.getElementById("email_icon");

        const password_input = document.getElementById("password_input");
        const password_helper = document.getElementById("password_helper");
        const password_icon = document.getElementById("password_icon");

        InformUserAboutInputtedData("email", email_input, email_helper, email_icon, "", "BAD");
        InformUserAboutInputtedData("password", password_input, password_helper, password_icon, "", "BAD");

        ToggleModal("open");
        error_message.value = error.message;

        submit_button.classList.remove("is-loading");
        is_data_being_sent.value = false;
      }
    } else {
      submit_button.classList.remove("is-loading");
      is_data_being_sent.value = false;
    }
  }
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
              :readonly="is_data_being_sent"
              required
            />
            <span class="icon is-small is-left">
              <Icon icon="envelope" />
            </span>
            <span class="icon is-small is-right is-hidden" id="email_icon">
              <Icon :icon="email_input_icon" />
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
              :readonly="is_data_being_sent"
              required
            />
            <span class="icon is-small is-left">
              <Icon icon="lock" />
            </span>
            <span class="icon is-small is-right is-hidden" id="password_icon">
              <Icon :icon="password_input_icon" />
            </span>
          </div>
          <p class="help" id="password_helper"></p>
        </div>
        <div class="field mt-5">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" id="kul_checkbox" :disabled="is_data_being_sent" />
              Keep me logged in for 7 days
            </label>
          </div>
        </div>
        <div class="field is-grouped mt-5">
          <div class="control">
            <button
              class="button is-link"
              @click="LoginUser()"
              :disabled="is_data_being_sent"
              id="submit_button"
            >
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
        <p class="modal-card-title">Error: {{ error_message }}</p>
        <button class="delete" aria-label="close" @click="ToggleModal('close')"></button>
      </header>
      <footer class="modal-card-foot">
        <RouterLink class="button" to="/register">Sign up</RouterLink>
        <button class="button is-primary" @click="ToggleModal('close')">Try again</button>
      </footer>
    </div>
  </div>
</template>
