<template>
  <v-app style="background-color: rgb(240, 240, 240)">
    <v-toolbar dark color="blue-grey darken-1">
      <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat @click = "redirect('Watchify')" color="white">Watchify</v-btn>
          <v-btn flat @click = "addRoute()" color="white">Add route</v-btn>
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
    :center="mapCoordinates"
    map-type-id="terrain"
    style="width: 100%; height: 100%; margin-right: auto; margin-left: auto; margin-top: auto; margin-bottom: auto;"
    ref="mapRef"
      >
  </GmapMap>
</v-app>
</template>

<script>
// eslint-disable-next-line
import RequestService from '@/services/RequestService'
import * as VueGoogleMaps from 'vue2-google-maps'

export default {
  data () {
    return {
      map: null,
      zoom: 16
    }
  },
  methods: {
    redirect (route) {
      this.$router.push(route)
    },
    // google maps API's direction service
    calculateAndDisplayRoute (gmapApi, directionsService, directionsDisplay, origin, waypoints, destination) {
      directionsService.route({
        origin: origin,
        waypoints: waypoints,
        destination: destination,
        avoidHighways: true,
        travelMode: gmapApi.maps.TravelMode.WALKING
      }, function (response, status) {
        if (status === gmapApi.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response)
        } else {
          window.alert('Directions request failed due to ' + status)
        }
      })
    },
    addRoute () {
      let gmapApi = VueGoogleMaps.gmapApi()
      let directionsService = new gmapApi.maps.DirectionsService()
      let directionsDisplay = new gmapApi.maps.DirectionsRenderer({ map: this.map }) // Set map directly on creation instead of using the following: directionsDisplay.setMap(this.map)

      let origin = new gmapApi.maps.LatLng(59.346500, 18.067513)

      // let waypoints = [new gmapApi.maps.LatLng(59.345876, 18.069305), new gmapApi.maps.LatLng(59.344350, 18.066676), new gmapApi.maps.LatLng(59.345690, 18.062728)]
      let waypointsCoords = [[59.345876, 18.069305], [59.344350, 18.066676], [59.345690, 18.062728]]
      let waypoints = []
      for (let i in waypointsCoords) {
        waypoints.push({
          location: new gmapApi.maps.LatLng(waypointsCoords[i][0], waypointsCoords[i][1]),
          stopover: false
        })
      }

      this.calculateAndDisplayRoute(gmapApi, directionsService, directionsDisplay, origin, waypoints, origin)
    }
  },
  mounted () {
    // At this point, the child GmapMap has been mounted, but its map has not been initialized.
    // Therefore we need to write mapRef.$mapPromise.then(() => ...)
    // eslint-disable-next-line
    this.$refs.mapRef.$mapPromise.then(map => this.map = map)
  },
  updated () {
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
        lat: this.map.getCenter().lat().toFixed(4),
        lng: this.map.getCenter().lng().toFixed(4)
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
