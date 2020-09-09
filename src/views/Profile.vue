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
            class="mt-10 pa-3"
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
                outlined
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
                class="mt-5"
                color="teal" 
                block
                dark
                x-large
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
    // showPassword: false,
    // newPassword: '',
  }),

  computed: {
    ...mapGetters({
      user: "user/data"
    }),
  },

  methods: {
    async editUser() {
      await this.$store.dispatch('users/editUser', {
        // email: this.user.email,
        displayName: this.user.displayName,
        // password: this.newPassword
      })
    }
  }
}
</script>
