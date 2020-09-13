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
                  <v-col cols="8" offset="2">
                    <ValidationProvider name="Title" v-slot="{ errors }" rules="required|min:3|max:128">
                      <v-text-field
                        type="text"
                        placeholder="For example: Iron man suit"
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
                        :error-messages="errors"
                        v-model.trim="addForm.price"
                      ></v-text-field>
                    </ValidationProvider>

                    <div class="catalog_add__files-label">
                      Photos
                    </div>

                    <div class="catalog_add__files">
                      <div v-if="addForm.imagesUrl.length" class="catalog_add__files__images">
                        <div v-for="(url, index) in addForm.imagesUrl" :key="index" class="catalog_add__files__image">
                          <v-img
                            :src="url"
                            width="92"
                            aspect-ratio="1"
                          ></v-img>

                          <v-btn
                            icon
                            @click="removeImage(index)"
                          >
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </div>
                      </div>

                      <div v-if="addForm.imagesUrl.length < 3" class="catalog_add__files__add">
                        <v-progress-circular
                          v-if="loadingImage"
                          size="100"
                          width="15"
                          rotate="360"
                          color="teal">
                        </v-progress-circular>

                        <v-file-input 
                          v-else
                          type="file" 
                          multiple 
                          hide-input
                          hide-details
                          accept="image/*"
                          icon="mdi-plus"
                          prepend-icon="mdi-plus"
                          @change="preloadImage($event)"
                        ></v-file-input>
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
    async addItem() {
      this.loading = true;

      this.$store.dispatch('items/addItem', this.addForm).then(() => {
        this.loading = false
      })

      // this.$store.dispatch('items/addImages', this.addForm.images)
      // const imageName = this.addForm.images[0].name.substr(0, this.addForm.images[0].name.lastIndexOf("."));
      
      // this.addForm.images[0].name = 

      // console.log('addForm', this.addForm.images[0].name.replace(imageName, 'dsdsddsdsd'))
      // console.log('addForm', this.addForm.images[0].name)
    },
    
    preloadImage(files) {
      // const files = e.target.files || e.dataTransfer.files

      console.log('preloadImage', files)

      if ( files.length === 0 ) {
        return
      }

      this.loadingImage = true

      Array.from(files).forEach(image => {
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
