<template>
  <v-app style="background-color: rgb(240, 240, 240)">
    <v-toolbar dark color="blue-grey darken-1">
      <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat @click = "redirect('Watchify')" color="white">Watchify</v-btn>
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
    <GmapMarker
    :key="index"
    v-for="(m, index) in markers"
    :position="m.position"
    :clickable="true"
    :draggable="true"
    @click="center=m.position"
    />
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
      markerCoordinates: {
        latitude: 0,
        longitude: 0
      },
      zoom: 16
    }
  },
  mounted () {
    // At this point, the child GmapMap has been mounted, but
    // its map has not been initialized.
    // Therefore we need to write mapRef.$mapPromise.then(() => ...)
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
        lat: this.map.getCenter().lat().toFixed(4),
        lng: this.map.getCenter().lng().toFixed(4)
      }
    }
  },

  methods: {
    redirect (route) {
      this.$router.push(route)
    },

    getDirection: function () {
      var directionsService = new VueGoogleMaps.gmapApi.maps.DirectionsService()
      var directionsDisplay = new VueGoogleMaps.gmapApi.maps.DirectionsRenderer()
      var origin = new VueGoogleMaps.gmapApi.maps.LatLng(59.346500, 18.067513)
      var waypoints = [new VueGoogleMaps.gmapApi.maps.LatLng(59.345876, 18.069305), new VueGoogleMaps.gmapApi.maps.LatLng(59.344350, 18.066676), new VueGoogleMaps.gmapApi.maps.LatLng(59.345690, 18.062728)]
      directionsDisplay.setMap(this.$refs.map.$mapObject)

      // google maps API's direction service
      function calculateAndDisplayRoute (directionsService, directionsDisplay, origin, destination, waypoints) {
        directionsService.route({
          origin: origin,
          destination: destination,
          travelMode: 'walking',
          waypoints: waypoints,
          provideRouteAlternatives: true
        }, function (response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response)
          } else {
            window.alert('Directions request failed due to ' + status)
          }
        })
      }
      calculateAndDisplayRoute(directionsService, directionsDisplay, origin, origin, waypoints)
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
