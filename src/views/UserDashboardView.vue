<script>
  import { createClient } from "@supabase/supabase-js";
  import { supabaseUrl, supabaseAnonKey } from "../api";
  import Anni from "../anni";

  export default {
    data() {
      return {
        anni_list: [
          {
            name: "First Kiss",
            date: "04.03.2022.",
            note: "Tunnel, a space between the buildings, was the last place I expected that...",
          },
          {
            name: "First Kiss",
            date: "04.03.2022.",
            note: "Tunnel, a space between the buildings, was the last place I expected that...",
          },
        ],
        anni_name_icon_value: "circle-exclamation",
        anni_date_icon_value: "circle-exclamation",
        sending_data: false,
      };
    },

    methods: {
      TriggerNavMenu() {
        this.$root.ToggleMenu();
      },

      SetMaxDate() {
        const anni_date_input = document.getElementById("anni_date_input");

        anni_date_input.max = new Date().toJSON().split("T")[0];
      },

      FetchData() {
        const local_storage_data = JSON.parse(localStorage.getItem("supabase.auth.token"));
        const uuid_token = local_storage_data.currentSession.user.id;

        const supabase = createClient(supabaseUrl, supabaseAnonKey);
        let { data, error } = supabase.from("anniversaries").select("*").eq("belongs_to", uuid_token);

        console.log(data);
        console.log(error);
      },

      ClearModal() {
        const anni_name_input = document.getElementById("anni_name_input");
        const anni_name_icon = document.getElementById("anni_name_icon");
        const anni_name_helper = document.getElementById("anni_name_helper");

        const anni_type_select = document.getElementById("anni_type_select");

        const anni_date_input = document.getElementById("anni_date_input");
        const anni_date_icon = document.getElementById("anni_date_icon");
        const anni_date_helper = document.getElementById("anni_date_helper");

        const anni_note_input = document.getElementById("anni_note_input");
        const anni_note_helper = document.getElementById("anni_note_helper");

        anni_name_input.classList.remove("is-success");
        anni_name_input.classList.remove("is-danger");
        anni_name_input.value = "";
        anni_name_icon.classList.add("is-hidden");
        anni_name_helper.innerHTML = "";

        anni_type_select.value = "Birthday";

        anni_date_input.classList.remove("is-success");
        anni_date_input.classList.remove("is-danger");
        anni_date_input.value = "";
        anni_date_icon.classList.add("is-hidden");
        anni_date_helper.innerHTML = "";

        anni_note_input.classList.remove("is-success");
        anni_note_input.classList.remove("is-danger");
        anni_note_input.value = "";
        anni_note_helper.innerHTML = "";
      },

      HandleModal(command) {
        const modal = document.getElementById("modal");

        if (command === "open") {
          modal.classList.add("is-active");
        } else {
          modal.classList.remove("is-active");
        }

        this.ClearModal();
      },

      InformUser(element, input, helper, icon, message, type) {
        if (type === "BAD") {
          input.classList.add("is-danger");

          helper.innerHTML = message;
          helper.classList.add("is-danger");

          if (icon != "note") {
            icon.classList.remove("is-hidden");
          }

          if (element === "name") {
            this.anni_name_icon_value = "circle-exclamation";
          }
          if (element === "date") {
            this.anni_date_icon_value = "circle-exclamation";
          }
        } else {
          input.classList.remove("is-danger");
          input.classList.add("is-success");

          helper.innerHTML = message;
          helper.classList.remove("is-danger");
          helper.classList.add("is-success");

          if (icon != "note") {
            icon.classList.remove("is-hidden");
          }

          if (element === "name") {
            this.anni_name_icon_value = "check";
          }
          if (element === "date") {
            this.anni_date_icon_value = "check";
          }
        }
      },

      CheckUserData() {
        const anni_name_input = document.getElementById("anni_name_input");
        const anni_name_icon = document.getElementById("anni_name_icon");
        const anni_name_helper = document.getElementById("anni_name_helper");

        const anni_date_input = document.getElementById("anni_date_input");
        const anni_date_icon = document.getElementById("anni_date_icon");
        const anni_date_helper = document.getElementById("anni_date_helper");

        const anni_note_input = document.getElementById("anni_note_input");
        const anni_note_helper = document.getElementById("anni_note_helper");

        let anni_name_good = false;
        let anni_date_good = false;

        if (anni_name_input.value.length === 0) {
          this.InformUser(
            "name",
            anni_name_input,
            anni_name_helper,
            anni_name_icon,
            "Don't leave this field empty.",
            "BAD"
          );
        } else if (anni_name_input.value.length < 5) {
          this.InformUser(
            "name",
            anni_name_input,
            anni_name_helper,
            anni_name_icon,
            "Minimum number of characters is 5.",
            "BAD"
          );
        } else if (anni_name_input.value.length > 150) {
          this.InformUser(
            "name",
            anni_name_input,
            anni_name_helper,
            anni_name_icon,
            "Maximum number of characters is 150.",
            "BAD"
          );
        } else {
          this.InformUser(
            "name",
            anni_name_input,
            anni_name_helper,
            anni_name_icon,
            "Name is looking good.",
            "GOOD"
          );
          anni_name_good = true;
        }

        if (anni_date_input.value.length === 0) {
          this.InformUser(
            "date",
            anni_date_input,
            anni_date_helper,
            anni_date_icon,
            "Don't leave this field empty.",
            "BAD"
          );
        } else if (anni_date_input.value < anni_date_input.min) {
          this.InformUser(
            "date",
            anni_date_input,
            anni_date_helper,
            anni_date_icon,
            "Earliest date you can set is 1920-01-01 (YYYY-MM-DD).",
            "BAD"
          );
        } else if (anni_date_input.value > anni_date_input.max) {
          this.InformUser(
            "date",
            anni_date_input,
            anni_date_helper,
            anni_date_icon,
            "Latest date you can set is today's date.",
            "BAD"
          );
        } else {
          this.InformUser(
            "date",
            anni_date_input,
            anni_date_helper,
            anni_date_icon,
            "Date is looking good.",
            "GOOD"
          );
          anni_date_good = true;
        }

        if (anni_note_input.value.length > 300) {
          this.InformUser(
            "note",
            anni_note_input,
            anni_note_helper,
            "note",
            "Maximum number of characters is 300.",
            "BAD"
          );
        } else {
          anni_note_input.classList.remove("is-danger");
          anni_note_input.innerHTML = "";
        }

        if (anni_name_good && anni_date_good) {
          return true;
        } else {
          return false;
        }
      },

      CreateNewAnni() {
        if (this.CheckUserData()) {
          this.sending_data = true;

          const anni_name_input = document.getElementById("anni_name_input");
          const anni_type_select = document.getElementById("anni_type_select");
          const anni_date_input = document.getElementById("anni_date_input");
          const anni_note_input = document.getElementById("anni_note_input");

          const local_storage_data = JSON.parse(localStorage.getItem("supabase.auth.token"));
          const uuid_token = local_storage_data.currentSession.user.id;

          const new_anni = new Anni(
            uuid_token,
            anni_name_input.value,
            anni_type_select.value,
            anni_date_input.value,
            anni_note_input.value
          );

          this.anni_list.push(new_anni);

          /*
          const email_input = document.getElementById("email_input");
          const password1_input = document.getElementById("password1_input");

          const supabase = createClient(supabaseUrl, supabaseAnonKey);

          supabase.auth.signUp({
            email: email_input.value,
            password: password1_input.value,
          });

          this.HandleModal("open");
          */

          this.HandleModal("close");
          this.sending_data = false;
        } else {
          this.sending_data = false;
        }
      },
    },

    mounted() {
      this.TriggerNavMenu();
      this.SetMaxDate();
      //this.FetchData();
    },
  };
</script>

<template>
  <main>
    <div class="is-mobile mt-4">
      <div class="column is-10 is-offset-1">
        <h1 class="is-size-2 has-text-centered mb-4">Dashboard</h1>

        <div class="card mt-5 mb-5" v-for="(anni, index) in anni_list" :key="index">
          <div class="card-content p-4">
            <div class="media">
              <div class="media-left">
                <figure class="image is-64x64">
                  <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image" />
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-4">{{ anni.name }}</p>
                <p class="subtitle is-6">{{ anni.date }}</p>
              </div>
            </div>
            <div class="content" v-if="anni.note != ''">
              <div class="notification p-4">{{ anni.note }}</div>
            </div>
          </div>
          <footer class="card-footer p-4 is-flex-direction-row is-justify-content-end">
            <button class="button is-warning mr-3">
              <Icon icon="pen" class="mr-2" />
              Edit
            </button>
            <button class="button is-danger">
              <Icon icon="trash" class="mr-2" />
              Delete
            </button>
          </footer>
        </div>

        <button class="button is-primary is-rounded main_button" @click="HandleModal('open')">
          <Icon icon="plus" class="is-size-4" />
        </button>
      </div>
    </div>
  </main>

  <div class="modal" id="modal">
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">New event</p>
        <button class="delete" aria-label="close" @click="HandleModal('close')"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Name</label>
          <div class="control has-icons-right">
            <input
              class="input"
              type="text"
              placeholder="John Doe"
              id="anni_name_input"
              :readonly="sending_data"
              required
            />
            <span class="icon is-small is-right is-hidden" id="anni_name_icon">
              <Icon :icon="anni_name_icon_value" />
            </span>
          </div>
          <p class="help" id="anni_name_helper"></p>
        </div>
        <div class="field">
          <label class="label">Type</label>
          <div class="control">
            <div class="select">
              <select id="anni_type_select" :readonly="sending_data" required>
                <option selected>Birthday</option>
                <option>Anniversary</option>
                <option>Name day</option>
                <option>Death anniversary</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>
        <div class="field">
          <label class="label">Date</label>
          <div class="control has-icons-right">
            <input
              class="input"
              type="date"
              min="1920-01-01"
              id="anni_date_input"
              :readonly="sending_data"
              required
            />
            <span class="icon is-small is-right is-hidden" id="anni_date_icon">
              <Icon :icon="anni_date_icon_value" />
            </span>
          </div>
          <p class="help" id="anni_date_helper"></p>
        </div>
        <div class="field">
          <label class="label">Note</label>
          <div class="control">
            <textarea
              class="textarea"
              rows="3"
              placeholder="He gifted me the mug for my birthday. This year I should get them something... better."
              id="anni_note_input"
              :readonly="sending_data"
            />
          </div>
          <p class="help" id="anni_note_helper"></p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="HandleModal('close')">Close</button>
        <button class="button is-success" @click="CreateNewAnni()">Create</button>
      </footer>
    </div>
  </div>
</template>

<style>
  .main_button {
    bottom: 0;
    z-index: 2;
    position: fixed;
    margin-bottom: 0.75rem;
  }
</style>
