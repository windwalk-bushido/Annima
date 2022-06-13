<script setup lang="ts">
  import { ref, defineEmits, onMounted } from "vue";
  import { RouterLink, useRouter } from "vue-router";
  import supabase from "../api";

  let email_input_icon = ref("circle-exclamation");
  let password_input_icon = ref("circle-exclamation");
  let is_data_being_sent = ref(false);
  let error_message = ref("");

  const emit = defineEmits(["NavBarLoggedIn"]);
  const router = useRouter();

  function ToggleModal(command: string) {
    const modal = document.getElementById("modal") as HTMLElement;
    if (command === "open") {
      modal.classList.add("is-active");
    } else {
      modal.classList.remove("is-active");
    }
  }

  function InformUserAboutInputtedData(
    element: string,
    input: HTMLFormElement,
    helper: HTMLElement,
    icon: HTMLElement,
    message: string,
    type: string
  ) {
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
      icon.classList.remove("is-hidden");
      element === "email" ? (email_input_icon.value = "check") : (password_input_icon.value = "check");
    }
  }

  function CheckUsersInputtedData() {
    const email_input = document.getElementById("email_input") as HTMLFormElement;
    const email_helper = document.getElementById("email_helper") as HTMLElement;
    const email_icon = document.getElementById("email_icon") as HTMLElement;

    const password_input = document.getElementById("password_input") as HTMLFormElement;
    const password_helper = document.getElementById("password_helper") as HTMLElement;
    const password_icon = document.getElementById("password_icon") as HTMLElement;

    let is_email_good: boolean = false;
    let is_password_good: boolean = false;

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
      InformUserAboutInputtedData("email", email_input, email_helper, email_icon, "", "GOOD");
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
      InformUserAboutInputtedData("password", password_input, password_helper, password_icon, "", "GOOD");
      is_password_good = true;
    }

    if (is_email_good && is_password_good) {
      return true;
    } else {
      return false;
    }
  }

  async function LoginUser() {
    const submit_button = document.getElementById("submit_button") as HTMLElement;
    submit_button.classList.add("is-loading");

    if (CheckUsersInputtedData()) {
      is_data_being_sent.value = true;

      const email_input = document.getElementById("email_input") as HTMLFormElement;
      const password_input = document.getElementById("password_input") as HTMLFormElement;

      const { user, error } = await supabase.auth.signIn({
        email: email_input.value,
        password: password_input.value,
      });

      if (user !== null && error === null) {
        // kul = Keep User Logged in
        const kul_checkbox = document.getElementById("kul_checkbox") as HTMLFormElement;

        if (kul_checkbox.checked) {
          localStorage.setItem("annima_user_uuid", user.id);
        } else {
          sessionStorage.setItem("annima_user_uuid", user.id);
        }

        emit("NavBarLoggedIn");
        router.push({ name: "dashboard" });
      } else {
        const email_input = document.getElementById("email_input") as HTMLFormElement;
        const email_helper = document.getElementById("email_helper") as HTMLElement;
        const email_icon = document.getElementById("email_icon") as HTMLElement;

        const password_input = document.getElementById("password_input") as HTMLFormElement;
        const password_helper = document.getElementById("password_helper") as HTMLElement;
        const password_icon = document.getElementById("password_icon") as HTMLElement;

        InformUserAboutInputtedData("email", email_input, email_helper, email_icon, "", "BAD");
        InformUserAboutInputtedData("password", password_input, password_helper, password_icon, "", "BAD");

        ToggleModal("open");
        if (error !== null) {
          error_message.value = error.message;
          console.log(error);
        }
      }
    }

    submit_button.classList.remove("is-loading");
    is_data_being_sent.value = false;
  }

  function CheckIfUserWantsToChangePassword() {
    const supabase_token = localStorage.getItem("supabase.auth.token");

    if (supabase_token !== null) {
      router.push({ name: "settings" });
    }
  }

  onMounted(() => {
    CheckIfUserWantsToChangePassword();
  });
</script>

<template>
  <main>
    <div class="column is-flex is-flex-direction-row is-justify-content-center spread">
      <div class="column main-width">
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
        <div class="field is-flex is-flex-direction-row is-justify-content-center spread">
          <RouterLink class="button is-ghost" to="/reset-password">Forgot password?</RouterLink>
        </div>
        <div class="field mt-5">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" id="kul_checkbox" :disabled="is_data_being_sent" />
              Keep me logged in
            </label>
          </div>
        </div>
        <div class="field is-grouped mt-6">
          <div class="control is-flex is-flex-direction-row is-justify-content-center spread">
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
      <footer class="modal-card-foot is-flex is-flex-direction-row is-justify-content-center">
        <RouterLink class="button" to="/register">Sign up</RouterLink>
        <button class="button is-primary" @click="ToggleModal('close')">Try again</button>
      </footer>
    </div>
  </div>
</template>
