<template>
  <v-container class="main d-flex flex-wrap">
    <v-row no-gutters>
      <v-col cols="8" offset="2" class="">
        <v-container class="main d-flex flex-wrap pa-0">
          <catalog-item v-for="item in items" :key="item.id" :item="item" />
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'home',

  components: {
    CatalogItem: () => import(`@/components/CatalogItem`),
  },

  data: () => ({
    items: [
      {
        id: 1,
        title: 'Item 1',
        price: 100
      },
      {
        id: 2,
        title: 'Item 2',
        price: 18323.42323
      },
      {
        id: 3,
        title: 'Item 3',
        price: 100
      },
      {
        id: 4,
        title: 'Item 4',
        price: 100
      },
      {
        id: 5,
        title: 'Item 5',
        price: 100
      },
    ]
  }),
}
</script>
