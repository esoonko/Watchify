<template>
  <v-app style="background-color: rgb(240, 240, 240)">
    <v-toolbar dark color="blue-grey darken-1">
    <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat @click = "redirect('Watchify')" color="white">Watchify</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md3>
            <v-card class="elevation-14">
              <v-toolbar dark color="blue-grey darken-1">
                <v-toolbar-title>Login</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field v-model="email" name="email" label="Email" type="text"></v-text-field>
                  <v-text-field v-model="password" name="password" label="Password" id="password" type="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer>
                <div class="err" v-html="error" />
                </v-spacer>
                <v-btn class="white--text" @click = "validateUser" color="blue-grey darken-1">Log in</v-btn>
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
      email: '',
      password: '',
      error: null
    }
  },
  methods: {
    // TODO: ASYNC?
    async validateUser () {
      try {
        const response = await RequestService.validate({
          email: this.email,
          password: this.password
        })
        console.log(response.data)
        this.$cookies.set('token', response.data.token)
        this.$cookies.set('user', response.data.user.id)
        this.$cookies.set('team', response.data.user.TeamId)
        this.redirect('vote')
      } catch (error) {
        this.error = error.response.data.error
      }
    },
    redirect (route) {
      this.$router.push(route)
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
