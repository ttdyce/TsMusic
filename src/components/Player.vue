<template>
  <v-container
    fluid
    style="position:fixed; right:0;bottom:0;left:256px; height: 180px"
  >
    <v-row :align="center">
      <!-- Lefty, Name, singer, etc -->
      <v-col cols="2">
        <v-sheet :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`">
          <v-card>
            <v-skeleton-loader
              max-height="12vh"
              type="image"
            ></v-skeleton-loader>
          </v-card>
        </v-sheet>

        <!-- <img
            id="control-thumbnail"
            alt="Song thumbnail"
            class="img-thumbnail rounded"
            :src="songPlaying.picUrl"
          /> -->
      </v-col>

      <v-col cols="4" class="text-left">
        <v-row>
          <v-col cols="12">
            <h6 class="text-truncate">
              <span id="control-name">{{ songPlaying.name }}</span>
              <span
                id="control-alia"
                class="text-muted"
                data-toggle="tooltip"
                data-placement="top"
                title="Tooltip on left"
                >{{
                  songPlaying.alia === 'undefined' ? '' : songPlaying.alia
                }}</span
              >
            </h6>
          </v-col>

          <v-col cols="12" class="">
            <h6>
              <small id="control-singer" class="text-muted">{{
                songPlaying.arName
              }}</small>
            </h6>
          </v-col>

          <v-col cols="12">
            <h6>
              <small id="control-album" class="text-muted">{{
                songPlaying.alName
              }}</small>
            </h6>
          </v-col>
        </v-row>
      </v-col>
      <!-- Rightly, Play/Pause, etc... -->
      <v-col cols="6">
        <div>
          <audio
            ref="audio"
            id="audio"
            type="audio/mpeg"
            @timeupdate="ontimeupdate()"
            @loadstart="onloadstart()"
            @canplay="oncanplay()"
            @play="onplay()"
            @pause="onpause()"
            @ended="playNextTrack()"
            autoplay
          ></audio>
        </div>
        <div class="col-12">
          <button
            type="button"
            class="btn btn-primary"
            @click="playLastTrack()"
          >
            <em class="fas fa-backward"></em>
          </button>
          <button
            id="control-play"
            type="button"
            class="btn btn-primary"
            v-on:click="toggleAudio()"
          >
            <div
              v-if="isLoading"
              id="control-spinner"
              class="spinner-border"
              role="status"
            >
              <span class="sr-only">Loading...</span>
            </div>
            <div v-else>
              <em v-if="!isPlaying" class="fas fa-play"></em>
              <em v-if="isPlaying" class="fas fa-pause"></em>
            </div>
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="playNextTrack()"
          >
            <em class="fas fa-forward"></em>
          </button>
        </div>

        <!-- Progress bar's -->
        <v-row class="my-3">
          <v-col cols="1" id="control-currentTime">
            <span>{{ currentTime }}</span>
          </v-col>
          <v-col cols="10">
            <input
              ref="bar"
              id="control-bar"
              type="range"
              class="form-control-range"
              step="0.1"
              value="0"
              @mousedown="mousedown = true"
              @mouseup="
                mousedown = false
                updateAudioTime()
              "
            />
          </v-col>
          <v-col cols="1" id="control-maxTime">{{ maxTime }}</v-col>
        </v-row>
      </v-col>
      <v-col cols="2" class="align-items-end">
        <v-row class="">
          <v-col cols="12" class="mt-3">
            <input
              ref="volumeChild"
              id="control-volumeChild"
              class="form-control-range"
              type="range"
              v-model="volumeChild"
              @mouseup="saveVolume('volumeChild')"
              @input="updateVolume"
            />
          </v-col>
          <div class="col-12 mt-3">
            <input
              ref="volumeMaster"
              id="control-volumeMaster"
              class="form-control-range"
              type="range"
              v-model="volumeMaster"
              @mouseup="saveVolume('volumeMaster')"
              @input="updateVolume"
            />
          </div>
        </v-row>
      </v-col>
      <v-col cols="1">
        <v-row class="">
          <v-col cols="12" class="mt-1">
            <button id="control-playlist" type="button" class="btn btn-primary">
              <em class="fas fa-stream"></em>
            </button>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: ['songPlaying'],
  inject: [
    'playAudio',
    'saveVolume',
    'playNextTrack',
    'playLastTrack',
    'theme',
  ],
  data() {
    return {
      currentTime: '',
      maxTime: '',
      isLoading: false,
      isPlaying: false,
      mousedown: false,
      volumeChild: 100,
      volumeMaster: 100,
    }
  },
  methods: {
    setVolumes(volumeMasterSaved, volumeChildSaved) {
      this.volumeMaster = volumeMasterSaved
      this.volumeChild = volumeChildSaved
      this.updateVolume()
    },

    updateVolume() {
      // value: 0 ~ 100
      const volumeToSet = (this.volumeMaster * this.volumeChild) / 100 / 100

      this.$refs.audio.volume = volumeToSet
    },
    toggleAudio() {
      this.playAudio(this.$refs.audio)
    },
    ontimeupdate() {
      if (this.mousedown) return false

      // update control-bar and control-currentTime
      const audioElement = this.$refs.audio,
        barElement = this.$refs.bar
      const currentTime = audioElement.currentTime,
        maxTime = audioElement.duration,
        currentPercent = (currentTime / maxTime) * 100

      if (barElement.dataset.mousedown != 'true') {
        barElement.value = currentPercent
      }

      const mins = parseInt(currentTime / 60),
        seconds = parseInt(currentTime % 60)

      this.currentTime = `${mins
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    },
    onloadstart() {
      this.$refs.bar.value = 0
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
      const value = this.$refs['bar'].value
      // value: 0.0 ~ 100.0
      const timeToSet = (value / 100) * this.$refs.audio.duration
      this.$refs.audio.currentTime = timeToSet
    },
  },
}
</script>
