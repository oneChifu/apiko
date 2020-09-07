<template>
  <v-app>
    <the-header />

    <v-main>
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
    //
  }),
};
</script>

<style lang="scss">
  @import '@/scss/app.scss';
</style>
