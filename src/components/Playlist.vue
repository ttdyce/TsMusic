<template>
  <div>
    <v-container class="grey lighten-5">
      <v-row>
        <v-col cols="3" xs="4">
          <v-sheet :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`">
            <v-card>
              <v-skeleton-loader
                max-height="20vh"
                type="image"
              ></v-skeleton-loader>
            </v-card>
          </v-sheet>
        </v-col>
        <v-col sm="6">
          <v-row no-gutters>
            <v-col> Playlist name </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col> Playlistid {{ id }} </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>

    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <!-- <th class="text-left">Calories</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="song in songs" :key="song.id" :v-bind="song">
            <td @dblclick="playSong(song)">{{ song.name }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>

  </div>
</template>

<script>
export default {
  props: ['id'],
  data() {
    return {
      isLoading: false,
      isError: null,
      songs: null,
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchData',
  },
  methods: {
    fetchData() {
      // start fetching
      this.loading = true
      this.error = this.songs = null
      const fetchedId = this.id

      this.netease.fetchPlaylist(fetchedId).then((songs) => {
        // fetched! 
        this.loading = false
        this.error = false
        this.songs = songs
        console.log(this.songs)
      })
    },
    playSong(song) {
      // start fetching
      console.log('set store.song');
      console.log(song.id);
      this.$store.commit('setSongDetails', song)
      
      this.netease.fetchSong(song.id).then((songFetched) => {
        // fetched! 
        // this.loading = false
        // this.error = false
        // this.songs = songs
        console.log(`song url: ${songFetched.body.data[0].url}`)
        this.$store.commit('setSongPlaying', songFetched.body.data[0])
        console.log(this.$store.state.songPlaying);
      })
    },
  },
  inject: ['theme', 'netease'],
}
</script>
