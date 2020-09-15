<template>
  <v-container class="main">
    <v-form ref="form" @submit.prevent>
      <v-row>
        <v-col cols="6" offset="3" class="d-flex justify-center">
          <v-card 
            ref="form" 
            width="100%"
            max-width="420"
            elevation="10"
            class="mt-4 pa-3"
          >
            <v-card-title class="d-flex justify-center">
              <h3 class="mt-1 mb-3">Edit Profile</h3>
            </v-card-title>

            <v-card-text>
              <!-- <v-text-field
                label="Email"
                type="email"
                outlined
                required
                v-model.trim="user.email"
              ></v-text-field> -->

              <v-text-field
                label="Full Name"
                type="text"
                required
                v-model.trim="user.displayName"
              ></v-text-field>

              <!-- <v-text-field
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                label="New Password"
                placeholder="******"
                outlined
                class="flex-wrap"
                @click:append="showPassword = !showPassword"
                v-model.trim="newPassword"
              >
              </v-text-field> -->

              <v-btn 
                class="mt-2"
                color="primary" 
                block
                x-large
                :loading="loading"
                :disabled="loading"
                @click="editUser()"
              >Update Profile</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: 'user',

  props: {
  },

  data: () => ({
    loading: false,
  }),

  computed: {
    ...mapGetters({
      user: "users/data"
    }),
  },

  methods: {
    async editUser() {
      this.loading = true

      this.$store.dispatch('users/editUser', {
        displayName: this.user.displayName,
      }).then(() => {
        this.loading = false
      })
    }
  }
}
</script>
