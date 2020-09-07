import * as fb from '../firebase'
import router from '../router/index'

// import { auth, db } from "../firebase";
// import axios from "axios";
// import {
//   cacheAdapterEnhancer,
//   throttleAdapterEnhancer
// } from "axios-extensions";

// enhance the original axios adapter with throttle and cache enhancer
// const http = axios.create({
//   baseURL: "/",
//   headers: { "Cache-Control": "no-cache" },
//   adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter))
// });

export default {
  namespaced: true,

  state: {
    loginning: false,
    loggedIn: false,
    data: {},
  },

  getters: {
    loggedIn(state) {
      return state.loggedIn;
    },

    data(state) {
      return state.data;
    }
  },

  mutations: {
    SET_USER(state, data) {
      console.log('SET_USER', Object.keys(data).length)
      state.data = data;
      state.loggedIn = Object.keys(data).length > 0 ? true : false;
    },

    SET_USER_EMAIL(state, value) {
      state.data.email = value;
    },

    SET_USER_DIPLAYNAME(state, value) {
      state.data.displayName = value;
    },

    REMOVE_USER(state, data) {
      state.data = {};
      state.loggedIn = false;
    },

    // SET_LOGGED_IN(state, value) {
    //   state.user.loggedIn = value;
    // },

    // SET_SIGNED_IN(state, value) {
    //   console.log("SET_SIGNED_IN", value);
    //   state.signedIn = value;
    // },

    // SET_SIGNIGN(state, value) {
    //   console.log("SET_SIGNIGN", value);
    //   state.signing = value;
    // },

    // LOGOUT(state) {
    //   state.loggedIn = false;
    // },


    // SET_USER_DATA(state, data) {
    //   // console.log('SET_USER 111', data)
    //   state.data = data;
    // },

    // SET_TIMEZONE(state, value) {
    //   state.data.timeZone = value;
    // },

    // SET_LANGUAGE(state, value) {
    //   state.data.lang = value;
    // },

    // SET_TARIFF_PLAN(state, value) {
    //   state.info.Company.TariffPlanID = value;
    //   // state.data.changingPlan = false;

    //   // console.log("SET_PLAN", state.data);
    // },

    // CHANGE_PLAN(state) {
    //   state.data.changingPlan = true;
    // },

    // UPDATE_USER(state, data) {
    //   // if ( state.data.loggedIn ) {

    //   state.data = Object({}, state.data, data);
    //   // let userData = JSON.stringify(Object.assign(state.user.data, data))
    //   // state.user.data.info = data
    //   // }
    // },

    // SETING_USER(state, value) {
    //   state.isSetingUser = value;
    // },

    // // LOGOUT(state) {
    // //   state.user.loggedIn = false
    // // },

    // CLEAR_USER(state) {
    //   console.log("CLEAR_USER");
    //   state.data = null;
    // }
  },

  actions: {
    async login({ dispatch, commit, state }, form) {
      try {

        const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)

        // console.log('login', user)

        // commit('SET_USER', user.)
        // router.push('/')

        // fetch user and set in state
        await dispatch('fetchUser', user)
        router.push('/')
      } catch (e) {
        dispatch("setError", e, { root: true });
        throw e;
      }
    },

    async fetchUser({ dispatch, commit }, user) {
      // fetch user data from collection
      // const userProfile = await fb.usersCollection.doc(user.uid).get()

      console.log('fetchUser', user)

      const userData = {
        displayName: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        emailVerified: user.emailVerified,
        uid: user.uid
      }

      // set user data to state
      commit('SET_USER', userData)

      // redirect to home page
    },

    async editUser({ dispatch, commit }, {email, displayName, password}) {
      let user = fb.auth.currentUser;

      // Update user email if exist
      // if ( email != '' && email != user.email ) {
      //   user.updateEmail(email).then((result) => {
      //     console.log('updateEmail', result)
      //     commit('SET_USER_EMAIL', email)
      //   }).catch((e) => {
      //     console.log('error updateEmail', e)
      //     dispatch("setError", e, { root: true });
      //     throw e;
      //   });
      // }

      // Update user displayName (Full Name) if exist
      if ( displayName != '' && displayName != user.displayName ) {
        user.updateProfile({
          displayName,
        }).then((result) => {
          commit('SET_USER_DIPLAYNAME', displayName)
        }).catch((e) => {
          console.log('error updateProfile', e)
          dispatch("setError", e, { root: true });
          throw e;
        });
      }

      // Update user password if exist
      // if ( password != '' ) {
      //   user.updatePassword(password).then((result) => {
      //     console.log('updateProfile', result)
      //   }).catch((e) => {
      //     console.log('error updatePassword', e)
      //     dispatch("setError", e, { root: true });
      //     throw e;
      //   });
      // }
    },

    async logout({ dispatch, commit }) {
      try {
        fb.auth.signOut().then((result) => {
          commit('SET_USER', {})
          router.push('/login').catch(e => {})
        })
      } catch (e) {
        dispatch("setError", e, { root: true });
        throw e;
      }
    },



    async setSigning({ dispatch, commit }, value) {
      try {
        commit("SET_SIGNIGN", value);
      } catch (e) {
        dispatch("setError", e, { root: true });
        throw e;
      }
    },

    async signUp({ dispatch, commit }, { email, password }) {
      try {
        const data = await firebase.auth().createUserWithEmailAndPassword(email, password);
        console.log('signUp', data)
        await dispatch("setUser", data.user);
      } catch (e) {
        dispatch("setError", e, { root: true });
        throw e;
      }
    },

    

    getUid() {
      const user = firebase.auth().currentUser;
      return user ? user.uid : null;
    },

    async setUser({ dispatch, commit }) {
      if ( localStorage.userData ) {
        commit("SET_USER_DATA", JSON.parse(localStorage.getItem('userData')));
        commit("SET_SIGNED_IN", true);
      } else {
        try {
          await this._vm.$http
            .get(`front/user`)
            .then(async response => {
              console.log('setUser', response)
              commit("SET_USER_DATA", response.data);
              commit("SET_SIGNED_IN", true);
              localStorage.setItem('userData', JSON.stringify(response.data))
            })
        } catch (e) {
          dispatch("setError", e, { root: true });
          throw e;
        }
      }
          
      // localStorage.setItem('jwt', data.Data.jwt)

      // await this._vm.$http
      //   .get(`/data/userData.json?nocache=${new Date().getTime() * 1000}`)
      //   .then(response => {
      //     console.log('!!!!!!!!!! response', response)
          
      //     response.data.ID = user.uid
      //     response.data.Info.Email = user.email
      //     // let data = Object.assign({}, response.data, {
      //     //   Email: user.email,
      //     //   UID: user.uid
      //     // });

      //     commit("SET_USER", response.data);
      //     commit("SET_SIGNED_IN", true);
      //     // dispatch('auth/setLoggedIn', true, { root: true })
      //   })
    },

    async updateUser({ dispatch, commit, state }, data) {
      try {
        if (data) {
          if (data && data.operationType) {
            console.log("updateUser operationType", data);

            await dispatch("setUser", data.user);
          } else {
            if (state.data) {
              console.log("updateUser updateUser", data);

              await dispatch("updateUser", data);
            } else {
              console.log("updateUser setUser", data);

              await dispatch("setUser", data);
            }
          }
        } else {
          await dispatch("setUser", data);
        }
        // console.log('state.data', this.getters['user/user'])
        // if ( state.data ) {
        // console.log('updateUser', state)
        // commit("UPDATE_USER", user)
        // } else {
        // if ( !state.isSetingUser ) {
        //   console.log('updateUser setUser', state)
        //   await dispatch("setUser", user)
        // }
        // }
      } catch (e) {
        console.error(e);
      }
    },

    setLanguage({ commit }, value) {
      commit("SET_LANGUAGE", value);
    },

    setTimeZone({ commit }, value) {
      commit("SET_TIMEZONE", value);
    },

    // async setPlan({ commit }, id) {
    //   let plan = this.state.plans.list.find(elem => elem.ID === id);

    //   let date = new Date();
    //   plan.start = Math.floor(date.getTime() / 1000);
    //   date.getMonth() + 1;
    //   plan.end = Math.floor(date.getTime() / 1000);

    //   console.log("plan", plan);

    //   commit("SET_PLAN", plan);
    // },

    // async setTariffPlan({ commit, state }, tariffPlanID) {
    //   console.log('tariffPlanID', tariffPlanID)
    //   await this._vm.$http
    //     .get(`/data/setPlan.json?nocache=${new Date().getTime() * 1000}`, {
    //       UserID: state.info.ID,
    //       TariffPlanID: tariffPlanID
    //     })
    //     .then(response => {
    //       return new Promise((resolve) => setTimeout(() => {
    //         commit('SET_TARIFF_PLAN', tariffPlanID)
    //         resolve()
    //       }, 2000))
    //       // console.log('!!!!!!!!!! response', response)
          
    //       // let data = Object.assign({}, response.data, {
    //       //   Email: user.email,
    //       //   UID: user.uid
    //       // });

    //       // commit("SET_USER", data);
    //       // commit("SET_SIGNED_IN", true);
    //       // dispatch('auth/setLoggedIn', true, { root: true })
    //     })
    //     .catch(error => {
    //       console.error(error);
    //     })
    // },

    changePlan({ commit }) {
      commit("CHANGE_PLAN");
    },

    // updateUser({ commit }, data) {
    //   if (data) {
    //     commit("UPDATE_USER", data)
    //   }
    // },

    clearUser({ commit }) {
      commit("CLEAR_USER");
    }
  }
};
