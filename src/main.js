import { createApp } from "vue";
import { createPinia } from "pinia";

import "./assets/main.css";

import App from "./App.vue";
import router from "./router";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";

import { faEnvelope, faLock, faCheck, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

library.add(faEnvelope, faLock, faCheck, faCircleExclamation);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component("Icon", FontAwesomeIcon);

app.mount("#app");
