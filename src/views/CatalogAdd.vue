<template>
  <v-container class="main catalog_add">
    <ValidationObserver tag="form" ref="observer" v-slot="{ invalid }">
      <v-row>
        <v-col cols="12">
          <v-card 
            ref="form" 
            width="100%" 
            elevation="10"
            class="mt-4 pa-3"
          >
            <v-card-title class="d-flex justify-center">
              <h3 class="mt-1 mb-3">Add product</h3>
            </v-card-title>

            <v-card-text>
              <v-container class="pa-0">
                <v-row no-gutters>
                  <v-col cols="8" offset="2" class="text-center">
                    <ValidationProvider name="Title" v-slot="{ errors }" rules="required|min:3|max:128">
                      <v-text-field
                        type="text"
                        placeholder="For example: Iron man suit"
                        outlined
                        :error-messages="errors"
                        v-model.trim="addForm.title"
                      >
                        <template slot="label">
                          Title <b class="red--text">*</b>
                        </template>
                      </v-text-field>
                    </ValidationProvider>

                    <ValidationProvider name="Location" v-slot="{ errors }" rules="required|min:3|max:128">
                      <v-text-field
                        type="text"
                        placeholder="For example: Los Angeles, CA"
                        outlined
                        :error-messages="errors"
                        v-model.trim="addForm.location"
                      >
                        <template slot="label">
                          Location <b class="red--text">*</b>
                        </template>
                      </v-text-field>
                    </ValidationProvider>

                    <ValidationProvider name="Location" v-slot="{ errors }" rules="max:500">
                      <v-textarea
                        label="Description"
                        placeholder="For example: Iron man suit"
                        outlined
                        auto-grow
                        rows="6"
                        counter="500"
                        :error-messages="errors"
                        v-model.trim="addForm.description"
                      ></v-textarea>
                    </ValidationProvider>

                    <ValidationProvider name="Price" v-slot="{ errors }" rules="price">
                      <v-text-field
                        label="Price"
                        type="text"
                        placeholder="For example: 100"
                        outlined
                        :error-messages="errors"
                        v-model.trim="addForm.price"
                      ></v-text-field>
                    </ValidationProvider>

                    <div class="catalog_add__files">
                      <div v-if="addForm.imagesUrl.length">
                        <div v-for="(url, index) in addForm.imagesUrl" :key="index">
                          <v-img
                            :src="url"
                            width="100"
                            aspect-ratio="1"
                            class="grey lighten-2"
                          ></v-img>

                          <v-btn
                            icon
                            @click="removeImage(index)"
                          >Delete</v-btn>
                        </div>
                      </div>

                      <div v-if="addForm.imagesUrl.length < 3">
                        <v-progress-circular
                          v-if="loadingImage"
                          size="100"
                          width="15"
                          rotate="360"
                          color="teal">
                        </v-progress-circular>

                        <label v-else class="file">Select Images...
                          <input 
                            type="file" 
                            multiple 
                            accept="image/*"
                            @change="preloadImage($event)"
                          >
                        </label>
                      </div>
                    </div>

                    <v-btn 
                      color="teal" 
                      width="100%"
                      max-width="370"
                      x-large
                      :dark="!invalid"
                      @click="addItem()"
                      :disabled="invalid"
                    >Submit</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </ValidationObserver>
  </v-container>
</template>

<script>
import { ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'

export default {
  name: 'catalog-add',

  components: {
    ValidationObserver,
    ValidationProvider,
  },

  data: () => ({
    loading: false,
    loadingImage: false,

    addForm: {
      title: '',
      location: '',
      description: '',
      price: null,
      imagesUrl: [],
      images: []
    }
  }),

  created() {
    console.log('NUMBER', !isNaN(Math.floor('10.1000').toString()))
  },

  methods: {
    addItem() {
      this.$store.dispatch('items/addItem', this.addForm)
      // this.$store.dispatch('items/addImages', this.addForm.images)
      // const imageName = this.addForm.images[0].name.substr(0, this.addForm.images[0].name.lastIndexOf("."));
      
      // this.addForm.images[0].name = 

      // console.log('addForm', this.addForm.images[0].name.replace(imageName, 'dsdsddsdsd'))
      // console.log('addForm', this.addForm.images[0].name)
    },
    
    preloadImage(e) {
      const fileList = e.target.files || e.dataTransfer.files

      if ( fileList.length === 0 ) {
        return
      }

      this.loadingImage = true

      Array.from(fileList).forEach(image => {
        const imageUrl = window.URL.createObjectURL(image)

        new Promise((resolve, reject) => {
          let timer
          let img = new Image()

          img.onerror = img.onabort = (e) => {
              clearTimeout(timer)
              reject(e)
          };

          img.onload = function () {
              clearTimeout(timer)
              resolve(img)
          };

          timer = setTimeout(function () {
              img.src = null
              reject("timeout")
          }, 5000)

          img.src = imageUrl
        }).then((res) => {
          this.loadingImage = false
          this.addForm.imagesUrl.push(imageUrl)
          this.addForm.images.push(image)
        })
      })
    },

    removeImage(index) {
      this.addForm.imagesUrl.splice(index, 1)
      this.addForm.images.splice(index, 1)
    },
  }
}
</script>
