import Vue from 'vue';
import Vuesax from 'vuesax';
import 'vuesax/dist/vuesax.css'
import App from './App.vue';
import vuetify from './plugins/vuetify';
import VueTextareaAutosize from 'vue-textarea-autosize'
import firebase from 'firebase/app';
import 'firebase/firestore';
import router from "./router";
import store from "./store";
import axios from "axios";

Vue.use(VueTextareaAutosize);
Vue.use(Vuesax);

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

firebase.initializeApp({
    apiKey: "AIzaSyBm30VO0QPhOYVuoKszwEtkIArl1LX51to",
    authDomain: "cpsc490-calendar.firebaseapp.com",
    databaseURL: "https://cpsc490-calendar.firebaseio.com",
    projectId: "cpsc490-calendar",
    storageBucket: "cpsc490-calendar.appspot.com",
    messagingSenderId: "922525928770",
    appId: "1:922525928770:web:c3fb97f552d60b746c4cdb"
});

let app;

firebase.auth().onAuthStateChanged(user => {
  console.log("user", user);
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount("#app");
  }
});

export const db = firebase.firestore();

// new Vue({
//   vuetify,
//   render: h => h(App)
// }).$mount('#app')
