<template>
  <v-container class="main">
    <ValidationObserver tag="form" class="form_register" ref="observer" v-slot="{ invalid }">
      <v-row>
        <v-col cols="6" offset="3" class="d-flex justify-center">
          <v-card 
            ref="form" 
            width="100%" 
            max-width="420"
            elevation="10"
            class="mt-6 pa-3"
          >
            <v-card-title class="d-flex justify-center">
              <h3>Register</h3>
            </v-card-title>

            <v-card-text>
              <ValidationProvider name="Email" v-slot="{ errors }" rules="required|email">
                <v-text-field
                  label="Email"
                  type="email"
                  placeholder="Example@gmail.com"
                  autocomplete="on"
                  :error-messages="errors"
                  v-model.trim="registerForm.email"
                ></v-text-field>
              </ValidationProvider>

              <ValidationProvider name="Full Name" v-slot="{ errors }" rules="required|max:34|min:2">
                <v-text-field
                  label="Full Name"
                  type="text"
                  placeholder="Tony Stark"
                  :error-messages="errors"
                  v-model.trim="registerForm.displayName"
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
                  v-model.trim="registerForm.password"
                  :error-messages="errors"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </ValidationProvider>

              <ValidationProvider name="Password Confirmation" v-slot="{ errors }" rules="required|max:22|min:6|password:@Password">
                <v-text-field
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  label="Password Confirmation"
                  placeholder="******"
                  autocomplete="on"
                  class="flex-wrap"
                  v-model.trim="registerForm.password2"
                  :error-messages="errors"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </ValidationProvider>

              <v-btn 
                class="mt-2"
                color="teal" 
                block
                :dark="!invalid"
                x-large
                @click="register()"
                :disabled="invalid"
              >Register</v-btn>
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
            I already have an account, <router-link :to="{name: 'login'}">LOG IN</router-link>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'

export default {
  name: 'auth-register',

  components: {
    ValidationObserver,
    ValidationProvider,
  },

  data: () => ({
    showPassword: false,

    registerForm: {
      email: '',
      displayName: '',
      password: '',
      password2: ''
    }
  }),

  methods: {
    register() {
      this.$store.dispatch('users/register', {
        email: this.registerForm.email,
        displayName: this.registerForm.displayName,
        password: this.registerForm.password
      })
    }
  }
}
</script>
