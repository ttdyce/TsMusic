<template>
  <div style="position:fixed; right:0;bottom:0;left:256px; height: 180px">
    <!-- Snackbar definition -->
    <v-snackbar v-model="snackbarSkip">
      {{ snackbarTextSkip }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbarSkip = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <!-- component interface -->
    <v-progress-linear
      rounded
      indeterminate
      v-if="isLoading"
    ></v-progress-linear>
    <v-container fluid>
      <v-row>
        <!-- Lefty, thumbnail -->
        <v-col cols="2" class="px-0">
          <Thumbnail :src="thumbnailSrc"/>
        </v-col>
        <!-- Middle, 3 parts vertically: play/pause, progress, song detail -->
        <v-col cols="7">
          <v-row no-gutters>
            <!-- audio player -->
            <audio
              ref="audio"
              type="audio/mpeg"
              @timeupdate="ontimeupdate()"
              @loadstart="onloadstart()"
              @canplay="oncanplay()"
              @play="onplay()"
              @pause="onpause()"
              @ended="$store.commit('nextTrack')"
              :src="songPlaying.url.url"
              autoplay
            ></audio>
            <!-- play/pause thing -->
            <v-col cols="12" class="text-center">
              <v-btn icon large @click="$store.commit('lastTrack')">
                <v-icon>mdi-skip-previous</v-icon>
              </v-btn>
              <v-btn icon large @click="$store.commit('togglePlay')">
                <v-icon v-if="!isPlaying">mdi-play</v-icon>
                <v-icon v-else>mdi-pause</v-icon>
              </v-btn>
              <v-btn icon large @click="$store.commit('nextTrack')">
                <v-icon>mdi-skip-next</v-icon>
              </v-btn>
            </v-col>
            <!-- progress -->
            <v-col cols="12">
              <v-slider
                ref="progressBar"
                v-model="progress"
                min="0"
                max="100"
                :thumb-size="36"
                @mousedown="mousedown = true"
                @mouseup="
                  mousedown = false
                  updateAudioTime()
                "
              >
                <template v-slot:thumb-label="{ value }">
                  {{ toMinuteString((value / 100) * maxTime) }}
                </template>
              </v-slider>
            </v-col>
            <!-- song detail -->
            <v-col cols="8" v-if="isSongDetailLoaded">
              <span class="font-weight-light"
                >{{
                  songDetail.ar[0].name != 'undefined'
                    ? songDetail.ar[0].name
                    : ''
                }}
                |
              </span>
              {{ songDetail.name }}
            </v-col>
          </v-row>
        </v-col>
        <!-- Rightly, volumes and playlist-selector -->
        <v-col cols="3">
          <v-row no-gutters>
            <v-col cols="12">
              <v-slider
                v-model="volume1"
                min="0"
                max="100"
                label="volume1"
                @mouseup="saveVolumes()"
                @input="updateVolumes"
              >
              </v-slider>
            </v-col>
            <v-col cols="12" class="text-right">
              <v-btn icon large :class="colorShuffle" @click="toggleShuffle">
                <v-icon>mdi-shuffle</v-icon>
              </v-btn>
              <!-- todo playing playlist will be optimized in UX enhancement -->
              <v-btn icon large @click="$router.push('/playlist/id/-4')">
                <v-icon>mdi-playlist-music</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-slider
                v-model="volume2"
                min="0"
                max="100"
                label="volume2"
                @mouseup="saveVolumes()"
                @input="updateVolumes"
              >
              </v-slider>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Thumbnail from './Thumbnail'
export default {
  inject: ['theme', 'netease'],
  components: {
    Thumbnail
  }, 
  data() {
    return {
      nameLoaded: false,
      progress: 0,
      currentTime: 0,
      maxTime: 0,
      isPlaying: false,
      isLoading: false,
      mousedown: false,
      volume1: 100,
      volume2: 100,
      isShuffled: false,
      timeRetried: 0,
      maxRetry: 3,

      snackbarSkip: false,
      snackbarTextSkip: "Skipped unplayable song",

      player: this.$store.state.player, 
      playlistPlaying: this.$store.state.playlist.playing,
    }
  },
  computed: {
    audio: function() {
      return this.$refs.audio
    },
    progressBar: function() {
      return this.$refs.progressBar
    },
    songPlaying: function() {
      return this.$store.state.songPlaying
    },
    songPlayingUrl: function() {
      return this.songPlaying.url
    },
    songDetail: function() {
      return this.songPlaying.detail
    },
    isSongDetailLoaded: function() {
      return JSON.stringify(this.songDetail) != '{}'
    },
    // maxTimeInString: function() {
    //   return JSON.stringify(this.songPlaying) != '{}'
    // },
    colorShuffle() {
      let color = this.isShuffled ? 'grey' : ''
      return `color: ${color} lighten-3`
    },
    thumbnailSrc(){
      if(this.isSongDetailLoaded)
        return this.songDetail.al.picUrl
      else
        return ""
    }, 
  },
  methods: {
    toMinuteString(time) {
      const mins = parseInt(time / 60),
        seconds = parseInt(time % 60)

      return `${mins.toString().padStart(2, '0')}:
      ${seconds.toString().padStart(2, '0')}`
    },
    // audio's stuff
    setVolumes(volumeSaved) {
      this.volume1 = volumeSaved[0]
      this.volume2 = volumeSaved[1]
      this.updateVolumes()
      console.log(`v1: ${this.volume1}`)
      console.log(`v2: ${this.volume2}`)
    },
    updateVolumes() {
      // value: 0 ~ 100
      const volumeToSet = (this.volume1 * this.volume2) / 100 / 100

      this.audio.volume = volumeToSet
    },
    saveVolumes() {
      this.$store.commit('saveVolumes', [this.volume1, this.volume2])
    },

    ontimeupdate() {
      if (this.mousedown) return false

      // update control-bar and control-currentTime
      const audioElement = this.audio
      const currentTime = audioElement.currentTime,
        maxTime = audioElement.duration,
        currentPercent = (currentTime / maxTime) * 100

      this.progress = currentPercent

      const mins = parseInt(currentTime / 60),
        seconds = parseInt(currentTime % 60)

      this.currentTime = `${mins
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    },

    onloadstart() {
      this.isLoading = true
      this.progress = 0
    },
    oncanplay() {
      this.isLoading = false

      // convert & set maxTime
      const duration = this.audio.duration
      this.maxTime = duration
    },
    onplay() {
      this.isPlaying = true
      // $audio.animate({ volume: getVolume() }, 1000);
    },
    onpause() {
      this.isPlaying = false
      // $audio.animate({ volume: 0 }, 1000);
    },
    updateAudioTime() {
      // value: 0.0 ~ 100.0
      this.isLoading = true

      const timeToSet = (this.progress / 100) * this.audio.duration
      this.audio.currentTime = timeToSet
    },
    playNextTrack() {
      this.$store.commit('nextTrack')

      // this.playSong(false)
    },
    playSong() {
      let songToPlay
      if (this.isShuffled)
        songToPlay = this.playlistPlaying.songListShuffled.curr.song
      else songToPlay = this.playlistPlaying.songList.curr.song
      console.log('playSong curr track: ')
      console.log(songToPlay)
      console.log(songToPlay.id)

      console.log('this.songPlaying.detail')
      console.log(this.songPlaying.detail)
      // console.log('fromHistory')
      // console.log(fromHistory)
      console.log('this.songPlaying.detail')
      console.log(this.songPlaying.detail)
      // if (fromHistory != true)
      //   this.$store.commit('pushToHistory', this.songPlaying.detail)
      this.$store.commit('setSongDetail', songToPlay)

      // start fetching
      this.netease.fetchSong(songToPlay.id).then((songFetched) => {
        // handle errors
        if (songFetched == undefined || (songFetched != undefined && songFetched.body.data[0].url == null) ) { // fix url = null, id: 534540206
          console.log('! songFetched == undefined / url == null here ')
          // todo retry playing here
          if (this.timeRetried < this.maxRetry) {
            console.log(`retrying(${++this.timeRetried})...`)
            this.playSong()
          } else {
            this.snackbarSkip = true
            this.timeRetried = 0
            this.$store.commit('nextTrack')
          }
          return
        }

        // song is ok here
        console.log(`song url: ${songFetched.body.data[0].url}`)
        this.$store.commit('setSongPlayingUrl', {
          songUrl: songFetched.body.data[0],
        })
        console.log(this.$store.state.songPlaying)
      })
    },
    toggleShuffle() {
      this.isShuffled = !this.isShuffled
      console.log('is shuffled: ' + this.isShuffled)
      this.$store.commit('setPlayMode', this.isShuffled ? 'random' : 'default')
    },
  },
  watch:{
    'player.isPaused'(isPaused) {
      if(isPaused)
        this.audio.play()
      else 
        this.audio.pause()
    },
    // trigger play song
    'playlistPlaying.songList'(songList) {
      if(songList.length != 0)
        this.playSong()
    },
    'playlistPlaying.songList.curr'() {
      this.playSong()
    },
    'playlistPlaying.songListShuffled.curr'() {
      this.playSong()
    },
  }, 
  mounted() {
    const volume1 = this.$store.state.volumeSaved[0]
    const volume2 = this.$store.state.volumeSaved[1]
    this.setVolumes([volume1, volume2])
    
  },
}
</script>
