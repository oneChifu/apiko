import { fb, storage, db, auth, itemsCollection } from '../firebase'
import router from '../router/index'

export default {
  namespaced: true,

  state: {
    data: [],
    searchedData: {}
  },

  getters: {
    data(state) {
      return state.data;
    },

    searchedData(state) {
      return state.searchedData;
    }
  },

  mutations: {
    SET_ITEMS(state, data) {
      // Sort items by created date "created" DESC
      function sortItems(items) {
        function compare(a, b) {
          if ( a.created > b.created ) {
            return -1;
          }

          if ( a.created < b.created ) {
            return 1;
          }
          
          return 0;
        }

        return items.sort(compare);
      }

      state.data = sortItems(data);
    },

    SET_SEARCHED_DATA(state, data) {
      if ( typeof data == 'object' ) {
        state.searchedData = Object.assign({}, state.searchedData, data);
      } else {
        state.searchedData = {}
      }
    },
  },

  actions: {
    async getItems({ dispatch, commit, rootState }, options) {
      try {
        const result = await itemsCollection.get()

        commit('SET_ITEMS', result.docs.map(i => {
          return Object.assign(i.data(), {id: i.id})
        }))
      } catch (e) {
        dispatch("setError", e, { root: true });
      }
    },

    async addItem({ dispatch, commit, rootState }, item) {
      try {
        const resultItem = await itemsCollection.add({
          userUID: rootState.users.data.uid,
          title: item.title,
          location: item.location,
          description: item.description,
          price: item.price,
          created: fb.firestore.Timestamp.fromDate(new Date())
        })

        if ( item.images.length ) {
          const imagesUrl = await dispatch('addImages', {itemId: resultItem.id, images: item.images})

          await itemsCollection.doc(resultItem.id).update({imagesUrl: imagesUrl});
        }

        router.push('/')
      } catch (e) {
        dispatch("setError", e, { root: true });
      }
    },

    async addImages({ dispatch, commit, rootState }, data) {
      function uniqName() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
           var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
           return v.toString(16);
        });
      }

      let imagesUrl = await Promise.all(data.images.map(async img => {
        const res = await storage.ref(`images/${data.itemId}/${img.name.replace(img.name.substr(0, img.name.lastIndexOf(".")), uniqName())}`).put(img)
          
        return res.ref.getDownloadURL()
      }))

      return imagesUrl;
    },

    setSearchedData({ dispatch, commit, state }, data) {
      commit('SET_SEARCHED_DATA', data)
    }
  }
};
