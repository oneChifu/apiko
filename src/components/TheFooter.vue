<template>
  <v-footer
    absolute
  >
    <v-col
      class="text-center"
      cols="12"
    >
      Copyright © {{ new Date().getFullYear() }}. Privacy Policy.
    </v-col>
  </v-footer>
</template>

<script>
  export default {
    name: 'the-footer',

    props: {
    },

    data: () => ({
    }),

    computed: {
    },

    created() {
    }
  }
</script>
