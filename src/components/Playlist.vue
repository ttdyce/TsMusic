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
          <v-row no-gutters v-if="isLoaded">
            <v-col>
              {{ playlistDetails.playlist.name }}
              ({{ playlistDetails.playlist.trackCount }})
            </v-col>
          </v-row>
          <v-row no-gutters v-if="isLoaded">
            <v-col> Created by {{ playlistDetails.playlist.creator.nickname }} </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col> <v-btn @click="isLoading=true; setPlaylist(songs); playSong()">Play all</v-btn> </v-col>
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
            <td @dblclick="isLoading=true; setPlaylistIfEmpty(songs); setTrackByid(song); playSong()">{{ song.name }}</td>
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
      playlistDetails: {},
    }
  },
  created() {
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    $route: 'fetchData',
  },
  computed:{
    isLoaded(){
      return JSON.stringify(this.playlistDetails) !== JSON.stringify({});
    }
  }, 
  methods: {
    fetchData() {
      // start fetching
      this.isLoading = true
      this.error = this.songs = null
      const fetchedId = this.id

      this.netease
        .fetchPlaylist(fetchedId)
        .then((playlistDetails) => {
          console.log('playlistDetails')
          console.log(playlistDetails)
          this.playlistDetails = playlistDetails
          return this.netease.fetchSongs(playlistDetails)
        })
        .then((songs) => {
          // fetched!
          this.isLoading = false
          this.error = false
          this.songs = songs
          console.log('songs')
          console.log(songs)

          this.$store.commit('setSongsLoaded', songs)
        })
    },
    playSong() {
      const song = this.$store.state.playlist.playing.songs.curr.song

      console.log('currTrack from getters: ')
      console.log(song)
      console.log(song.id)
      this.$store.commit('setSongDetail', song)

      // start fetching
      this.netease.fetchSong(song.id).then((songFetched) => {
        // fetched!
        console.log(`song url: ${songFetched.body.data[0].url}`)
        this.$store.commit('setSongPlayingUrl', {songUrl: songFetched.body.data[0]})
        console.log(this.$store.state.songPlaying)
      })
    },
    setPlaylist(incomingSongs) {
      this.$store.commit('setSongsPlaying', incomingSongs)
    }, 
    setPlaylistIfEmpty(incomingSongs) {
      if(this.$store.getters.isPlayingPlaylistEmpty)
        this.$store.commit('setSongsPlaying', incomingSongs)
    }, 
    setTrackByid(song) {
      console.log('this.$store.state.playlist.playing.songs.setExistingCurr(song)')
      console.log(this.$store.state.playlist.playing.songs.setExistingCurr(song))
      console.log(song)
      console.log(song.id)
      this.$store.commit('setSongDetail', song)

      // start fetching
      // this.netease.fetchSong(song.id).then((songFetched) => {
      //   // fetched!
      //   console.log(`song url: ${songFetched.body.data[0].url}`)
      //   this.$store.commit('setSongPlayingUrl', {song: songFetched.body.data[0]})
      //   console.log(this.$store.state.songPlaying)
      // })
    },
  },
  inject: ['theme', 'netease'],
}
</script>
