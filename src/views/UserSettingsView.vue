<script setup lang="ts">
  import { ref } from "vue";
  import { RouterLink } from "vue-router";
  import supabase from "../api";

  let password1_input_icon = ref("circle-exclamation");
  let password2_input_icon = ref("circle-exclamation");
  let email_input_icon = ref("circle-exclamation");
  let password_input_icon = ref("circle-exclamation");
  let is_data_being_sent = ref(false);
  let api_response = ref("");

  function ToggleModal(type: string, command: string) {
    let modal = undefined;

    if (type === "email") {
      modal = document.getElementById("modal_email") as HTMLElement;
    } else if (type === "password") {
      modal = document.getElementById("modal_password") as HTMLElement;
    }

    if (command === "open") {
      modal?.classList.add("is-active");
    } else {
      modal?.classList.remove("is-active");
      api_response.value = "";
    }
  }

  function InformUserAboutInputtedData_PasswordForm(
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
      switch (element) {
        case "password1":
          password1_input_icon.value = "circle-exclamation";
          break;
        case "password2":
          password2_input_icon.value = "circle-exclamation";
          break;
      }
    } else {
      input.classList.remove("is-danger");
      input.classList.add("is-success");
      helper.innerHTML = message;
      helper.classList.remove("is-danger");
      helper.classList.add("is-success");
      icon.classList.remove("is-hidden");
      switch (element) {
        case "password1":
          password1_input_icon.value = "check";
          break;
        case "password2":
          password2_input_icon.value = "check";
          break;
      }
    }
  }

  function CheckUsersInputtedData_PasswordForm() {
    const password1_input = document.getElementById("password1_input") as HTMLFormElement;
    const password1_helper = document.getElementById("password1_helper") as HTMLElement;
    const password1_icon = document.getElementById("password1_icon") as HTMLElement;

    const password2_input = document.getElementById("password2_input") as HTMLFormElement;
    const password2_helper = document.getElementById("password2_helper") as HTMLElement;
    const password2_icon = document.getElementById("password2_icon") as HTMLElement;

    let is_password1_good: boolean = false;
    let is_password2_good: boolean = false;

    const password_regex: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
    const password_regex_testing = password_regex.exec(password1_input.value);

    if (password1_input.value.length === 0) {
      InformUserAboutInputtedData_PasswordForm(
        "password1",
        password1_input,
        password1_helper,
        password1_icon,
        "Don't leave this field empty.",
        "BAD"
      );
    } else if (password1_input.value.length < 8) {
      InformUserAboutInputtedData_PasswordForm(
        "password1",
        password1_input,
        password1_helper,
        password1_icon,
        "Password too short. Minimum number of characters is 8.",
        "BAD"
      );
    } else if (password1_input.value.length > 64) {
      InformUserAboutInputtedData_PasswordForm(
        "password1",
        password1_input,
        password1_helper,
        password1_icon,
        "Password too long. Maximum number of characters is 64.",
        "BAD"
      );
    } else if (!password_regex_testing) {
      InformUserAboutInputtedData_PasswordForm(
        "password1",
        password1_input,
        password1_helper,
        password1_icon,
        "Invalid characters. Enter at least one upper case English letter, one lower case English letter, one number and one special character.",
        "BAD"
      );
    } else {
      InformUserAboutInputtedData_PasswordForm(
        "password1",
        password1_input,
        password1_helper,
        password1_icon,
        "Password is looking good.",
        "GOOD"
      );
      is_password1_good = true;
    }

    if (password2_input.value.length === 0) {
      InformUserAboutInputtedData_PasswordForm(
        "password2",
        password2_input,
        password2_helper,
        password2_icon,
        "Don't leave this field empty.",
        "BAD"
      );
    } else if (password2_input.value !== password1_input.value) {
      InformUserAboutInputtedData_PasswordForm(
        "password2",
        password2_input,
        password2_helper,
        password2_icon,
        "Passwords are not the same.",
        "BAD"
      );
    } else {
      InformUserAboutInputtedData_PasswordForm(
        "password2",
        password2_input,
        password2_helper,
        password2_icon,
        "Passwords match.",
        "GOOD"
      );
      is_password2_good = true;
    }

    if (is_password1_good && is_password2_good) {
      return true;
    } else {
      return false;
    }
  }

  async function UpdatePassword() {
    const reset_token = localStorage.getItem("reset_token");

    if (reset_token !== null) {
      const submit_button = document.getElementById("submit_button") as HTMLElement;
      submit_button.classList.add("is-loading");

      if (CheckUsersInputtedData_PasswordForm()) {
        is_data_being_sent.value = true;

        const supabase_token_dirty: any = localStorage.getItem("supabase.auth.token");
        const supabase_token = JSON.parse(supabase_token_dirty);

        const email_input = supabase_token.currentSession.user.email;
        const password1_input = document.getElementById("password1_input") as HTMLFormElement;

        const { user, error } = await supabase.auth.update({
          email: email_input,
          password: password1_input.value,
        });

        if (user !== null) {
          sessionStorage.setItem("annima_user_uuid", supabase_token.currentSession.user.id);
          ToggleModal("password", "open");
        }

        if (error !== null) {
          api_response.value = error.message;
          console.log(error);
          ToggleModal("password", "open");
        }
      }

      submit_button.classList.remove("is-loading");
      is_data_being_sent.value = false;
    }
  }

  function InformUserAboutInputtedData_EmailForm(
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

  function CheckUsersInputtedData_EmailForm() {
    const email_input = document.getElementById("email_input") as HTMLFormElement;
    const email_helper = document.getElementById("email_helper") as HTMLElement;
    const email_icon = document.getElementById("email_icon") as HTMLElement;

    const password_input = document.getElementById("password_input") as HTMLFormElement;
    const password_helper = document.getElementById("password_helper") as HTMLElement;
    const password_icon = document.getElementById("password_icon") as HTMLElement;

    let is_email_good: boolean = false;
    let is_password_good: boolean = false;

    const email_regex: RegExp = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
    const email_regex_testing = email_regex.exec(email_input.value);

    if (email_input.value.length === 0) {
      InformUserAboutInputtedData_EmailForm(
        "email",
        email_input,
        email_helper,
        email_icon,
        "Don't leave this field empty.",
        "BAD"
      );
    } else if (email_input.value.length < 8) {
      InformUserAboutInputtedData_EmailForm(
        "email",
        email_input,
        email_helper,
        email_icon,
        "Email too short. Minimum number of characters is 8.",
        "BAD"
      );
    } else if (email_input.value.length > 64) {
      InformUserAboutInputtedData_EmailForm(
        "email",
        email_input,
        email_helper,
        email_icon,
        "Email too long. Maximum number of characters is 64.",
        "BAD"
      );
    } else if (!email_regex_testing) {
      InformUserAboutInputtedData_EmailForm(
        "email",
        email_input,
        email_helper,
        email_icon,
        "Not a valid email.",
        "BAD"
      );
    } else {
      InformUserAboutInputtedData_EmailForm(
        "email",
        email_input,
        email_helper,
        email_icon,
        "Email is looking good.",
        "GOOD"
      );
      is_email_good = true;
    }

    if (password_input.value.length === 0) {
      InformUserAboutInputtedData_EmailForm(
        "password",
        password_input,
        password_helper,
        password_icon,
        "Don't leave this field empty.",
        "BAD"
      );
    } else {
      InformUserAboutInputtedData_EmailForm(
        "password",
        password_input,
        password_helper,
        password_icon,
        "",
        "GOOD"
      );
      is_password_good = true;
    }

    if (is_email_good && is_password_good) {
      return true;
    } else {
      return false;
    }
  }

  async function UpdateEmail() {
    const submit_button = document.getElementById("submit_button") as HTMLElement;
    submit_button.classList.add("is-loading");

    if (CheckUsersInputtedData_EmailForm()) {
      is_data_being_sent.value = true;

      const email_input = document.getElementById("email_input") as HTMLFormElement;
      const password_input = document.getElementById("password_input") as HTMLFormElement;

      const { user, error } = await supabase.auth.update({
        email: email_input.value,
        password: password_input.value,
      });

      if (error !== null) {
        api_response.value = error.message;
        console.log(error);
        ToggleModal("email", "open");
      }
    }

    submit_button.classList.remove("is-loading");
    is_data_being_sent.value = false;
  }
</script>

<template>
  <main>
    <div class="is-mobile mt-4">
      <div class="column is-10 is-offset-1">
        <h1 class="is-size-2 has-text-centered">Settings</h1>

        <div class="card mt-5 mb-5">
          <div class="card-content p-4">
            <h1 class="is-size-4 has-text-centered mb-4">Update password</h1>
            <article class="message is-warning">
              <div class="message-header">
                <p>Warning</p>
              </div>
              <div class="message-body">
                <p>Use this form when you're resetting password via link in email only!</p>
              </div>
            </article>

            <div class="field">
              <label class="label">Password</label>
              <div class="control has-icons-left has-icons-right">
                <input
                  class="input"
                  type="password"
                  placeholder="sR9ESQ7sdYzdJ0E07"
                  id="password1_input"
                  :readonly="is_data_being_sent"
                  required
                />
                <span class="icon is-small is-left">
                  <Icon icon="lock" />
                </span>
                <span class="icon is-small is-right is-hidden" id="password1_icon">
                  <Icon :icon="password1_input_icon" />
                </span>
              </div>
              <p class="help" id="password1_helper"></p>
            </div>
            <div class="field">
              <label class="label">Password again</label>
              <div class="control has-icons-left has-icons-right">
                <input
                  class="input"
                  type="password"
                  placeholder="sR9ESQ7sdYzdJ0E07"
                  id="password2_input"
                  :readonly="is_data_being_sent"
                  required
                />
                <span class="icon is-small is-left">
                  <Icon icon="lock" />
                </span>
                <span class="icon is-small is-right is-hidden" id="password2_icon">
                  <Icon :icon="password2_input_icon" />
                </span>
              </div>
              <p class="help" id="password2_helper"></p>
            </div>
            <div class="field is-grouped mt-6">
              <div class="control is-flex is-flex-direction-row is-justify-content-center spread">
                <button
                  class="button is-link"
                  @click="UpdatePassword()"
                  :disabled="is_data_being_sent"
                  id="submit_button"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="card mt-5 mb-5">
          <div class="card-content p-4">
            <h1 class="is-size-4 has-text-centered mb-4">Update email</h1>
            <article class="message is-info">
              <div class="message-header">
                <p>Tip</p>
              </div>
              <div class="message-body">
                <p>You'll have to confirm your new email after you change it.</p>
              </div>
            </article>

            <div class="field">
              <label class="label">New email</label>
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
              <label class="label">Current password</label>
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
            <div class="field is-grouped mt-6">
              <div class="control is-flex is-flex-direction-row is-justify-content-center spread">
                <button
                  class="button is-link"
                  @click="UpdateEmail()"
                  :disabled="is_data_being_sent"
                  id="submit_button"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <div class="modal" id="modal_password">
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title" v-if="api_response !== ''">Password updated successfully</p>
        <p class="modal-card-title" v-else>Error</p>
        <button class="delete" aria-label="close" @click="ToggleModal('password', 'close')"></button>
      </header>
      <section class="modal-card-body" v-if="api_response !== ''">
        {{ api_response }}
      </section>
      <footer class="modal-card-foot is-flex is-flex-direction-row is-justify-content-center">
        <button class="button" @click="ToggleModal('password', 'close')">Close</button>
      </footer>
    </div>
  </div>

  <div class="modal" id="modal_email">
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title" v-if="api_response !== ''">Email updated successfully/p></p>
        <p class="modal-card-title" v-else>Error</p>
        <button class="delete" aria-label="close" @click="ToggleModal('email', 'close')"></button>
      </header>
      <section class="modal-card-body" v-if="api_response !== ''">
        {{ api_response }}
      </section>
      <footer class="modal-card-foot is-flex is-flex-direction-row is-justify-content-center">
        <button class="button" @click="ToggleModal('email', 'close')">Close</button>
      </footer>
    </div>
  </div>
</template>
