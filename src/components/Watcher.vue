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
      // THINGS TO MODIFY: addRoute will take in all the routes, either as seperate variables or as a list. Origin point will NOT BE the first of the jobs as it will give away job position. As such origin point WILL ALWAYS be randomly generated.
      let gmapApi = VueGoogleMaps.gmapApi()
      let directionsService = new gmapApi.maps.DirectionsService()
      let directionsDisplay = new gmapApi.maps.DirectionsRenderer({ map: this.map }) // Set map directly on creation instead of using the following: directionsDisplay.setMap(this.map)

      // REPLACE HERE WITH COORDINATES FROM CLIENTS: START HERE
      let waypointsCoords = [[59.346500, 18.067513], [59.345876, 18.069305], [59.344350, 18.066676], [59.345690, 18.062728]]
      let waypoints = []
      for (let i in waypointsCoords) {
        waypoints.push({
          location: new gmapApi.maps.LatLng(waypointsCoords[i][0], waypointsCoords[i][1]),
          stopover: false
        })
      }
      // REPLACE END HERE
      // Create origin as random from the job coordinates
      let origin = this.generatePointRandom(waypoints[0].location)

      // New waypoints with additional stops
      let newWaypoints = []
      for (let i = 0; i < waypoints.length - 1; i++) {
        newWaypoints.push(waypoints[i])
        newWaypoints.push(this.generatePointBetweenTwo(waypoints[i].location, waypoints[i + 1].location, false))
      }
      newWaypoints.push(waypoints[waypoints.length - 1])
      console.log('Checking new waypoints')
      console.log(newWaypoints)
      this.calculateAndDisplayRoute(gmapApi, directionsService, directionsDisplay, origin, newWaypoints, origin)
    },

    // Generate random point between two given coordinate with max distance set. Returns object with loc and stopover
    generatePointBetweenTwo (coord1, coord2, marker) {
      let gmapApi = VueGoogleMaps.gmapApi()
      // Max distance from point. Set to 400
      let maxDist = 400
      // Calculating perpendicular line to coord 1 and coord 2 to generate new coord
      let perpAngle = Math.atan2(parseFloat(coord1.lng()) - parseFloat(coord2.lng()), parseFloat(coord1.lat()) - parseFloat(coord2.lat()))
      // Midpoints
      let midLat = (parseFloat(coord1.lat()) + parseFloat(coord2.lat())) / 2
      let midLng = (parseFloat(coord1.lng()) + parseFloat(coord2.lng())) / 2
      // Deciding the random distance taken from midpoint
      let randDist = (Math.random() * Math.floor(maxDist - 100) + 100) * 0.00001 * (Math.random() < 0.5 ? -1 : 1)
      // Calculating Lat and Lng to be added
      let addLat = randDist * Math.cos(perpAngle)
      let addLng = randDist * Math.sin(perpAngle)
      return {
        location: new gmapApi.maps.LatLng(midLat + addLat, midLng + addLng),
        stopover: marker
      }
    },

    // Generate a single point randomly within a given radius from given coordinate. Return LatLng
    generatePointRandom (coord) {
      let gmapApi = VueGoogleMaps.gmapApi()
      // Max distance from point. Set to 400
      let maxDist = 400
      // Select random distance
      let randDist = (Math.random() * Math.floor(maxDist - 100) + 100) * 0.00001 * (Math.random() < 0.5 ? -1 : 1)
      // Select random angle
      let randAngle = (Math.random() * Math.floor(Math.PI * 2))
      let addLat = randDist * Math.cos(randAngle)
      let addLng = randDist * Math.sin(randAngle)
      return new gmapApi.maps.LatLng(parseFloat(coord.lat()) + addLat, parseFloat(coord.lng()) + addLng)
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
