<template>
  <v-app style="background-color: rgb(240, 240, 240)">
    <v-toolbar dark color="blue-grey darken-1">
                  <div>
                <p>{{ mapCoordinates.lat }} Latitude, {{ this.mapCoordinates.lng }} Longitude</p>
            </div>
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
      :position="this.mapCoordinates"
      :clickable="false"
      :draggable="true"
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
      marker: null,
      zoom: 7
    }
  },

  mounted () {
    // At this point, the child GmapMap has been mounted, but
    // its map has not been initialized.
    // Therefore we need to write mapRef.$mapPromise.then(() => ...)
    // eslint-disable-next-line
    this.$refs.mapRef.$mapPromise.then(map => this.map = map)
    // eslint-disable-next-line
    this.$refs.markerRef.$mapPromise.then(marker => this.marker = marker)
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
        lat: parseFloat(this.map.getCenter().lat()),
        lng: parseFloat(this.map.getCenter().lng())
      }
    }
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

TODO: Remove all google markers
TODO: Make it possible to add your own marker (see google marker)
TOOD: Find out how you can generate a route from markers
