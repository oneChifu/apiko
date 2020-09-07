import Vue from 'vue'
import Vuex from 'vuex'
// import * as fb from '../firebase'
// import router from '../router/index'

import user from "./user";

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    error: null,
    system: {}
  },

  getters: {
    error(state) {
      return state.error;
    },
  },

  mutations: {
    SET_ERROR(state, error) {
      console.log("SET_ERROR", error);
      state.error = error;
    },

    CLEAR_ERROR(state) {
      state.error = null;
    },
  },

  actions: {
    setError({ commit }, error) {
      console.log('setError', error)

      commit("SET_ERROR", error.code || error);
    },
  },

  modules: {
    user
  }
})

export default store;