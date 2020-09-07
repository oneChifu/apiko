<template>
  <v-container class="main">
    <ValidationObserver tag="form" ref="observer" v-slot="{ validate, reset }">
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
              <h3 class="mt-1 mb-3">Register</h3>
            </v-card-title>

            <v-card-text>
              <v-text-field
                label="Email"
                type="email"
                placeholder="Example@gmail.com"
                outlined
                v-model.trim="registerForm.email"
              ></v-text-field>

              <v-text-field
                label="Full Name"
                type="text"
                placeholder="Tony Stark"
                outlined
                v-model.trim="registerForm.displayName"
              ></v-text-field>

              <ValidationProvider name="password" v-slot="{ errors }" rules="required|max:22|min:6">
                <v-text-field
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  label="Password"
                  placeholder="******"
                  outlined
                  class="flex-wrap"
                  v-model.trim="registerForm.password"
                  :error-messages="errors"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </ValidationProvider>

              <ValidationProvider name="confirm" v-slot="{ errors }" rules="required|max:22|min:6|password:@password">
                <v-text-field
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  label="Password Confirmation"
                  placeholder="******"
                  outlined
                  class="flex-wrap"
                  v-model.trim="registerForm.password2"
                  :error-messages="errors"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </ValidationProvider>

              <v-btn 
                class="mt-5"
                color="teal" 
                block
                dark
                x-large
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
import { required, email, max, min, password } from 'vee-validate/dist/rules'
import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'

extend('required', {
  ...required,
  message: '{_field_} can not be empty',
})

extend('max', {
  ...max,
  message: '{_field_} may not be greater than {length} characters',
})

extend('min', {
  ...min,
  message: '{_field_} may not be less than {length} characters',
})

extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
  message: 'Password confirmation does not match'
});

extend('email', {
  ...email,
  message: 'Email must be valid',
})

export default {
  name: 'auth-register',

  props: {
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

  components: {
    ValidationObserver,
    ValidationProvider,
  }
}
</script>
