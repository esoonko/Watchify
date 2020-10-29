<template>
  <v-app style="background-color: rgb(240, 240, 240)">
    <v-toolbar dark color="blue-grey darken-1">
      <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat color="white" @click = "redirect('vote')" >Vote</v-btn>
          <v-btn flat color="white" @click = "redirect('login')" >Sign Out</v-btn>
        </v-toolbar-items>
    </v-toolbar>
    <v-container class="my-5">
      <v-card>
        <v-layout row wrap>
          <v-flex md6>
            <div class="caption grey--text">Användare</div>
            <div>{{firstName}} {{surName}}</div>
          </v-flex>
          <v-flex md2>
            <div class="caption grey--text">Givna röster</div>
            <div>{{votesGiven}}</div>
          </v-flex>
          <v-flex md2>
            <div class="caption grey--text">Snittbetyg</div>
            <div>{{averageGrade}}</div>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </v-card>
      <v-card>
        <v-layout row wrap>
          <v-flex md6>
            <div class="caption grey--text">Team</div>
            <div>{{teamName}}</div>
          </v-flex>
          <v-flex md2>
            <div class="caption grey--text">Givna röster</div>
            <div>{{teamVote}}</div>
          </v-flex>
        </v-layout>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
import RequestService from '@/services/RequestService'
export default {
  data () {
    return {
      user: this.$cookies.get('user'),
      firstName: '',
      surName: '',
      votesReceived: '',
      votesGiven: '',
      teamId: this.$cookies.get('team'),
      teamVote: '',
      teamName: '',
      averageGrade: '',
      PictureId: ''
    }
  },
  mounted () {
    this.getVote()
  },
  methods: {
    redirect (route) {
      if (route === 'login') {
        this.$cookies.remove('token')
      }
      this.$router.push(route)
    },
    async getVote (getVote) {
      try {
        const response = await RequestService.getVote({userId: this.user})
        this.firstName = response.data.firstName
        this.surName = response.data.surName
        this.votesGiven = response.data.votesGiven
        this.teamName = response.data.name
        this.teamVote = response.data.teamVote
        this.PictureId = response.data.picId
        this.setAverageGrade()
      } catch (error) {
        console.log(error)
      }
    },
    async setAverageGrade () {
      console.log('PICTURE ID')
      console.log(this.PictureId[0]['id'])
      const response = await RequestService.getAverageGrade({PictureId: this.PictureId[0]['id']})
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
