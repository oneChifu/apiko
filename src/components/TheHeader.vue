<template>
  <div 
    class="header"
    :class="{'header_auth': isAuthLayout}"
  >
    <v-app-bar
      app
      flat
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

        <div class="align-center d-none d-sm-flex">
          <v-btn
            depressed
            dark
            color="teal"
            width="131"
            class="mr-3"
            :to="{name: 'home'}"
            exact
            v-if="$route.name != 'home'"
          >
            <span>Catalog</span>
          </v-btn>

          <v-btn
            depressed
            dark
            color="teal"
            width="131"
            class="mr-3"
            :to="{name: 'add'}"
            v-if="$route.name == 'home'"
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

                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item>

              <v-list-item @click="logout">
                <v-list-item-icon>
                  <v-icon>mdi-logout</v-icon>
                </v-list-item-icon>

                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          
          <div v-else>
            <v-btn
              class="header__btn header__btn_auth"
              depressed
              text
              :dark="!isAuthLayout"
              width="100"
              :ripple="false"
              :to="{name: 'login'}" 
            >
              <span>Login</span>
            </v-btn>
          </div>

          <v-btn
            v-if="loggedIn"
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

        <v-app-bar-nav-icon 
          class="d-flex d-sm-none"
          :dark="!isAuthLayout"
          @click.stop="mobileMenu = !mobileMenu"
        ></v-app-bar-nav-icon>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer
      class="d-flex d-sm-none"
      v-model="mobileMenu"
      fixed
      right
      temporary
    >
      <template v-slot:prepend v-if="loggedIn">
        <v-list-item two-line>
          <v-list-item-avatar color="yellow" size="40">
            <span class="subtitle">{{ avatar }}</span>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.displayName }}</v-list-item-title>
          </v-list-item-content>

          <v-list-item-icon>
            <v-btn
              class="header__btn btn_favorites"
              depressed
              dark
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
          </v-list-item-icon>
        </v-list-item>
      </template>

      <v-list
        color="teal"
        dark
      >
        <v-list-item-group>
          <v-list-item 
            color="teal"
            v-if="$route.name != 'home'"
            :to="{name: 'home'}"
            exact
          >
            <v-list-item-title>Catalog</v-list-item-title>
          </v-list-item>

          <v-list-item 
            v-if="$route.name == 'home'"
            :to="{name: 'add'}"
          >
            <v-list-item-title>+ Add</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      
      <v-divider></v-divider>

      <v-list
        dense
      >
        <v-list-item-group
          v-if="loggedIn"
        >
          <v-list-item>
            <v-list-item-icon>
              <v-badge
                color="teal"
                overlap
                right
                :content="favoritesCounter"
                :value="favoritesCounter"
              >
                <template v-slot:badge>
                  <span v-if="favoritesCounter">2</span>
                </template>

                <v-icon color="teal">mdi-heart-outline</v-icon>
              </v-badge>
            </v-list-item-icon>

            <v-list-item-title>
              Favorites
            </v-list-item-title>
          </v-list-item>
          
          <v-list-item :to="{name: 'profile'}">
            <v-list-item-icon>
              <v-icon color="teal">mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon color="teal">mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

        <v-list-item-group
          v-else
        >
          <v-list-item 
            :to="{name: 'login'}"
          >
            <v-list-item-icon>
              <v-icon color="teal">mdi-login</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>login</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item 
            :to="{name: 'register'}"
          >
            <v-list-item-icon>
              <v-icon color="teal">mdi-account-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Register</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'the-header',

  props: {
  },

  data: () => ({
    mobileMenu: false,
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
        // console.log('fav', fav)
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
      this.$store.dispatch('users/logout')
    }
  }
}
</script>
