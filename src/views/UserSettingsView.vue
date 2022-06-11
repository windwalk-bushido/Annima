<script setup lang="ts">
  import { ref } from "vue";
  import { RouterLink } from "vue-router";
  import supabase from "../api";

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

  function CheckUsersInputtedData() {
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

    if (is_password1_good && is_password2_good) {
      return true;
    } else {
      return false;
    }
  }

  async function UpdatePassword() {
    const submit_button = document.getElementById("submit_button") as HTMLElement;
    submit_button.classList.add("is-loading");

    if (CheckUsersInputtedData()) {
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
  <main>
    <div class="is-mobile mt-4">
      <div class="column is-10 is-offset-1">
        <div class="card mt-5 mb-5">
          <div class="card-content p-4">
            <h1 class="is-size-4 has-text-centered mb-6">Update password</h1>

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
            <div class="field is-grouped mt-5">
              <div class="control">
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
      </div>
    </div>
  </main>

  <div class="modal" id="modal">
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Password updated successfully</p>
        <button class="delete" aria-label="close" @click="ToggleModal('close')"></button>
      </header>
      <footer class="modal-card-foot">
        <button class="button" @click="ToggleModal('close')">Close</button>
      </footer>
    </div>
  </div>
</template>
