<template>
  <v-col cols="3" class="pa-2">
    <v-card
      class="mx-auto"
      flat 
      outlined
    >
      <v-img
        src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
        height="148px"
      ></v-img>

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
          <v-icon color="teal">mdi-heart-outline</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <div><b>${{ Number.parseFloat(item.price.toFixed(2)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ') }}</b></div>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
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
    },

    created() {
    }
  }
</script>
