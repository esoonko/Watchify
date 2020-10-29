<!-- TODO: Fixa storlek på bilden -->
<template>
  <v-app style="background-color: rgb(240, 240, 240)">
    <v-toolbar dark color="blue-grey darken-1">
      <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat color="white" @click = "redirect('login')" >Sign Out</v-btn>
        </v-toolbar-items>
    </v-toolbar>
    <v-container grid-list-md>
      <v-layout align-content-center justify-center>
        <v-flex xs10 align-self-center align-content-center>
          <v-card>
            <v-img
            ></v-img>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
// eslint-disable-next-line
import RequestService from '@/services/RequestService'

export default {
  data () {
    return {}
  },
  mounted () {
  },
  sockets: {
  },
  methods: {
    redirect (route) {
      this.$router.push(route)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
