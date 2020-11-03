<template>
  <v-app style="background-color: rgb(240, 240, 240)">
    <v-toolbar dark color="blue-grey darken-1">
      <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn flat @click = "redirect('Watchify1')" color="white">Client 1</v-btn>
          <v-btn flat @click = "redirect('Watchify2')" color="white">Client 2</v-btn>
          <v-btn flat @click = "redirect('Watchify3')" color="white">Client 3</v-btn>
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
import * as VueGoogleMaps from 'vue2-google-maps'

export default {
  data () {
    return {
      map: null,
      zoom: 16,
      wayPoint1: this.$cookies.get('wayPoint1'),
      wayPoint2: this.$cookies.get('wayPoint2'),
      wayPoint3: this.$cookies.get('wayPoint3')
    }
  },
  methods: {
    redirect (route) {
      if (route === 'Watchify1') {
        this.$cookies.remove('wayPoint1')
      }
      if (route === 'Watchify2') {
        this.$cookies.remove('wayPoint2')
      }
      if (route === 'Watchify3') {
        this.$cookies.remove('wayPoint3')
      }
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
      let waypointsCoords = [this.wayPoint1, this.wayPoint2, this.wayPoint3]
      let waypoints = []

      for (let i in waypointsCoords) {
        waypoints.push({
          location: new gmapApi.maps.LatLng(waypointsCoords[i]),
          stopover: false
        })
      }

      // Check to see if there is any job available
      if (waypoints.length < 1) {
        alert('There is no job currently')
      } else {
        // Have atleast three waypoints
        waypoints = this.generateMinWaypoints(waypoints)
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
      }
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
    },

    // Generate waypoints depending on number of jobs so that there is at least three waypoints. Recursive
    generateMinWaypoints (waypoints) {
      if (waypoints.length < 2) {
        waypoints.push({
          location: this.generatePointRandom(waypoints[0].location),
          stopover: false
        })
        waypoints = this.generateMinWaypoints(waypoints)
        return waypoints
      } else if (waypoints.length < 3) {
        waypoints.push(this.generatePointBetweenTwo(waypoints[0].location, waypoints[1].location, false))
        return waypoints
      } else {
        return waypoints
      }
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
