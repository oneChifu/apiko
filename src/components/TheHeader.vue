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
          v-if="$route.name != 'home'"
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
          v-if="$route.name == 'home' && loggedIn"
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
            v-if="favoritesCounter"
            :content="favoritesCounter"
            :value="favoritesCounter"
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
      loggedIn: "users/loggedIn",
      user: "users/data"
    }),

    isAuthLayout() {
      return this.$route.meta.authLayout
    },

    favoritesCounter() {
      if ( !this.user.favorites ) {
        return false
      }
      
      return Object.values(this.user.favorites).filter(fav => {
        console.log('fav', fav)
        return fav === true
      }).length
    },

    avatar() {
      let avatar = '01';

      if ( this.loggedIn && this.user.displayName ) {
        if ( this.user.displayName.indexOf(' ') >= 0 ) {
          let name = this.user.displayName.split(" ");
          avatar = `${name[0].charAt(0).toUpperCase()}${name[1].charAt(0).toUpperCase()}`
        } else {
          avatar = `${this.user.displayName[0].toUpperCase()}${this.user.displayName[1].toUpperCase()}`
        }
      }

      return avatar
    }
  },

  methods: {
    logout() {
      this.$store.dispatch('user/logout')
    }
  }
}
</script>
