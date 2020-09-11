<template>
  <v-container class="main">
    <ValidationObserver tag="form" class="form_login" ref="observer" v-slot="{ invalid }">
      <v-row>
        <v-col cols="12" sm="8" offset-sm="2" md="6" offset-md="3" class="d-flex justify-center">
          <v-card 
            ref="form" 
            width="100%" 
            max-width="420"
            elevation="10"
            class="mt-10 pa-3"
          >
            <v-card-title class="d-flex justify-center">
              <h3>Login</h3>
            </v-card-title>

            <v-card-text>
              <ValidationProvider name="Email" v-slot="{ errors }" rules="required|email">
                <v-text-field
                  label="Email"
                  type="email"
                  placeholder="Example@gmail.com"
                  autocomplete="on"
                  :error-messages="errors"
                  v-model.trim="loginForm.email"
                ></v-text-field>
              </ValidationProvider>

              <ValidationProvider name="Password" v-slot="{ errors }" rules="required|max:22|min:6">
                <v-text-field
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  label="Password"
                  placeholder="******"
                  autocomplete="on"
                  class="flex-wrap"
                  v-model.trim="loginForm.password"
                  :error-messages="errors"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </ValidationProvider>

              <div class="form_login__forgot">
                <router-link :to="{name: 'home'}" exact>Don’t remember password?</router-link>
              </div>

              <v-btn 
                class="mt-3"
                color="teal" 
                block
                :dark="!invalid"
                x-large
                @click="login()"
                :disabled="invalid"
              >Continue</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </ValidationObserver>
    
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
import { ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'

export default {
  name: 'auth-login',

  components: {
    ValidationObserver,
    ValidationProvider,
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
      this.$store.dispatch('users/login', {
        email: this.loginForm.email,
        password: this.loginForm.password
      })
    }
  }
}
</script>
