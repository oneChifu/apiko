import Vue from 'vue';
import App from './App.vue';
import { auth } from './firebase';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

import "./midleware/veevalidate";

Vue.config.productionTip = false;

let app
auth.onAuthStateChanged((user) => {
  if ( user ) {
    store.dispatch('users/fetchUser', user)
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
