import store from "@/store";
import { extend } from 'vee-validate'
import { 
  regex, 
  required, 
  email, 
  min, 
  max, 
  alpha, 
  integer,
  numeric,
  max_value, 
  min_value
} from 'vee-validate/dist/rules'

extend('regex', {
  ...regex,
  message: 'Value may only contain alphabetic characters',
})

extend('alpha', {
  ...alpha,
  message: '{_field_} may only contain alphabetic characters',
})

extend('integer', {
  ...integer,
  message: '{_field_} may only contain number characters',
})

extend('numeric', {
  ...numeric,
  message: '{_field_} may only contain number characters',
})

extend('price', {
  validate(value, { target, field }) {
    return !isNaN(Math.floor(value).toString())
  },
  message: '{_field_} may only contain number characters',
})

extend('max_value', {
  ...max_value,
  params: ['max'],
  message: 'Value must be {max} or less',
})

extend('min_value', {
  ...min_value,
  params: ['min'],
  message: 'Value must be {min} or more',
})

extend('required', {
  ...required,
  message: '{_field_} can not be empty',
})

extend('min', {
  ...min,
  message: '{_field_} may not be less than {length} characters',
})

extend('max', {
  ...max,
  message: '{_field_} may not be greater than {length} characters',
})

extend('email', {
  ...email,
  message: '{_field_} must be valid',
})

extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
  message: 'Password confirmation does not match'
});
