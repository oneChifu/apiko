import { fb, storage, db, auth, itemsCollection, usersCollection } from '../firebase'
import router from '../router/index'

export default {
  namespaced: true,

  state: {
    loggedIn: false,
    data: {},
    favorites: {},
  },

  getters: {
    loggedIn(state) {
      return state.loggedIn;
    },

    data(state) {
      return state.data;
    },

    favorites(state) {
      return state.favorites;
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

    SET_FAVORITES(state, data) {
      console.log('SET_FAVORITES', data)
      state.favorites = data;
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
          favorites: Object
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
        const { user } = await auth.signInWithEmailAndPassword(form.email, form.password)

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
        uid: user.uid,
      }

      const userDoc = await usersCollection.doc(userData.uid).get();
      if ( userDoc.data().favorites ) {
        commit('SET_FAVORITES', userDoc.data().favorites)
      }

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
          commit('REMOVE_USER')
          router.push('/login').catch(e => {})
        })
      } catch (e) {
        dispatch("setError", e, { root: true });
        throw e;
      }
    },

    async toggleFavorite({ dispatch, commit, state, rootState }, item) {
      if ( !auth.currentUser ) {
        return false
      }

      try {
        let userFavorites = Object.assign({}, state.favorites);
        
        if ( userFavorites[item.id] === undefined ) {
          await usersCollection.doc(state.data.uid).set({
            favorites: {
              [item.id]: true
            }
          }, {merge: true}).then((res) => {
            userFavorites[item.id] = true
          })
        } else {
          await usersCollection.doc(state.data.uid).set({
            favorites: {
              [item.id]: fb.firestore.FieldValue.delete()
            }
          }, {merge: true}).then((res) => {
            delete userFavorites[item.id]
          })
        }
        
        commit('SET_FAVORITES', userFavorites)
      } catch (e) {
        dispatch("setError", e, { root: true });
      }
    },
  }
};
