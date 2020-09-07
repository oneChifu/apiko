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
              <h3 class="mt-1 mb-3">Login</h3>
            </v-card-title>

            <v-card-text>
              <v-text-field
                label="Email"
                type="email"
                placeholder="Example@gmail.com"
                outlined
                v-model.trim="loginForm.email"
              ></v-text-field>

              <v-text-field
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPassword ? 'text' : 'password'"
                label="Password"
                placeholder="******"
                outlined
                class="flex-wrap"
                hide-details
                @click:append="showPassword = !showPassword"
                v-model.trim="loginForm.password"
              >
                <template v-slot:append-outer>
                  <div>
                    <router-link :to="{name: 'home'}">Don’t remember password?</router-link>
                  </div>
                </template>
              </v-text-field>

              <v-btn 
                class="mt-5"
                color="teal" 
                block
                dark
                x-large
                @click="login()"
              >Continue</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
    
    <v-row>
      <v-col cols="6" offset="3" class="d-flex justify-center">
        <v-card 
          ref="form" 
          width="100%" 
          max-width="420"
          elevation="10"
          class="pa-3"
        >
          <v-card-text class="text-center">
            I have no account, <router-link :to="{name: 'register'}">REGISTER NOW</router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'auth-login',

  props: {
  },

  data: () => ({
    showPassword: false,

    loginForm: {
      email: '',
      password: ''
    }
  }),

  methods: {
    login() {
      this.$store.dispatch('user/login', {
        email: this.loginForm.email,
        password: this.loginForm.password
      })
    }
  }
}
</script>
