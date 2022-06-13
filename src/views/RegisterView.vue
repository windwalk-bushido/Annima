<script setup lang="ts">
  import { ref } from "vue";
  import { RouterLink } from "vue-router";
  import supabase from "../api";

  let email_input_icon = ref("circle-exclamation");
  let password1_input_icon = ref("circle-exclamation");
  let password2_input_icon = ref("circle-exclamation");
  let is_data_being_sent = ref(false);

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

      switch (element) {
        case "email":
          email_input_icon.value = "circle-exclamation";
          break;
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
        case "email":
          email_input_icon.value = "check";
          break;
        case "password1":
          password1_input_icon.value = "check";
          break;
        case "password2":
          password2_input_icon.value = "check";
          break;
      }
    }
  }

  function CheckUsersInputtedData() {
    const email_input = document.getElementById("email_input") as HTMLFormElement;
    const email_helper = document.getElementById("email_helper") as HTMLElement;
    const email_icon = document.getElementById("email_icon") as HTMLElement;

    const password1_input = document.getElementById("password1_input") as HTMLFormElement;
    const password1_helper = document.getElementById("password1_helper") as HTMLElement;
    const password1_icon = document.getElementById("password1_icon") as HTMLElement;

    const password2_input = document.getElementById("password2_input") as HTMLFormElement;
    const password2_helper = document.getElementById("password2_helper") as HTMLElement;
    const password2_icon = document.getElementById("password2_icon") as HTMLElement;

    const toc_checkbox = document.getElementById("toc_checkbox") as HTMLFormElement;
    const toc_helper = document.getElementById("toc_helper") as HTMLElement;

    let is_email_good: boolean = false;
    let is_password1_good: boolean = false;
    let is_password2_good: boolean = false;
    let is_toc_checked: boolean = false;

    const email_regex: RegExp = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
    const email_regex_testing = email_regex.exec(email_input.value);

    if (email_input.value.length === 0) {
      InformUserAboutInputtedData(
        "email",
        email_input,
        email_helper,
        email_icon,
        "Don't leave this field empty.",
        "BAD"
      );
    } else if (email_input.value.length < 8) {
      InformUserAboutInputtedData(
        "email",
        email_input,
        email_helper,
        email_icon,
        "Email too short. Minimum number of characters is 8.",
        "BAD"
      );
    } else if (email_input.value.length > 64) {
      InformUserAboutInputtedData(
        "email",
        email_input,
        email_helper,
        email_icon,
        "Email too long. Maximum number of characters is 64.",
        "BAD"
      );
    } else if (!email_regex_testing) {
      InformUserAboutInputtedData("email", email_input, email_helper, email_icon, "Not a valid email.", "BAD");
    } else {
      InformUserAboutInputtedData(
        "email",
        email_input,
        email_helper,
        email_icon,
        "Email is looking good.",
        "GOOD"
      );
      is_email_good = true;
    }

    const password_regex: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
    const password_regex_testing = password_regex.exec(password1_input.value);

    if (password1_input.value.length === 0) {
      InformUserAboutInputtedData(
        "password1",
        password1_input,
        password1_helper,
        password1_icon,
        "Don't leave this field empty.",
        "BAD"
      );
    } else if (password1_input.value.length < 8) {
      InformUserAboutInputtedData(
        "password1",
        password1_input,
        password1_helper,
        password1_icon,
        "Password too short. Minimum number of characters is 8.",
        "BAD"
      );
    } else if (password1_input.value.length > 64) {
      InformUserAboutInputtedData(
        "password1",
        password1_input,
        password1_helper,
        password1_icon,
        "Password too long. Maximum number of characters is 64.",
        "BAD"
      );
    } else if (!password_regex_testing) {
      InformUserAboutInputtedData(
        "password1",
        password1_input,
        password1_helper,
        password1_icon,
        "Invalid characters. Enter at least one upper case English letter, one lower case English letter, one number and one special character.",
        "BAD"
      );
    } else {
      InformUserAboutInputtedData(
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
      InformUserAboutInputtedData(
        "password2",
        password2_input,
        password2_helper,
        password2_icon,
        "Don't leave this field empty.",
        "BAD"
      );
    } else if (password2_input.value !== password1_input.value) {
      InformUserAboutInputtedData(
        "password2",
        password2_input,
        password2_helper,
        password2_icon,
        "Passwords are not the same.",
        "BAD"
      );
    } else {
      InformUserAboutInputtedData(
        "password2",
        password2_input,
        password2_helper,
        password2_icon,
        "Passwords match.",
        "GOOD"
      );
      is_password2_good = true;
    }

    if (!toc_checkbox.checked) {
      toc_helper.innerHTML = "You have to agree in order to proceed.";
      toc_helper.classList.add("is-danger");
    } else {
      toc_helper.innerHTML = "You have agreed.";
      toc_helper.classList.remove("is-danger");
      toc_helper.classList.add("is-success");
      is_toc_checked = true;
    }

    if (is_email_good && is_password1_good && is_password2_good && is_toc_checked) {
      return true;
    } else {
      return false;
    }
  }

  async function RegisterUser() {
    const submit_button = document.getElementById("submit_button") as HTMLElement;
    submit_button.classList.add("is-loading");

    if (CheckUsersInputtedData()) {
      is_data_being_sent.value = true;

      const email_input = document.getElementById("email_input") as HTMLFormElement;
      const password1_input = document.getElementById("password1_input") as HTMLFormElement;

      const { user, error } = await supabase.auth.signUp({
        email: email_input.value,
        password: password1_input.value,
      });

      if (user !== null) {
        ToggleModal("open");
      }

      if (error !== null) {
        console.log(error);
      }
    }

    submit_button.classList.remove("is-loading");
    is_data_being_sent.value = false;
  }
</script>

<template>
  <div class="column is-flex is-flex-direction-row is-justify-content-center spread">
    <div class="column main-width">
      <h1 class="is-size-2 has-text-centered mb-4">Register</h1>

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
      <div class="field mt-5">
        <div class="control">
          <label class="checkbox">
            <input type="checkbox" id="toc_checkbox" :disabled="is_data_being_sent" required />
            I agree to the <a href="#">Terms and Conditions</a>
          </label>
        </div>
        <p class="help" id="toc_helper"></p>
      </div>
      <div class="field is-grouped mt-6">
        <div class="control is-flex is-flex-direction-row is-justify-content-center spread">
          <button
            aria-label="sign up button"
            type="button"
            class="button is-link"
            @click="RegisterUser()"
            :disabled="is_data_being_sent"
            id="submit_button"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal" id="modal">
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Registration successfull</p>
        <button
          aria-label="close modal button"
          type="button"
          class="delete"
          @click="ToggleModal('close')"
        ></button>
      </header>
      <section class="modal-card-body">
        <h3 class="is-size-5 mb-4">Thanks for signing up &lt;3</h3>
        <p>Please check your email for confirmation link.</p>
      </section>
      <footer class="modal-card-foot is-flex is-flex-direction-row is-justify-content-center">
        <button aria-label="close modal button" type="button" class="button" @click="ToggleModal('close')">
          Close
        </button>
        <RouterLink class="button is-success" to="/login">Sign in</RouterLink>
      </footer>
    </div>
  </div>
</template>
