<template>
  <v-col cols="6" sm="3" class="pa-2">
    <v-card
      class="catalog__item"
      flat 
      outlined
    >
      <div 
        v-if="item.imagesUrl && item.imagesUrl.length"
        class="catalog__item__image"
      >
        <v-img
          :src="item.imagesUrl[0]"
          :aspect-ratio="16/12"
        ></v-img>
      </div>

      <v-responsive 
        v-else 
        class="catalog__item__image catalog__item__image_empty"
        :aspect-ratio="16/12"
      >
        <v-icon color="primary">mdi-image-area</v-icon>
      </v-responsive>

      <v-card-title>
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
          class="catalog__item__favorite"
          @click="toggleFavorite()"
        >
          <v-icon 
            :color="isFavorite ? 'primary' : 'grey'"
            size="20"
            v-text="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
          ></v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <div class="catalog__item__price">
          <b>${{ Number.parseFloat(Number.parseFloat(item.price).toFixed(2)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') }}</b>
        </div>
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
  },

  data: () => ({
  }),

  computed: {
    ...mapGetters({
      loggedIn: "users/loggedIn",
      user: "users/data",
      favorites: "users/favorites",
    }),
    
    isFavorite() {
      if ( !this.loggedIn || !this.favorites ) {
        return false
      }

      return this.favorites[this.item.id] ? true : false
    }
  },

  methods: {
    async toggleFavorite() {
      await this.$store.dispatch('users/toggleFavorite', this.item)
    },
  }
}
</script>
