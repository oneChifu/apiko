import { fb, storage, db, auth, itemsCollection, usersCollection } from '../firebase'
import router from '../router/index'

export default {
  namespaced: true,

  state: {
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
  },

  actions: {
    async register({ dispatch, commit, state, rootState }, form) {
      try {
        const { user } = await auth.createUserWithEmailAndPassword(form.email, form.password)

        // update profile of new user
        await user.updateProfile({
          displayName: form.displayName
        })
        
        // register collection for user
        await usersCollection.doc(state.data.uid).set({
          favorites: {}
        })

        // redirect to home page
        router.push('/')
      } catch (e) {
        dispatch("setError", e, { root: true });
        throw e;
      }
    },

    async login({ dispatch, commit, state }, form) {
      try {
        const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)

        // fetch user and set in state even when register
        await dispatch('fetchUser', user)
        router.push('/')
      } catch (e) {
        dispatch("setError", e, { root: true });
        throw e;
      }
    },

    async fetchUser({ dispatch, commit, state }, user) {
      const userData = {
        displayName: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        emailVerified: user.emailVerified,
        uid: user.uid
      }

      const userDoc = await usersCollection.doc(userData.uid).get();
      userData.favorites = userDoc.data().favorites

      // set user data to state
      commit('SET_USER', userData)
    },

    async editUser({ dispatch, commit }, {email, displayName, password}) {
      let user = auth.currentUser;

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
        auth.signOut().then((result) => {
          commit('SET_USER', {})
          router.push('/login').catch(e => {})
        })
      } catch (e) {
        dispatch("setError", e, { root: true });
        throw e;
      }
    },

    async toggleFavorites({ dispatch, commit, state, rootState }, item) {
      if ( !auth.currentUser ) {
        return false
      }

      try {
        usersCollection.doc(state.data.uid).set({
          favorites: {
            // [item.id]: favoritesValue()
            [item.id]: state.data.favorites[item.id] ? false : true
          }
        }, {merge: true}).then(() => {
          state.data.favorites[item.id] = !state.data.favorites[item.id]
        });
      } catch (e) {
        dispatch("setError", e, { root: true });
      }
    },
  }
};
