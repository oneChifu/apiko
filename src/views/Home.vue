<template>
  <v-container class="main catalog pa-0">
    <v-row no-gutters>
      <v-col cols="12" sm="12" offset-sm="0" md="10" offset-md="1" lg="8" offset-lg="2">
        <div v-if="loading" class="mt-10 d-flex align-center justify-center">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        </div>

        <div v-if="!loading && filteredItems.length">
          <CatalogFilter @filteredPrice="filterItemsPrice" :items="filteredItems" />

          <v-container class="mt-4 d-flex flex-wrap pa-0">
            <catalog-item v-for="item in filteredItems" :key="item.id" :item="item" />
          </v-container>

          <v-pagination
            class="mt-4"
            v-model="currentPage"
            circle
            :length="Math.ceil(items.length / pagination.visible)"
            next-icon="mdi-chevron-right"
            prev-icon="mdi-chevron-left"
            :page="currentPage"
            :total-visible="pagination.visible"
          ></v-pagination>
        </div>

        <div v-if="!loading && !filteredItems.length">
          <div class="text-h4 text-center">No filtered items</div>
        </div>

        <div v-if="!loading && !items.length" class="mt-14 text-center">
          <div class="text-h2">Welcome to <span class="primary--text">apiko</span></div>

          <p class="text-h6 mt-4">There is no items yet.</p>

          <v-btn
            depressed
            color="primary"
            width="200"
            class="mt-2 font-weight-bold"
            large
            :to="{name: 'add'}"
          >
            <span>Add first item</span>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'home',

  components: {
    CatalogItem: () => import(`@/components/CatalogItem`),
    CatalogFilter: () => import(`@/components/CatalogFilter`),
  },

  data: () => ({
    loading: true,
    currentPage: 1,
    pagination: {
      visible: 8,
      nextIcons: ['mdi-chevron-right', 'mdi-arrow-right', 'mdi-menu-right'],
      prevIcons: ['mdi-chevron-left', 'mdi-arrow-left', 'mdi-menu-left'],
    },

    prices: {}
  }),

  computed: {
    ...mapGetters({
      user: "users/data",
      favorites: "users/favorites",
      items: "items/data",
      searchedData: "items/searchedData"
    }),

    filteredItems() {
      return this.filterItems(this.items)
    }
  },

  created() {
    this.fetchItems()
  },

  mounted() {
    this.currentPage = parseInt(this.$route.params['page'] / 10) || 1;
  },

  watch: {
    currentPage(val) {
      this.$router.push({ name: 'home-catalog', params: { page: val }})
    },

    searchedData: {
      handler(data) {
        this.filteredItems
      },
      deep: true
    },
  },

  methods: {
    fetchItems() {
      this.loading = true
      this.$store.dispatch('items/getItems').then(() => {
        this.loading = false
      })
    },

    filterItems(items) {
      if ( Number(this.prices.itemPriceFrom) || Number(this.prices.itemPriceTo) ) {
        var prices = this.items.map(i => Number(i.price))
        var max = Math.max.apply(null, prices)
        var min = Math.min.apply(null, prices)

        var from = min
        if ( Number(this.prices.itemPriceFrom) < 0 ) {
          from = 0
        } else if ( this.prices.itemPriceFrom >= max ) {
          from = max - 1
        } else {
          from = Number(this.prices.itemPriceFrom)
        }

        var to = Number(this.prices.itemPriceTo) || max
        if ( to > max ) {
          to = max
        } else if ( to <= from ) {
          to = from + 1
        }
      }

      const result = this.searchItems(items).filter(item => {
        if ( Number(this.prices.itemPriceFrom) || Number(this.prices.itemPriceTo) ) {
          if ( Number(item.price) >= Number(from) && Number(item.price) <= Number(to) ) {
            return item
          }
        } else {
          return item;
        }
      })

      // Making pagination separation
      return result.slice(Math.ceil((this.currentPage - 1) * this.pagination.visible), Math.ceil(this.currentPage * this.pagination.visible))
    },

    filterItemsPrice(prices) {
      this.prices = prices
    },

    searchItems(items) {
      if ( this.searchedData && (this.searchedData.title || this.searchedData.location) ) {
        return items.filter(item => {
          if ( this.searchedData.title && !this.searchedData.location ) {
            return item.title == this.searchedData.title
          } else if ( this.searchedData.location && !this.searchedData.title ) {
            return item.location == this.searchedData.location
          } else {
            return item.title == this.searchedData.title && item.location == this.searchedData.location
          }
        })
      }

      return this.items
    }
  },

  beforeRouteLeave(to, from, next) {
    this.$store.commit('items/SET_SEARCHED_DATA')
    next()
  },
}
</script>
