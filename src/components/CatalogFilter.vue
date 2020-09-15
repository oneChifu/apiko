<template>
  <div class="catalog__filter">
    <v-text-field
      placeholder="Price from (USD)"
      type="number"
      outlined
      dense
      hide-details
      clearable
      v-model="itemPriceFrom"
      @keydown="filterPrice()"
      @input="filterPrice()"
    ></v-text-field>

    <div class="mx-4">-</div>

    <v-text-field
      placeholder="Price to (USD)"
      type="number"
      outlined
      dense
      hide-details
      clearable
      v-model="itemPriceTo"
      @keydown="filterPrice()"
      @input="filterPrice()"
    ></v-text-field>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: 'catalog-filter',

  props: {
    items: {
      type: Array,
      required: true
    },
  },

  data: () => ({
    itemPriceFrom: '',
    itemPriceTo: '',
  }),

  computed: {
    ...mapGetters({
      loggedIn: "users/loggedIn",
      user: "users/data",
    }),
  },

  methods: {
    filterPrice() {
      this.$emit('filteredPrice', {
        itemPriceFrom: this.itemPriceFrom,
        itemPriceTo: this.itemPriceTo,
      })
    },
  }
}
</script>
