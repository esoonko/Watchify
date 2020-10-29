<!-- TODO: Fixa storlek på bilden -->
<template>
  <v-app style="background-color: rgb(240, 240, 240)">
    <v-toolbar dark color="blue-grey darken-1">
      <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat color="white" @click = "redirect('statistic')">Statistics</v-btn>
          <v-btn flat color="white" @click = "redirect('login')" >Sign Out</v-btn>
        </v-toolbar-items>
    </v-toolbar>
    <v-alert
      class="ma-0 pa-3"
      v-model="alert"
      dismissible
      icon=" "
      type="success"
    >Someone voted on your photo!</v-alert>
      <v-alert
      class="ma-0 pa-3"
      v-model="error"
      dismissible
      icon=" "
      type="info"
    >Thanks for voting, there is no more picture to vote on!</v-alert>
    <v-container grid-list-md>
      <v-layout align-content-center justify-center>
        <v-flex xs10 align-self-center align-content-center>
          <v-card>
            <v-img
              max-height= 600
              :src="picture"
            ></v-img>
          </v-card>
        </v-flex>
      </v-layout>
        <v-flex xs12 align-center justify-center>
          Bildens snittbetyg {{this.averageGrade}}
        </v-flex>
      <v-layout justify-center>
        <v-flex xs2>
          <v-btn color="red darken-1" @click = "vote(1)">Väldigt oengagerad</v-btn>
        </v-flex>
        <v-flex xs2>
          <v-btn color="red lighten-3" @click = "vote(2)">Oengagerad</v-btn>
        </v-flex>
        <v-flex xs2>
          <v-btn color="yellow" @click = "vote(3)">Neutral</v-btn>
        </v-flex>
        <v-flex xs2>
          <v-btn color="green lighten-3" @click = "vote(4)">Engagerad</v-btn>
        </v-flex>
        <v-flex xs2>
           <v-btn color="green darken-1" @click = "vote(5)">Väldigt engagerad</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import RequestService from '@/services/RequestService'

export default {
  data () {
    return {
      user: this.$cookies.get('user'),
      picture: '',
      team: this.$cookies.get('team'),
      pictureId: '',
      error: '',
      socket: null,
      alert: false,
      pictureBelongsTo: '',
      averageGrade: 0
    }
  },
  mounted () {
    this.getPicture()
  },
  sockets: {
    newVote: function (data) {
      if (parseInt(this.user) === data.userId) {
        this.alert = true
      }
      if (this.pictureId === data.pictureId) {
        this.setAverageGrade()
      }
    }
  },
  methods: {
    redirect (route) {
      if (route === 'login') {
        this.$cookies.remove('token')
        this.$cookies.remove('team')
        this.$cookies.remove('user')
      }
      this.$router.push(route)
    },

    async getPicture () {
      try {
        const response = await RequestService.getPicture({userId: this.user})
        this.picture = response.data.file
        this.pictureId = response.data.id
        this.pictureBelongsTo = response.data.UserId
      } catch (error) {
        // No picture to vote on
        this.error = true
        this.picture = ''
        this.pictureId = ''
        this.averageGrade = 0
        return
      }
      this.setAverageGrade()
    },

    async vote (vote) {
      try {
        const response = await RequestService.vote({
          UserId: this.user,
          Vote: vote,
          PictureId: this.pictureId
        })
        console.log(response) // User information

        // Send alert to the socket who ows the picture
        this.$socket.emit('vote', {userId: this.pictureBelongsTo, pictureId: this.pictureId})

        // Load new picture
        this.getPicture()
      } catch (error) {
        this.error = error.response.data.error
      }
    },

    async setAverageGrade () {
      const response = await RequestService.getAverageGrade({
        PictureId: this.pictureId
      })
      // Calculate average
      let arraySum = 0
      response.data.forEach(element => {
        arraySum = arraySum + element.vote
      })
      if (response.data.length > 0) {
        this.averageGrade = arraySum / (response.data.length)
      } else {
        this.averageGrade = 0
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
