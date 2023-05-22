import Vue from "vue";
import VueRouter from "vue-router";
import ChatPage from "../views/ChatPage.vue";
import UserCall from "../views/UserCall.vue";
import liveStream from "../views/LivePage.vue";
import LoginPage from "../views/LoginPage.vue";
import RegisterPage from "../views/RegisterPage.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/chat",
    name: "chat",
    component: ChatPage,
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
  {
    path: "/register",
    name: "register",
    component: RegisterPage,
  },
  {
    path: "/call/:id",
    name: "userCall",
    component: UserCall,
  },
  {
    path: "/live",
    name: "liveStream",
    component: liveStream,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
