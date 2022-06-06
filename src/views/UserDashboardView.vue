<script>
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
      };
    },

    methods: {
      TriggerNavMenu() {
        this.$root.ToggleMenu();
      },
    },

    mounted() {
      this.TriggerNavMenu();
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
            <div class="content">
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
      </div>
    </div>
  </main>
</template>
