import { fb, storage, db, auth, itemsCollection } from '../firebase'
import router from '../router/index'

export default {
  namespaced: true,

  state: {
    data: [],
  },

  getters: {
    data(state) {
      return state.data;
    }
  },

  mutations: {
    SET_ITEMS(state, data) {
      state.data = data;
    },

  },

  actions: {
    async getItems({ dispatch, commit, rootState }, items) {
      try {
        const res = await itemsCollection.get()
        const items = res.docs.map(i => {
          return Object.assign(i.data(), {id: i.id})
        })

        // items.forEach(async (item) => {
          // Object.assign(item, )
          // await storage.ref(`images/${rootState.user.data.uid}/${data.itemId}/${img.name.replace(img.name.substr(0, img.name.lastIndexOf(".")), createUUID())}`).put(img)
        // })

        // console.log('getItems', items)

        commit('SET_ITEMS', items)
      } catch (e) {
        dispatch("setError", e, { root: true });
      }
    },

    async addItem({ dispatch, commit, rootState }, item) {
      // console.log('addItem', item)
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
          
        // console.log('await imageUrl', res.ref.getDownloadURL())
        return res.ref.getDownloadURL()
      }))

      return imagesUrl;
    },

    
  }
};
