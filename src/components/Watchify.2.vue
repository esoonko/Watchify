<template>
  <v-app style="background-color: rgb(240, 240, 240)">
  <v-toolbar dark color="blue-grey darken-1">
      <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat @click = "redirect('Watchify1')" color="white">Client 1</v-btn>
          <v-btn flat @click = "redirect('Watchify3')" color="white">Client 3</v-btn>
          <v-btn flat @click = "redirect('Watcher')" color="white">Watcher</v-btn>
        </v-toolbar-items>
    </v-toolbar>
     <v-alert
      class="ma-0 pa-3"
      v-model="alert"
      dismissible
      type="success"
      GmapMap
    >You have submitted a task!</v-alert>
  <GmapMap
    :options="{
      zoomControl: true,
      mapTypeControl: false,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      disableDefaultUi: false,
    }"
    :zoom="zoom"
    :center="this.mapCoordinates"
    map-type-id="terrain"
    style="width: 100%; height: 100%; margin-right: auto; margin-left: auto; margin-top: auto; margin-bottom: auto;"
    ref="mapRef"
      >
    <GmapMarker
      :position="this.markerCoordinates"
      :clickable="true"
      :draggable="false"
      :icon="{url: require('.././assets/watcher_logo2.png'), scaledSize: {width: 35, height: 45}}"
      @click = "handleMarkerClicked"
      ref = "markerRef"
    ></GmapMarker>
  </GmapMap>
</v-app>
</template>

<script>
// eslint-disable-next-line
export default {
  data () {
    return {
      map: null,
      markerFixed: false,
      wayPoint: null,
      zoom: 16,
      alert: false
    }
  },

  mounted () {
    // eslint-disable-next-line
    this.$refs.mapRef.$mapPromise.then(map => this.map = map)
  },
  computed: {
    mapCoordinates () {
      if (!this.map) {
        return {
          lat: 59.3499507,
          lng: 18.0679875
        }
      }
      return {
        lat: this.map.getCenter().lat().toFixed(6),
        lng: this.map.getCenter().lng().toFixed(6)
      }
    },
    markerCoordinates () {
      if (!this.markerFixed) {
        if (!this.map) {
          return {
            lat: 59.3499507,
            lng: 18.0679875
          }
        }
      }
      if (!this.markerFixed) {
        // eslint-disable-next-line
        this.alert = false
        return {
          lat: parseFloat(this.map.getCenter().lat()),
          lng: parseFloat(this.map.getCenter().lng())
        }
      } else {
        // eslint-disable-next-line
        this.alert = true
        return {
          lat: this.wayPoint.lat,
          lng: this.wayPoint.lng
        }
      }
    }
  },
  methods: {
    redirect (route) {
      if (this.markerFixed) {
        this.$cookies.set('wayPoint2', this.wayPoint)
      }
      this.$router.push(route)
    },
    handleMarkerClicked () {
      console.log(this.markerCoordinates)
      if (this.markerFixed) {
        this.markerFixed = false
      } else {
        this.markerFixed = true
        this.wayPoint = {lat: parseFloat(this.map.getCenter().lat()),
          lng: parseFloat(this.map.getCenter().lng())}
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
