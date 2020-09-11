import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#349A89',
      },
    }
  }

  // breakpoint: {
    // thresholds: {
    //   xs: 340,
    //   sm: 540,
    //   md: 800,
    //   lg: 1280,
    //   xl: 1300
    // },
    // scrollBarWidth: 24,
  // },
});
