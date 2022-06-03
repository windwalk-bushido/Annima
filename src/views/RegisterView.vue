<script>
  export default {
    data() {
      return {
        email_icon_value: "circle-exclamation",
        password1_icon_value: "circle-exclamation",
        password2_icon_value: "circle-exclamation",
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
          switch (element) {
            case "email":
              this.email_icon_value = "circle-exclamation";
              break;
            case "password1":
              this.password1_icon_value = "circle-exclamation";
              break;
            case "password2":
              this.password2_icon_value = "circle-exclamation";
              break;
          }
        } else {
          input.classList.remove("is-danger");
          input.classList.add("is-success");
          helper.innerHTML = message;
          helper.classList.remove("is-danger");
          helper.classList.add("is-success");
          switch (element) {
            case "email":
              this.email_icon_value = "check";
              break;
            case "password1":
              this.password1_icon_value = "check";
              break;
            case "password2":
              this.password2_icon_value = "check";
              break;
          }
        }
      },

      CheckUserData() {
        const email_input = document.getElementById("email_input");
        const email_helper = document.getElementById("email_helper");
        const email_icon = document.getElementById("email_icon");

        const password1_input = document.getElementById("password1_input");
        const password1_helper = document.getElementById("password1_helper");
        const password1_icon = document.getElementById("password1_icon");

        const password2_input = document.getElementById("password2_input");
        const password2_helper = document.getElementById("password2_helper");
        const password2_icon = document.getElementById("password2_icon");

        const toc_checkbox = document.getElementById("toc_checkbox");
        const toc_helper = document.getElementById("toc_helper");

        let email_good = false;
        let password1_good = false;
        let password2_good = false;
        let toc_checked = false;

        const email_regex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
        const email_regex_testing = email_regex.exec(email_input.value);

        if (email_input.value.length === 0) {
          this.InformUser(
            "email",
            email_input,
            email_helper,
            email_icon,
            "Don't leave this field empty.",
            "BAD"
          );
        } else if (email_input.value.length < 8) {
          this.InformUser(
            "email",
            email_input,
            email_helper,
            email_icon,
            "Email too short. Minimum number of characters is 8.",
            "BAD"
          );
        } else if (email_input.value.length > 64) {
          this.InformUser(
            "email",
            email_input,
            email_helper,
            email_icon,
            "Email too long. Maximum number of characters is 64.",
            "BAD"
          );
        } else if (!email_regex_testing) {
          this.InformUser("email", email_input, email_helper, email_icon, "Not a valid email.", "BAD");
        } else {
          this.InformUser("email", email_input, email_helper, email_icon, "Email is good.", "GOOD");
          email_good = true;
        }

        const password_regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
        const password_regex_testing = password_regex.exec(password1_input.value);

        if (password1_input.value.length === 0) {
          this.InformUser(
            "password1",
            password1_input,
            password1_helper,
            password1_icon,
            "Don't leave this field empty.",
            "BAD"
          );
        } else if (password1_input.value.length < 8) {
          this.InformUser(
            "password1",
            password1_input,
            password1_helper,
            password1_icon,
            "Password too short. Minimum number of characters is 8.",
            "BAD"
          );
        } else if (password1_input.value.length > 64) {
          this.InformUser(
            "password1",
            password1_input,
            password1_helper,
            password1_icon,
            "Password too long. Maximum number of characters is 64.",
            "BAD"
          );
        } else if (!password_regex_testing) {
          this.InformUser(
            "password1",
            password1_input,
            password1_helper,
            password1_icon,
            "Invalid characters. Enter at least one upper case English letter, one lower case English letter, one number and one special character.",
            "BAD"
          );
        } else {
          this.InformUser(
            "password1",
            password1_input,
            password1_helper,
            password1_icon,
            "Password is good.",
            "GOOD"
          );
          password1_good = true;
        }

        if (password2_input.value.length === 0) {
          this.InformUser(
            "password2",
            password2_input,
            password2_helper,
            password2_icon,
            "Don't leave this field empty.",
            "BAD"
          );
        } else if (password2_input.value !== password1_input.value) {
          this.InformUser(
            "password2",
            password2_input,
            password2_helper,
            password2_icon,
            "Passwords are not the same.",
            "BAD"
          );
        } else {
          this.InformUser(
            "password2",
            password2_input,
            password2_helper,
            password2_icon,
            "Passwords match.",
            "GOOD"
          );
          password2_good = true;
        }

        if (toc_checkbox.checked === false) {
          toc_helper.innerHTML = "You have to agree in order to proceed.";
          toc_helper.classList.add("is-danger");
        } else {
          toc_helper.innerHTML = "You have agreed.";
          toc_helper.classList.remove("is-danger");
          toc_helper.classList.add("is-success");
          toc_checked = true;
        }

        if (email_good && password1_good && password2_good && toc_checked) {
          return true;
        } else {
          return false;
        }
      },

      RegisterUser() {
        if (this.CheckUserData()) {
          alert("Data OK!");
          this.sending_data = true;
        } else {
          console.log("AAAAAAAAAAAAAAAA");
          this.sending_data = false;
        }
      },
    },
  };
</script>

<template>
  <main>
    <div class="is-mobile mt-4">
      <div class="column is-10 is-offset-1">
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
              id="password1_input"
              :readonly="sending_data"
              required
            />
            <span class="icon is-small is-left">
              <Icon icon="lock" />
            </span>
            <span class="icon is-small is-right is-hidden" id="password1_icon">
              <Icon :icon="password1_icon_value" />
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
              :readonly="sending_data"
              required
            />
            <span class="icon is-small is-left">
              <Icon icon="lock" />
            </span>
            <span class="icon is-small is-right is-hidden" id="password2_icon">
              <Icon :icon="password2_icon_value" />
            </span>
          </div>
          <p class="help" id="password2_helper"></p>
        </div>
        <div class="field mt-5">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" id="toc_checkbox" :disabled="sending_data" required />
              I agree to the <a href="#">Terms and Conditions</a>
            </label>
          </div>
          <p class="help" id="toc_helper"></p>
        </div>
        <div class="field is-grouped mt-5">
          <div class="control">
            <button class="button is-link" @click="RegisterUser()" :disabled="sending_data">Submit</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
