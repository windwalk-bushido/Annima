<script setup lang="ts">
  import { ref, onMounted, defineEmits } from "vue";
  import type { Ref } from "vue";
  import supabase from "../api";

  let event_list: Ref<Object | any> = ref([]);
  let event_name_icon = ref("circle-exclamation");
  let event_date_icon = ref("circle-exclamation");
  let is_data_being_sent = ref(false);
  let is_edit_mode_on = ref(false);
  let edit_index = ref(-1);
  let delete_index = ref(-1);
  let list_index = ref(-1);

  const emit = defineEmits(["NavBarLoggedIn"]);

  function SetEventsMaxDate() {
    const event_date_input = document.getElementById("event_date_input") as HTMLFormElement;

    event_date_input.max = new Date().toJSON().split("T")[0];
  }

  function FormatDate(input: string) {
    const splitted_date = input.split("-");
    const year = splitted_date[0];
    const month = splitted_date[1];
    const day = splitted_date[2];
    return day + ". " + month + ". " + year + ".";
  }

  function GetUsersToken() {
    const uuid_token_session = sessionStorage.getItem("annima_user_uuid");
    const uuid_token_storage = localStorage.getItem("annima_user_uuid");

    if (uuid_token_session !== null) {
      return uuid_token_session;
    } else {
      return uuid_token_storage;
    }
  }

  async function FetchDataFromDatabase() {
    const loading_button = document.getElementById("loading_button") as HTMLElement;

    const uuid_token = GetUsersToken();

    const { data: events, error } = await supabase.from("events").select("*").eq("belongs_to", uuid_token);

    if (events !== null) {
      for (let event in events) {
        event_list.value.push(events[event]);
      }
    }

    if (error !== null) {
      console.log(error);
    }

    loading_button.classList.remove("is-loading");
  }

  function ClearModal() {
    const event_name_input = document.getElementById("event_name_input") as HTMLFormElement;
    const event_name_icon = document.getElementById("event_name_icon") as HTMLElement;
    const event_name_helper = document.getElementById("event_name_helper") as HTMLElement;

    const event_type_select = document.getElementById("event_type_select") as HTMLFormElement;

    const event_date_input = document.getElementById("event_date_input") as HTMLFormElement;
    const event_date_icon = document.getElementById("event_date_icon") as HTMLElement;
    const event_date_helper = document.getElementById("event_date_helper") as HTMLElement;

    const event_note_input = document.getElementById("event_note_input") as HTMLFormElement;
    const event_note_helper = document.getElementById("event_note_helper") as HTMLElement;

    event_name_input.classList.remove("is-success");
    event_name_input.classList.remove("is-danger");
    event_name_input.value = "";
    event_name_icon.classList.add("is-hidden");
    event_name_helper.innerHTML = "";

    event_type_select.value = "Birthday";

    event_date_input.classList.remove("is-success");
    event_date_input.classList.remove("is-danger");
    event_date_input.value = "";
    event_date_icon.classList.add("is-hidden");
    event_date_helper.innerHTML = "";

    event_note_input.classList.remove("is-success");
    event_note_input.classList.remove("is-danger");
    event_note_input.value = "";
    event_note_helper.innerHTML = "";
  }

  function ToggleModal(command: string) {
    const modal = document.getElementById("modal") as HTMLElement;

    if (command === "open") {
      modal.classList.add("is-active");
    } else {
      modal.classList.remove("is-active");
      ClearModal();
      is_edit_mode_on.value = false;
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

      if (element === "name") {
        event_name_icon.value = "circle-exclamation";
      }
      if (element === "date") {
        event_date_icon.value = "circle-exclamation";
      }
    } else {
      input.classList.remove("is-danger");
      input.classList.add("is-success");

      helper.innerHTML = message;
      helper.classList.remove("is-danger");
      helper.classList.add("is-success");

      if (element === "name") {
        event_name_icon.value = "check";
      }
      if (element === "date") {
        event_date_icon.value = "check";
      }
    }
  }

  function CheckUsersInputtedData() {
    const event_name_input = document.getElementById("event_name_input") as HTMLFormElement;
    const event_name_icon = document.getElementById("event_name_icon") as HTMLElement;
    const event_name_helper = document.getElementById("event_name_helper") as HTMLElement;

    const event_date_input = document.getElementById("event_date_input") as HTMLFormElement;
    const event_date_icon = document.getElementById("event_date_icon") as HTMLElement;
    const event_date_helper = document.getElementById("event_date_helper") as HTMLElement;

    const event_note_input = document.getElementById("event_note_input") as HTMLFormElement;
    const event_note_helper = document.getElementById("event_note_helper") as HTMLElement;

    let is_event_name_good: boolean = false;
    let is_event_date_good: boolean = false;
    let is_event_note_good: boolean = false;

    if (event_name_input.value.length === 0) {
      InformUserAboutInputtedData(
        "name",
        event_name_input,
        event_name_helper,
        event_name_icon,
        "Don't leave this field empty.",
        "BAD"
      );
    } else if (event_name_input.value.length < 5) {
      InformUserAboutInputtedData(
        "name",
        event_name_input,
        event_name_helper,
        event_name_icon,
        "Minimum number of characters is 5.",
        "BAD"
      );
    } else if (event_name_input.value.length > 150) {
      InformUserAboutInputtedData(
        "name",
        event_name_input,
        event_name_helper,
        event_name_icon,
        "Maximum number of characters is 150.",
        "BAD"
      );
    } else {
      InformUserAboutInputtedData(
        "name",
        event_name_input,
        event_name_helper,
        event_name_icon,
        "Name is looking good.",
        "GOOD"
      );
      is_event_name_good = true;
    }

    const today = new Date();
    const wanted_date = event_date_input.value;

    if (event_date_input.value.length === 0) {
      InformUserAboutInputtedData(
        "date",
        event_date_input,
        event_date_helper,
        event_date_icon,
        "Don't leave this field empty.",
        "BAD"
      );
    } else if (event_date_input.value < event_date_input.min) {
      InformUserAboutInputtedData(
        "date",
        event_date_input,
        event_date_helper,
        event_date_icon,
        "Earliest date you can set is 1920-01-01 (YYYY-MM-DD).",
        "BAD"
      );
    } else if (wanted_date > today) {
      InformUserAboutInputtedData(
        "date",
        event_date_input,
        event_date_helper,
        event_date_icon,
        "Latest date you can set is today's date.",
        "BAD"
      );
    } else {
      InformUserAboutInputtedData(
        "date",
        event_date_input,
        event_date_helper,
        event_date_icon,
        "Date is looking good.",
        "GOOD"
      );
      is_event_date_good = true;
    }

    if (event_note_input.value.length > 351) {
      event_note_input.classList.add("is-danger");
      event_note_helper.innerHTML = "Maximum number of characters is 350.";
      event_note_helper.classList.add("is-danger");
    } else {
      event_note_input.classList.remove("is-danger");
      event_note_input.innerHTML = "";
      is_event_note_good = true;
    }

    if (is_event_name_good && is_event_date_good && is_event_note_good) {
      return true;
    } else {
      return false;
    }
  }

  async function CreateEvent() {
    if (CheckUsersInputtedData()) {
      is_data_being_sent.value = true;

      const event_name_input = document.getElementById("event_name_input") as HTMLFormElement;
      const event_type_select = document.getElementById("event_type_select") as HTMLFormElement;
      const event_date_input = document.getElementById("event_date_input") as HTMLFormElement;
      const event_note_input = document.getElementById("event_note_input") as HTMLFormElement;

      const uuid_token = GetUsersToken();

      const { data, error } = await supabase.from("events").insert([
        {
          belongs_to: uuid_token,
          name: event_name_input.value,
          type: event_type_select.value,
          date: event_date_input.value,
          note: event_note_input.value,
        },
      ]);

      if (data !== null) {
        event_list.value.push(data[0]);
      }

      if (error !== null) {
        console.log(error);
      }

      ToggleModal("close");
      is_data_being_sent.value = false;
    }
  }

  function PrepareForEventEditing(index: number) {
    const event_name_input = document.getElementById("event_name_input") as HTMLFormElement;
    const event_type_select = document.getElementById("event_type_select") as HTMLFormElement;
    const event_date_input = document.getElementById("event_date_input") as HTMLFormElement;
    const event_note_input = document.getElementById("event_note_input") as HTMLFormElement;

    event_name_input.value = event_list.value[index].name;
    event_type_select.value = event_list.value[index].type;
    event_date_input.value = event_list.value[index].date;
    event_note_input.value = event_list.value[index].note;

    is_edit_mode_on.value = true;
    edit_index.value = index;
    ToggleModal("open");
  }

  async function UpdateEvent() {
    if (CheckUsersInputtedData()) {
      is_data_being_sent.value = true;

      const event_name_input = document.getElementById("event_name_input") as HTMLFormElement;
      const event_type_select = document.getElementById("event_type_select") as HTMLFormElement;
      const event_date_input = document.getElementById("event_date_input") as HTMLFormElement;
      const event_note_input = document.getElementById("event_note_input") as HTMLFormElement;

      const uuid_token = GetUsersToken();

      const { data, error } = await supabase
        .from("events")
        .update({
          belongs_to: uuid_token,
          name: event_name_input.value,
          type: event_type_select.value,
          date: event_date_input.value,
          note: event_note_input.value,
        })
        .eq("id", event_list.value[edit_index.value].id);

      if (error !== null) {
        console.log(error);
      }

      if (data !== null) {
        event_list.value[edit_index.value] = data[0];
      }

      is_edit_mode_on.value = false;
      edit_index.value = -1;
      is_data_being_sent.value = false;
      ToggleModal("close");
    }
  }

  function ToggleDeleteModal(command: string, index: number) {
    const modal = document.getElementById("delete_modal") as HTMLElement;

    if (command === "open") {
      delete_index.value = event_list.value[index].id;
      list_index.value = index;
      modal.classList.add("is-active");
    } else {
      delete_index.value = -1;
      list_index.value = -1;
      modal.classList.remove("is-active");
    }
  }

  async function DeleteEvent() {
    const { data, error } = await supabase.from("events").delete().eq("id", delete_index.value);

    if (error !== null) {
      console.log(error);
    }

    event_list.value.splice(list_index.value, 1);
    ToggleDeleteModal("close", -1);
  }

  onMounted(() => {
    SetEventsMaxDate();
    FetchDataFromDatabase();
    emit("NavBarLoggedIn");
  });
</script>

<template>
  <div class="column is-flex is-flex-direction-row is-justify-content-center spread mb-6">
    <div class="column is-9-desktop is-flex is-flex-direction-row is-flex-wrap-wrap is-justify-content-center">
      <div class="is-flex is-flex-direction-column is-justify-content-center spread">
        <h1 class="is-size-2 has-text-centered">Dashboard</h1>
        <button
          aria-label="loading button"
          type="button"
          class="button is-white is-large is-loading mb-4"
          disabled
          id="loading_button"
        />
      </div>

      <div class="has-text-centered mt-6" v-if="event_list.length === 0">
        <Icon icon="face-sad-cry" class="is-size-1" />
        <h2 class="mt-2">No events... yet.</h2>
      </div>

      <div class="card m-5" v-for="(event, index) in event_list" :key="index" v-else>
        <div class="card-content p-4">
          <div class="media">
            <div class="media-left">
              <figure class="image is-64x64">
                <img src="../assets/birthday.png" alt="Placeholder image" v-if="event.type === 'Birthday'" />
                <img
                  src="../assets/anniversary.png"
                  alt="Placeholder image"
                  v-if="event.type === 'Anniversary'"
                />
                <img src="../assets/name-day.png" alt="Placeholder image" v-if="event.type === 'Name day'" />
                <img
                  src="../assets/death-anniversary.png"
                  alt="Placeholder image"
                  v-if="event.type === 'Death anniversary'"
                />
                <img src="../assets/other.png" alt="Placeholder image" v-if="event.type === 'Other'" />
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4">{{ event.name }}</p>
              <p class="subtitle is-6">{{ FormatDate(event.date) }}</p>
            </div>
          </div>
          <div class="content">
            <div class="notification p-4 my-card-note">{{ event.note }}</div>
          </div>
        </div>
        <footer class="card-footer p-4 is-flex is-flex-direction-row is-justify-content-center">
          <button
            aria-label="delete event button"
            type="button"
            class="button is-danger"
            @click="ToggleDeleteModal('open', index)"
          >
            <Icon icon="trash" class="mr-2" />
            Delete
          </button>
          <button
            aria-label="edit event button"
            type="button"
            class="button is-warning ml-3"
            @click="PrepareForEventEditing(index)"
          >
            <Icon icon="pen" class="mr-2" />
            Edit
          </button>
        </footer>
      </div>
    </div>
  </div>

  <div class="is-flex is-flex-direction-row is-justify-content-center spread p-4 main-button">
    <button
      aria-label="create event button"
      type="button"
      class="button is-primary is-rounded"
      @click="ToggleModal('open')"
    >
      <Icon icon="plus" class="is-size-4" />
    </button>
  </div>

  <div class="modal" id="modal">
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">New event</p>
        <button type="button" class="delete" aria-label="close modal" @click="ToggleModal('close')"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Name</label>
          <div class="control has-icons-right">
            <input
              class="input"
              type="text"
              placeholder="John Doe"
              id="event_name_input"
              :readonly="is_data_being_sent"
              required
            />
            <span class="icon is-small is-right is-hidden" id="event_name_icon">
              <Icon :icon="event_name_icon" />
            </span>
          </div>
          <p class="help" id="event_name_helper"></p>
        </div>
        <div class="field">
          <label class="label">Type</label>
          <div class="control">
            <div class="select">
              <select id="event_type_select" :readonly="is_data_being_sent" required>
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
              id="event_date_input"
              :readonly="is_data_being_sent"
              required
            />
            <span class="icon is-small is-right is-hidden" id="event_date_icon">
              <Icon :icon="event_date_icon" />
            </span>
          </div>
          <p class="help" id="event_date_helper"></p>
        </div>
        <div class="field">
          <label class="label">Note</label>
          <div class="control">
            <textarea
              class="textarea"
              rows="3"
              placeholder="He gifted me the mug for my birthday. This year I should get them something... better."
              id="event_note_input"
              :readonly="is_data_being_sent"
            />
          </div>
          <p class="help" id="event_note_helper"></p>
        </div>
      </section>
      <footer class="modal-card-foot is-flex is-flex-direction-row is-justify-content-center">
        <button aria-label="close modal" type="button" class="button" @click="ToggleModal('close')">
          Close
        </button>
        <button
          aria-label="create event button"
          type="button"
          class="button is-success"
          @click="CreateEvent()"
          v-if="!is_edit_mode_on"
        >
          Create
        </button>
        <button
          aria-label="update event button"
          type="button"
          class="button is-warning"
          @click="UpdateEvent()"
          v-if="is_edit_mode_on"
        >
          Update
        </button>
      </footer>
    </div>
  </div>

  <div class="modal" id="delete_modal">
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Deleting event</p>
        <button
          aria-label="close modal button"
          type="button"
          class="delete"
          @click="ToggleDeleteModal('close', -1)"
        ></button>
      </header>
      <section class="modal-card-body">
        <h3 class="is-size-5">Are you sure?</h3>
      </section>
      <footer class="modal-card-foot is-flex is-flex-direction-row is-justify-content-center">
        <button
          aria-label="close modal button"
          type="button"
          class="button"
          @click="ToggleDeleteModal('close', -1)"
        >
          Close
        </button>
        <button aria-label="delete event button" type="button" class="button is-danger" @click="DeleteEvent()">
          Delete
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
  .main-button {
    bottom: 0;
    position: fixed;
    z-index: 10;
  }
</style>
