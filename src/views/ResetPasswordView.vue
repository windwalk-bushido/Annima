<script setup lang="ts">
  import { ref } from "vue";
  import supabase from "../api";

  let email_input_icon = ref("circle-exclamation");
  let is_data_being_sent = ref(false);

  function CheckUsersInputtedData() {
    const email_input = document.getElementById("email_input") as HTMLFormElement;
    const email_helper = document.getElementById("email_helper") as HTMLElement;
    const email_icon = document.getElementById("email_icon") as HTMLElement;

    if (email_input.value.length === 0) {
      email_input.classList.add("is-danger");
      email_helper.innerHTML = "Don't leave this field empty.";
      email_helper.classList.add("is-danger");
      email_icon.classList.remove("is-hidden");
      email_input_icon.value = "circle-exclamation";
      return false;
    } else {
      email_input.classList.remove("is-danger");
      email_input.classList.add("is-success");
      email_helper.innerHTML = "Email is sent.";
      email_helper.classList.remove("is-danger");
      email_helper.classList.add("is-success");
      email_icon.classList.remove("is-hidden");
      email_input_icon.value = "check";
      return true;
    }
  }

  async function ResetPassword() {
    const submit_button = document.getElementById("submit_button") as HTMLElement;
    submit_button.classList.add("is-loading");

    if (CheckUsersInputtedData()) {
      is_data_being_sent.value = true;

      const email_input = document.getElementById("email_input") as HTMLFormElement;

      const { data, error } = await supabase.auth.api.resetPasswordForEmail(email_input.value);

      if (error === null) {
        localStorage.setItem("reset_token", "true");
        localStorage.setItem("email_address", email_input.value);
      }

      submit_button.classList.remove("is-loading");
      is_data_being_sent.value = false;
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
        <h1 class="is-size-3 has-text-centered mb-6">Reset Password</h1>

        <p>Type in your email address you used when signing up/in below.</p>
        <p class="mt-2">
          If the email address is correct, you will get email from us with the link to the page where you can
          type in new password.
        </p>

        <div class="field mt-4">
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
        <div class="field is-grouped mt-5">
          <div class="control">
            <button
              class="button is-link"
              @click="ResetPassword()"
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
</template>
