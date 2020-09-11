<template>
  <v-container class="main">
    <v-row no-gutters>
      <v-col cols="8" offset="2" class="">
        <div v-if="loading" class="mt-10 d-flex align-center justify-center">
          <v-progress-circular indeterminate color="teal" size="64"></v-progress-circular>
        </div>

        <v-container v-else class="mt-4 d-flex flex-wrap pa-0">
          <catalog-item v-for="item in filteredItems" :key="item.id" :item="item" />
        </v-container>
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
  },

  data: () => ({
    loading: true,
  }),

  computed: {
    ...mapGetters({
      user: "users/data",
      favorites: "users/favorites",
      items: "items/data"
    }),

    filteredItems() {
      return this.sortItems(this.items.filter(item => {
        return item
      }))
    }
  },

  created() {
    this.$store.dispatch('items/getItems').then((res) => {
      this.loading = false
    })
  },

  methods: {
    // Sort items by created date "created" DESC
    sortItems(items) {
      function compare(a, b) {
        if ( a.created > b.created ) {
          return -1;
        }

        if ( a.created < b.created ) {
          return 1;
        }
        
        return 0;
      }

      return items.sort(compare);
    },
  }
}
</script>
