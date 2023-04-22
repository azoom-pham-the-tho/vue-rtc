import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../views/HomeView.vue";
import VideoLocal from "../views/VideoLocal.vue";
import UserCall from "../views/UserCall.vue";
import TestComponent from "../views/TestComponent.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/videoLocal/:id",
    name: "videoLocal",
    component: VideoLocal,
  },
  {
    path: "/call/:id",
    name: "userCall",
    component: UserCall,
  },
  {
    path: "/test",
    name: "TestComponent",
    component: TestComponent,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
