<template>
  <v-col cols="3" class="pa-2">
    <v-card
      class="mx-auto"
      flat 
      outlined
    >
      <div>
        <v-img
          v-if="item.imagesUrl && item.imagesUrl.length"
          :src="item.imagesUrl[0]"
          aspect-ratio="1.5"
        ></v-img>

        <div v-else class=""></div>
      </div>

      <v-card-title style="position: relative;">
        {{ item.title }}

        <v-btn
          absolute
          dark
          fab
          top
          right
          x-small
          :ripple="false"
          color="white"
        >
          <v-icon 
            color="teal"
            @click="toggleFavorite()"
            v-text="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
          ></v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <div>
          Item id: {{ item.id }}
        </div>

        <div v-if="user.favorites">
          <div v-for="(i, index) in user.favorites" :key="index">{{ index }}</div>
        </div>

        <div><b>${{ Number.parseFloat(Number.parseFloat(item.price).toFixed(2)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') }}</b></div>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: 'catalog-item',

  props: {
    item: {
      type: Object,
      required: true
    },

    // user: {
    //   type: Object,
    //   required: true
    // }
  },

  data: () => ({
    // favorite: false
  }),

  computed: {
    ...mapGetters({
      loggedIn: "users/loggedIn",
      user: "users/data",
      favorites: "users/favorites",
    }),
    
    isFavorite() {
      // get: function() {
        if ( !this.loggedIn || !this.favorites ) {
          return false
        }

      //   console.log('favorite get', this)

        return this.favorites[this.item.id] ? true : false
      // },

      // set: function(val) {
      //   console.log('favorite set', val)
        
      //   // val
      // }
    }
  },

  // watch: {
  //   user: {
  //     handler(val) {
  //       // do stuff
  //       console.log('watch user', val)
  //     },
  //     immediate: true,
  //     deep: true
  //   }
  // },

  mounted() {
    // if ( !this.user || !this.user.favorites ) {
    //   this.favorite = false
    // }

    // this.favorite = this.user.favorites[this.item.id] ? true : false

    // this.isFavorite()
    // console.log('mounted item', this.user)

    // favorite() {
    //   if ( !this.user.favorites ) {
    //     return false
    //   }

    //   return this.user.favorites[this.item.id] ? true : false
    // }
  },

  created() {
    
    // this.isFavorite()
    // this.favorite = this.isFavorite()

    console.log('create item', this.user)
  },

  methods: {
    async toggleFavorite() {
      await this.$store.dispatch('users/toggleFavorite', this.item)

      // Object.assign(this.user.favorites, {'dada': false})
    },

    // isFavorite() {
    //   if ( !this.user || !this.user.favorites ) {
    //     return false
    //   }

    //   return this.user.favorites[this.item.id] ? true : false
    // }
  }
}
</script>
