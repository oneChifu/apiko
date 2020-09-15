<template>
  <div 
    class="header"
    :class="{'header_auth': isAuthLayout}"
  >
    <v-app-bar
      app
      flat
    >
      <v-container>
        <div class="d-flex">
          <router-link :to="{name: 'home'}" class="d-flex align-center">
            <v-img
              alt="Apiko"
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
              color="primary"
              width="131"
              class="mr-3"
              :to="{name: 'home'}"
              exact
              v-if="$route.name.search('home')"
            >
              <span>Catalog</span>
            </v-btn>

            <v-btn
              depressed
              color="primary"
              width="131"
              class="mr-3"
              :to="{name: 'add'}"
              v-else
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
                <v-avatar color="#F1C40F" size="40" :class="{'active': profileMenuToggle}" v-on="on">
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
                color="primary"
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
        </div>

        <v-container 
          v-if="!$route.name.search('home')" 
          class="header__search pa-0"
        >
          <v-row no-gutters>
            <v-col cols="12" sm="12" offset-sm="0" md="10" offset-md="1" lg="8" offset-lg="2" class="d-flex flex-wrap flex-sm-nowrap">
              <v-autocomplete
                class="mb-1 mr-sm-2 header__search__input_title"
                clearable
                hide-details
                ref="headerSearchTitle"
                :items="filteredItems.titles"
                placeholder="Search products by name"
                prepend-inner-icon="mdi-magnify"
                solo
                @input="searchItem('title', $event)"
              ></v-autocomplete>

              <v-autocomplete
                class="mb-1 mr-sm-2 header__search__input_location"
                clearable
                hide-details
                ref="headerSearchLocation"
                :items="filteredItems.locations"
                item-text="location"
                item-value="id"
                placeholder="Location"
                prepend-inner-icon="mdi-map-marker"
                solo
                @input="searchItem('location', $event)"
              ></v-autocomplete>
            </v-col>
          </v-row>
        </v-container>
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
          <v-list-item-avatar color="#F1C40F" size="40">
            <span class="subtitle">{{ avatar }}</span>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{ user.displayName }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-list color="primary">
        <v-list-item-group>
          <v-list-item 
            color="primary"
            v-if="$route.name.search('home')"
            :to="{name: 'home'}"
            exact
          >
            <v-list-item-title>Catalog</v-list-item-title>
          </v-list-item>

          <v-list-item 
            v-else
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
                color="primary"
                overlap
                right
                :content="favoritesCounter"
                :value="favoritesCounter"
              >
                <template v-slot:badge>
                  <span v-if="favoritesCounter">{{ favoritesCounter }}</span>
                </template>

                <v-icon color="primary">mdi-heart-outline</v-icon>
              </v-badge>
            </v-list-item-icon>

            <v-list-item-title>
              Favorites
            </v-list-item-title>
          </v-list-item>
          
          <v-list-item :to="{name: 'profile'}">
            <v-list-item-icon>
              <v-icon color="primary">mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon color="primary">mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

        <v-list-item-group
          v-else
        >
          <v-list-item :to="{name: 'login'}">
            <v-list-item-icon>
              <v-icon color="primary">mdi-login</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>login</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item 
            :to="{name: 'register'}"
          >
            <v-list-item-icon>
              <v-icon color="primary">mdi-account-plus</v-icon>
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

  data: () => ({
    mobileMenu: false,
    profileMenuToggle: false,
  }),

  computed: {
    ...mapGetters({
      loggedIn: "users/loggedIn",
      user: "users/data",
      favorites: "users/favorites",
      items: "items/data",
      searchedData: "items/searchedData"
    }),

    filteredItems() {
      let titles = []
      let locations = []

      this.filterItems(this.items).forEach((item, index, arr) => {
        if ( !titles.includes(item.title) ) {
          titles.push(item.title)
        }

        if ( !locations.includes(item.location) ) {
          locations.push(item.location)
        }
      })

      return {titles, locations};
    },

    isAuthLayout() {
      return this.$route.meta.authLayout
    },

    favoritesCounter() {
      if ( !this.favorites ) {
        return false
      }

      return Object.values(this.favorites).filter(fav => {
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

  watch: {
    searchedData: {
      handler(data) {
        this.filteredItems
      },
      deep: true
    }
  },

  methods: {
    logout() {
      this.$store.dispatch('users/logout')
    },

    searchItem(type, value) {
      this.$store.commit('items/SET_SEARCHED_DATA', {[type]: value})
    },

    filterItems(items) {
      if ( this.searchedData.title || this.searchedData.location ) {
        return items.filter(item => {
          if ( this.searchedData.title ) {
            return item.title == this.searchedData.title
          } else {
            return item.location == this.searchedData.location
          }
        })
      }

      return items
    }
  }
}
</script>
