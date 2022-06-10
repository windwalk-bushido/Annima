import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import UserDashboard from "../views/UserDashboardView.vue";
import UserSettings from "../views/UserSettingsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisterView,
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/user/dashboard",
      name: "dashboard",
      component: UserDashboard,
    },
    {
      path: "/user/settings",
      name: "settings",
      component: UserSettings,
    },
    /*
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
    */
  ],
});

let is_user_logged_in = null;

function CheckIfUserIsLoggedIn() {
  const uuid_token_session = sessionStorage.getItem("annima_user_uuid");
  const uuid_token_storage = localStorage.getItem("annima_user_uuid");

  if (uuid_token_session !== null || uuid_token_storage !== null) {
    is_user_logged_in = true;
  } else {
    is_user_logged_in = false;
  }
}

router.beforeEach(async (to, from) => {
  CheckIfUserIsLoggedIn();
  if (is_user_logged_in === false && (to.name === "dashboard" || to.name === "settings")) {
    return { name: "login" };
  }
  if (is_user_logged_in && (to.name === "login" || to.name === "register")) {
    return { name: "dashboard" };
  }
});

export default router;
