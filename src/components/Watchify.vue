<template>
  <v-app style="background-color: rgb(240, 240, 240)">
    <v-toolbar dark color="blue-grey darken-1">
      <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat color="white">Watcher</v-btn>
        </v-toolbar-items>
    </v-toolbar>
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
      @click = "handleMarkerClicked"
      ref = "markerRef"
    ></GmapMarker>
  </GmapMap>
</v-app>
</template>

<script>
// eslint-disable-next-line
import RequestService from '@/services/RequestService'

export default {
  data () {
    return {
      map: null,
      markerFixed: false,
      fixedCoordinates: null,
      zoom: 16
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
        return {
          lat: parseFloat(this.map.getCenter().lat()),
          lng: parseFloat(this.map.getCenter().lng())
        }
      } else {
        return {
          lat: this.fixedCoordinates.lat,
          lng: this.fixedCoordinates.lng
        }
      }
    }
  },

  methods: {
    redirect (route) {
      this.$router.push(route)
    },
    handleMarkerClicked () {
      console.log(this.markerCoordinates)
      if (this.markerFixed) {
        this.markerFixed = false
      } else {
        this.markerFixed = true
        this.fixedCoordinates = {lat: parseFloat(this.map.getCenter().lat()),
          lng: parseFloat(this.map.getCenter().lng())}
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>

TODO: Remove all google markers
TODO: Make it possible to add your own marker (see google marker)
TOOD: Find out how you can generate a route from markers
