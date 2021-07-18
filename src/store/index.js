
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState({
    storage: window.sessionStorage,
})],
  state: {
    userid: null,
    loggedIn: false
  },
  mutations: {
    setUser: (state, userid) => {
      state.userid = userid
    },
    changeLoggedIn: (state) => {
      if (state.loggedIn == false) {
        state.loggedIn = true
      }
      else {
        state.loggedIn = false
      }
    }
  },
  actions: {
  },
  modules: {
  },
  getters: {
    retrieveUser: state => {
      return state.userid
    }
  }
})