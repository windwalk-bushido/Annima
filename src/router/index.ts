import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import RegisterView from "../views/RegisterView.vue";
import LoginView from "../views/LoginView.vue";
import UserDashboard from "../views/UserDashboardView.vue";
import UserSettings from "../views/UserSettingsView.vue";
import ResetPassword from "../views/ResetPasswordView.vue";

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
    {
      path: "/reset-password",
      name: "reset-password",
      component: ResetPassword,
    },
  ],
});

let is_user_logged_in: boolean = false;

function CheckIfUserIsLoggedIn() {
  const uuid_token_session = sessionStorage.getItem("annima_user_uuid");
  const uuid_token_storage = localStorage.getItem("annima_user_uuid");
  const reset_token = localStorage.getItem("reset_token");

  if (uuid_token_session !== null || uuid_token_storage !== null || reset_token !== null) {
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
  if (is_user_logged_in && (to.name === "login" || to.name === "register" || to.name === "reset-password")) {
    return { name: "dashboard" };
  }
});

export default router;
