<template>
  <v-app>
    <top-header></top-header>
  <vs-navbar v-model="activeItem" class="nabarx">
      <div slot="title">
        <vs-navbar-title>
          Job-Search-Assistant
        </vs-navbar-title>
      </div>
      <vs-navbar-item index="0">
        <router-link to="/" v-if="this.$store.state.loggedIn == true">Calendar</router-link>
      </vs-navbar-item>
      <vs-navbar-item index="1">
        <router-link to="/list" v-if="this.$store.state.loggedIn == true">List</router-link>
      </vs-navbar-item>
      <!-- <vs-navbar-item index="5">
        <router-link to="/addfriend" v-if="this.$store.state.loggedIn == true">Add Friend</router-link>
      </vs-navbar-item> -->
      <vs-navbar-item index="2">
        <router-link to="/login" v-if="this.$store.state.loggedIn == false">Login</router-link>
      </vs-navbar-item>
      <vs-navbar-item index="3">
        <router-link to="/register" v-if="this.$store.state.loggedIn == false">Register</router-link>
      </vs-navbar-item>
      <vs-navbar-item index="4">
        <button class="but" @click="signOut" v-if="this.$store.state.loggedIn == true">Sign out</button>
        <!-- <router-link to="/" v-on:click="signOut" v-if="this.$store.state.loggedIn == true">Logout</router-link> -->
      </vs-navbar-item>
    </vs-navbar>
    <!-- <div id="nav">
      <router-link to="/">Calendar</router-link>
      <router-link to="/register">Register</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/list">List</router-link>
    </div> -->
    <router-view></router-view>
  </v-app>
</template>

<script>
import Header from "./components/Top-Header";
import * as firebase from "firebase/app";
import "firebase/auth";

export default {
  name: 'App',

  components: {
    "top-header": Header
  },

    mounted() {
    this.setupFirebase();
  },

data:()=>({
    activeItem: 0
  }),

  methods: {
    setupFirebase() {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          // User is signed in.
          console.log("signed in");
          this.loggedIn = true;
          console.log("userid is : ", user.uid);
          this.$store.commit('setUser', user.uid);
        } else {
          // No user is signed in.
          this.loggedIn = false;
          console.log("signed out", this.loggedIn);
        }
      })},
    signOut() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$store.commit('changeLoggedIn');
          this.$router.replace({ name: "login" });
        });

      sessionStorage.clear();
    }
  }
};
</script>


<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
div {
  color: inherit;
}
.but {
    font-size: .8rem;
    padding: 10px 12px;
    display: block;
    color: inherit;
    text-decoration: none!important;
    position: relative;
    z-index: 100;
    color: #1976d2;
}
</style>