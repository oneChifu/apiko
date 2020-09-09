<template>
  <v-col cols="3" class="pa-2">
    <v-card
      class="mx-auto"
      flat 
      outlined
    >
      <div v-if="item.imagesUrl.length">
        <v-img
          :src="item.imagesUrl[0]"
          aspect-ratio="1.5"
        ></v-img>
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
            @click="toggleFavorites"
            v-text="(user.favorites[item.id]) ? 'mdi-heart' : 'mdi-heart-outline'"
          ></v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
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
    }
  },

  data: () => ({
  }),

  computed: {
    ...mapGetters({
      user: "users/data",
    }),
  },

  methods: {
    async toggleFavorites() {
      await this.$store.dispatch('users/toggleFavorites', this.item)
    }
  }
}
</script>
