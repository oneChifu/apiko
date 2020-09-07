<template>
  <v-app-bar
    app
    :class="{'header_auth': isAuthLayout}"
    flat
    class="header"
    height="77"
  >
    <v-container class="d-flex">
      <router-link :to="{name: 'home'}" class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink"
          contain
          :src="isAuthLayout ? 'img/logo-black.svg' : 'img/logo-white.svg'"
          width="102"
        />
      </router-link>

      <v-spacer></v-spacer>

      <div class="d-flex align-center">
        <v-btn
          depressed
          dark
          color="teal"
          width="131"
          class="mr-2"
          :to="{name: 'home'}"
        >
          <span>Catalog</span>
        </v-btn>

        <v-btn
          depressed
          dark
          color="teal"
          width="131"
          class="mr-2"
          :to="{name: 'add'}"
        >
          <span>+ Add</span>
        </v-btn>

        <v-menu 
          v-if="loggedIn"
          offset-y 
          bottom 
          left 
          transition="slide-y-transition"
        >
          <template v-slot:activator="{ on }">
            <v-avatar color="yellow" size="40" :class="{'active': profileMenuToggle}" v-on="on">
              <span class="subtitle">{{ avatar }}</span>
            </v-avatar>
          </template>

          <v-list dense>
            <v-list-item :to="{name: 'profile'}">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="logout">
              <v-list-item-icon>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-btn
          v-else
          class="header__btn btn_login"
          depressed
          text
          width="120"
          :ripple="false"
          :to="{name: 'login'}"
        >
          <span>Login</span>
        </v-btn>

        <v-btn
          class="header__btn btn_favorites"
          depressed
          :dark="isAuthLayout ? false : true"
          text
          plain
          :ripple="false"
        >
          <v-badge
            content="2"
            value="2"
            color="teal"
            overlap
          >
            <v-icon dark>mdi-heart-outline</v-icon>
          </v-badge>
        </v-btn>
      </div>
    </v-container>
  </v-app-bar>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'the-header',

  props: {
  },

  data: () => ({
    profileMenuToggle: false,
    signOutDialog: false
  }),

  computed: {
    ...mapGetters({
      loggedIn: "user/loggedIn",
      user: "user/data"
    }),

    isAuthLayout() {
      return this.$route.meta.authLayout
    },

    avatar() {
      if ( this.loggedIn ) {
        let name = this.user.displayName.split(" ");
        let avatar = '';

        if ( name.length > 1 ) {
          avatar = `${name[0].charAt(0).toUpperCase()}${name[1].charAt(0).toUpperCase()}`
        } else {
          avatar = `${name[0].charAt(0).toUpperCase()}${name[0].charAt(1).toUpperCase()}`
        }

        return avatar
      }
    }
  },

  methods: {
    logout() {
      this.$store.dispatch('user/logout')
    }
  }
}
</script>
