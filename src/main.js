import Vue from 'vue';
// import VueFire from 'vuefire';
import App from './App.vue';

import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

import { auth } from './firebase';

// Vue.use(VueFire);


Vue.config.productionTip = false;


// new Vue({
//   router,
//   store,
//   vuetify,
//   render: h => h(App)
// }).$mount('#app')


let app
auth.onAuthStateChanged((user) => {
  console.log('firebase', user)

  if ( user ) {
    store.dispatch('user/fetchUser', user)
  // } else {
    // store.dispatch('user/logout')
  }

  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App)
    }).$mount('#app')
  }
})



// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /{document=**} {
//       allow read, write: if
//           request.time < timestamp.date(2020, 10, 7);
//     }
//   }
// }