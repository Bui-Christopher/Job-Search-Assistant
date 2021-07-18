import Vue from "vue";
import VueRouter from "vue-router";
import Calendar from "../views/Calendar.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import List from "../views/List.vue"
import AddFriend from "../views/AddFriend.vue"

import * as firebase from "firebase/app";
import "firebase/auth";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "calendar",
    component: Calendar,
    meta: { requiresAuth: true }
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/register",
    name: "register",
    component: Register
  },
  {
    path: "/list",
    name: "list",
    meta: { requiresAuth: true},
    component: List
  },
    {
    path: "/addfriend",
    name: "addfriend",
    meta: { requiresAuth: true},
    component: AddFriend
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

let counter = 0;

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = firebase.auth().currentUser;
  console.log("isauthenticated", isAuthenticated);
  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;