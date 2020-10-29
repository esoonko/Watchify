<template>
  <v-app style="background-color: rgb(240, 240, 240)">
    <v-toolbar dark color="blue-grey darken-1">
    <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat @click = "redirect('login')" color="white">login</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md5>
            <v-card class="elevation-14">
              <v-toolbar dark color="blue-grey darken-1">
                <v-toolbar-title>Registration form</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field v-model="firstName" name="firstName" label="First name" type="text"></v-text-field>
                  <v-text-field v-model="surName" name="firstName" label="Surname" type="text"></v-text-field>
                  <v-text-field v-model="email" name="email" label="Email" type="text"></v-text-field>
                  <v-text-field v-model="password" name="password" label="Password" id="password" type="password"></v-text-field>
                  <v-text-field v-model="team" name="team" label="team" id="team" type="team"></v-text-field>
                  <input style ="display: none" type="file" ref="fileInput" @change="onFileChange"/>
                  <v-btn class="white--text" depressed small color="blue-grey darken-1" @click="$refs.fileInput.click()">Upload a picture</v-btn>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer>
                  <div class="err" v-html="error" />
                </v-spacer>
                <v-btn class="white--text" @click = "register" color="blue-grey darken-1">Register</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import RequestService from '@/services/RequestService'
export default {
  data () {
    return {
      firstName: '',
      surName: '',
      email: '',
      password: '',
      team: '',
      error: null,
      file: null
    }
  },
  methods: {
    async register () {
      try {
        const response = await RequestService.register({
          firstName: this.firstName,
          surName: this.surName,
          email: this.email,
          password: this.password,
          file: this.file,
          team: this.team.toLowerCase()
        })
        console.log(response.data) // User information
        this.redirect('login')
      } catch (error) {
        this.error = error.response.data.error
      }
    },

    onFileChange (event) {
      this.convertBase64(event.target.files[0]).then(data => { this.file = data })
    },

    redirect (route) {
      this.$router.push(route)
    },

    convertBase64 (file) {
      return new Promise((resolve, reject) => {
        var reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
      })
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.err{
  color:red
}

</style>
