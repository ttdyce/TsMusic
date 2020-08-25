<template>
  <div style="position:fixed; right:0;bottom:0;left:256px; height: 180px">
    <v-progress-linear
      rounded
      indeterminate
      v-if="isLoading"
    ></v-progress-linear>
    <v-container fluid>
      <v-row>
        <!-- Lefty, thumbnail -->
        <v-col cols="2">
          <v-row no-gutters>
            <v-col cols="12">
              <v-sheet
                :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"
              >
                <v-card>
                  <v-skeleton-loader
                    max-height="12vh"
                    type="image"
                  ></v-skeleton-loader>
                </v-card>
              </v-sheet>
            </v-col>
          </v-row>
        </v-col>
        <!-- Middle, 3 parts vertically: play/pause, progress, song details -->
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
              @ended="playNextTrack()"
              :src="songPlaying.url"
              autoplay
            ></audio>
            <!-- play/pause thing -->
            <v-col cols="12" class="text-center">
              <v-btn icon large @click="playLastTrack()">
                <v-icon>mdi-skip-previous</v-icon>
              </v-btn>
              <v-btn icon large @click="playPause()">
                <v-icon v-if="!isPlaying">mdi-play</v-icon>
                <v-icon v-else>mdi-pause</v-icon>
              </v-btn>
              <v-btn icon large @click="playNextTrack()">
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
                @mouseup="mousedown = false; updateAudioTime()"
              >
                <template v-slot:thumb-label="{ value }">
                  {{ toMinuteString((value / 100) * maxTime) }}
                </template>
              </v-slider>
            </v-col>
            <!-- song details -->
            <v-col cols="8" v-if="isSongDetailsLoaded">
              <span class="font-weight-light"
                >{{
                  songDetails.ar[0].name != 'undefined'
                    ? songDetails.ar[0].name
                    : ''
                }}
                |
              </span>
              {{ songDetails.name }}
            </v-col>
          </v-row>
        </v-col>
        <!-- Rightly, volumns and playlist-selector -->
        <v-col cols="3">
          <v-row no-gutters>
            <v-col cols="12">
              <v-slider v-model="volumn1" min="0" max="100" label="volumn1">
              </v-slider>
            </v-col>
            <v-col cols="12" class="text-right">
              <v-btn icon large>
                <v-icon>mdi-shuffle</v-icon>
              </v-btn>
              <v-btn icon large>
                <v-icon>mdi-playlist-music</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-slider v-model="volumn2" min="0" max="100" label="volumn2">
              </v-slider>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  inject: ['theme'],
  data() {
    return {
      nameLoaded: false,
      progress: 0,
      currentTime: 0,
      maxTime: 180, // todo for debug
      isPlaying: false,
      isLoading: true, // todo for debug
      mousedown: false,
      volumeChild: 100,
      volumeMaster: 100,
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
    songDetails: function() {
      return this.$store.state.songDetails
    },
    isSongDetailsLoaded: function() {
      return JSON.stringify(this.songDetails) != '{}'
    },
    maxTimeInString: function() {
      return JSON.stringify(this.songPlaying) != '{}'
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
      this.progress = 0
    },
    oncanplay() {
      // view.showSongDetails();
      // view.showLoadingSong(false);
      this.isLoading = false

      // convert & set maxTime
      const duration = this.$refs.audio.duration
      const mins = parseInt(duration / 60),
        seconds = parseInt(duration % 60)
      this.maxTime = `${mins
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
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
      const timeToSet = (this.progress / 100) * this.audio.duration
      this.audio.currentTime = timeToSet
    },
    playPause() {
      const isPaused = this.audio.paused
      if (isPaused) {
        this.audio.play()
      } else {
        this.audio.pause()
      }
    },
  },
}
</script>
