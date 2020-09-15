<template>
  <v-app>
    <the-header />

    <v-main class="pt-0">
      <router-view></router-view>
    </v-main>

    <the-footer />
  </v-app>
</template>

<script>
export default {
  name: 'App',

  components: {
    TheHeader: () => import(`@/components/TheHeader`),
    TheFooter: () => import(`@/components/TheFooter`),
  },

  data: () => ({
    // searchItemsData: {}
  }),

  methods: {
    // updateItems(data) {
    //   this.searchItemsData = data;
    // }
  }
};
</script>

<style lang="scss">
  @import '@/scss/app.scss';
</style>
