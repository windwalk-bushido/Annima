<script setup>
  import { ref, onMounted } from "vue";
  import supabase from "../api";

  let events_list = ref([]);
  let anni_name_icon_value = ref("circle-exclamation");
  let anni_date_icon_value = ref("circle-exclamation");
  let sending_data = ref(false);
  let edit_mode = ref(false);
  let edit_index = ref(null);
  let delete_index = ref(null);
  let list_index = ref(null);

  function CloseNav() {
    this.$root.ToggleMenu();
  }

  function SetMaxDate() {
    const anni_date_input = document.getElementById("anni_date_input");

    anni_date_input.max = new Date().toJSON().split("T")[0];
  }

  async function FetchData() {
    const loading_button = document.getElementById("loading_button");

    const uuid_token = GetToken();

    const { data: events, error } = await supabase.from("events").select("*").eq("belongs_to", uuid_token);

    if (events != null && error === null) {
      for (let event in events) {
        events_list.push(events[event]);
      }
    }

    loading_button.classList.remove("is-loading");
  }

  function ClearModal() {
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
  }

  function HandleModal(command) {
    const modal = document.getElementById("modal");

    if (command === "open") {
      modal.classList.add("is-active");
    } else {
      modal.classList.remove("is-active");
      ClearModal();
      edit_mode.value = false;
    }
  }

  function InformUser(element, input, helper, icon, message, type) {
    if (type === "BAD") {
      input.classList.add("is-danger");

      helper.innerHTML = message;
      helper.classList.add("is-danger");

      if (icon != "note") {
        icon.classList.remove("is-hidden");
      }

      if (element === "name") {
        anni_name_icon_value.value = "circle-exclamation";
      }
      if (element === "date") {
        anni_date_icon_value.value = "circle-exclamation";
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
        anni_name_icon_value.value = "check";
      }
      if (element === "date") {
        anni_date_icon_value.value = "check";
      }
    }
  }

  function CheckUserData() {
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
      InformUser(
        "name",
        anni_name_input,
        anni_name_helper,
        anni_name_icon,
        "Don't leave this field empty.",
        "BAD"
      );
    } else if (anni_name_input.value.length < 5) {
      InformUser(
        "name",
        anni_name_input,
        anni_name_helper,
        anni_name_icon,
        "Minimum number of characters is 5.",
        "BAD"
      );
    } else if (anni_name_input.value.length > 150) {
      InformUser(
        "name",
        anni_name_input,
        anni_name_helper,
        anni_name_icon,
        "Maximum number of characters is 150.",
        "BAD"
      );
    } else {
      InformUser("name", anni_name_input, anni_name_helper, anni_name_icon, "Name is looking good.", "GOOD");
      anni_name_good = true;
    }

    if (anni_date_input.value.length === 0) {
      InformUser(
        "date",
        anni_date_input,
        anni_date_helper,
        anni_date_icon,
        "Don't leave this field empty.",
        "BAD"
      );
    } else if (anni_date_input.value < anni_date_input.min) {
      InformUser(
        "date",
        anni_date_input,
        anni_date_helper,
        anni_date_icon,
        "Earliest date you can set is 1920-01-01 (YYYY-MM-DD).",
        "BAD"
      );
    } else if (anni_date_input.value > anni_date_input.max) {
      InformUser(
        "date",
        anni_date_input,
        anni_date_helper,
        anni_date_icon,
        "Latest date you can set is today's date.",
        "BAD"
      );
    } else {
      InformUser("date", anni_date_input, anni_date_helper, anni_date_icon, "Date is looking good.", "GOOD");
      anni_date_good = true;
    }

    if (anni_note_input.value.length > 300) {
      InformUser(
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
  }

  function GetToken() {
    const uuid_token_session = sessionStorage.getItem("annima_user_uuid");
    const uuid_token_storage = localStorage.getItem("annima_user_uuid");

    if (uuid_token_session != null) {
      return uuid_token_session;
    } else {
      return uuid_token_storage;
    }
  }

  async function CreateEvent() {
    if (CheckUserData()) {
      sending_data.value = true;

      const anni_name_input = document.getElementById("anni_name_input");
      const anni_type_select = document.getElementById("anni_type_select");
      const anni_date_input = document.getElementById("anni_date_input");
      const anni_note_input = document.getElementById("anni_note_input");

      const uuid_token = GetToken();

      const { data, error } = await supabase.from("events").insert([
        {
          belongs_to: uuid_token,
          name: anni_name_input.value,
          type: anni_type_select.value,
          date: anni_date_input.value,
          note: anni_note_input.value,
        },
      ]);

      events_list.push(data[0]);

      if (error != null) {
        console.log(error);
      }

      HandleModal("close");
      sending_data.value = false;
    } else {
      sending_data.value = false;
    }
  }

  function PrepareForEventEditing(index) {
    const anni_name_input = document.getElementById("anni_name_input");
    const anni_type_select = document.getElementById("anni_type_select");
    const anni_date_input = document.getElementById("anni_date_input");
    const anni_note_input = document.getElementById("anni_note_input");

    anni_name_input.value = events_list[index].name;
    anni_type_select.value = events_list[index].type;
    anni_date_input.value = events_list[index].date;
    anni_note_input.value = events_list[index].note;

    edit_mode.value = true;
    delete_mode = false;
    edit_index.value = index;
    HandleModal("open");
  }

  async function UpdateEvent() {
    if (CheckUserData()) {
      sending_data.value = true;

      const anni_name_input = document.getElementById("anni_name_input");
      const anni_type_select = document.getElementById("anni_type_select");
      const anni_date_input = document.getElementById("anni_date_input");
      const anni_note_input = document.getElementById("anni_note_input");

      const uuid_token = GetToken();

      const { data, error } = await supabase
        .from("events")
        .update({
          belongs_to: uuid_token,
          name: anni_name_input.value,
          type: anni_type_select.value,
          date: anni_date_input.value,
          note: anni_note_input.value,
        })
        .eq("id", events_list[edit_index.value].id);

      if (error != null) {
        console.log(error);
      }

      events_list[edit_index.value] = data[0];

      edit_mode.value = false;
      edit_index.value = null;
      sending_data.value = false;
      HandleModal("close");
    } else {
      sending_data.value = false;
    }
  }

  function HandleDeleteModal(command, index) {
    const modal = document.getElementById("delete_modal");

    if (command === "open") {
      delete_index.value = events_list[index].id;
      list_index.value = index;
      modal.classList.add("is-active");
    } else {
      delete_index.value = null;
      list_index.value = null;
      modal.classList.remove("is-active");
    }
  }

  async function DeleteEvent() {
    const { data, error } = await supabase.from("events").delete().eq("id", delete_index.value);

    if (error != null) {
      console.log(error);
    }

    events_list.splice(list_index.value, 1);
    HandleDeleteModal("close");
  }

  function CheckIfUserIsNotLoggedIn() {
    const uuid_token_session = sessionStorage.getItem("annima_user_uuid");
    const uuid_token_storage = localStorage.getItem("annima_user_uuid");

    if (uuid_token_session == null || uuid_token_storage == null) {
      this.$router.push("/login");
      return true;
    } else {
      return false;
    }
  }

  onMounted(() => {
    CloseNav();
    if (!CheckIfUserIsNotLoggedIn()) {
      SetMaxDate();
      FetchData();
    }
  });
</script>

<template>
  <main>
    <div class="is-mobile mt-4">
      <div class="column is-10 is-offset-1">
        <h1 class="is-size-2 has-text-centered">Dashboard</h1>
        <button class="button is-white is-large is-loading mb-4" disabled id="loading_button" />

        <div class="has-text-centered mt-6" v-if="events_list.length === 0">
          <Icon icon="face-sad-cry" class="is-size-1" />
          <h2 class="mt-2">No events... yet.</h2>
        </div>

        <div class="card mt-5 mb-5" v-for="(anni, index) in events_list" :key="index" v-else>
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
            <button class="button is-warning mr-3" @click="PrepareForEventEditing(index)">
              <Icon icon="pen" class="mr-2" />
              Edit
            </button>
            <button class="button is-danger" @click="HandleDeleteModal('open', index)">
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
        <button class="button is-success" @click="CreateEvent" v-if="!edit_mode">Create</button>
        <button class="button is-warning" @click="UpdateEvent" v-if="edit_mode">Update</button>
      </footer>
    </div>
  </div>

  <div class="modal" id="delete_modal">
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Deleting event</p>
        <button class="delete" aria-label="close" @click="HandleDeleteModal('close')"></button>
      </header>
      <section class="modal-card-body">
        <h3 class="is-size-5">Are you sure?</h3>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="HandleDeleteModal('close')">Close</button>
        <button class="button is-danger" @click="DeleteEvent">Delete</button>
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
