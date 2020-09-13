import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Home from './components/Home'
import Playlist from './components/Playlist'
import { Songs, SongsNode } from './model/Songs'
// import {Songs} from './model/Songs'
// var Mousetrap = require("mousetrap");
const { remote, ipcRenderer } = require('electron')

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Vuex)

// Define routes
const routes = [
  { path: '/home', component: Home },
  { path: '/playlist/:id', component: Playlist, props: true },
]
const router = new VueRouter({
  routes, // short for `routes: routes`
})
const netease = remote.getGlobal('netease')
const electronStore = remote.getGlobal('electronStore')
var app = App
const volumeSaved = electronStore.get('volumeSaved', [100, 100])
console.log(volumeSaved)

const store = new Vuex.Store({
  state: {
    songPlaying: {
      detail: {},
      url: {},
    },
    // songDetails: {},
    volumeSaved,
    playlist: {
      original: {
        songs: [],
      },
      playing: {
        songs: new Songs([]),
        songsShuffled: new Songs([]),
      },
      history: [],
      loaded: {
        songs: [],
      },
    },
    playMode: 'default',
  },
  mutations: {
    setSongPlayingUrl(state, payload) {
      console.log('payload')
      console.log(payload)

      state.songPlaying.url = payload.songUrl
    },
    setSongDetail(state, songDetail) {
      state.songPlaying.detail = songDetail
    },
    saveVolumes(state, newVolume) {
      electronStore.set('volumeSaved', newVolume)
      console.log(electronStore.get('volumeSaved', [100, 100]))
      state.volumeSaved = newVolume
    },
    setSongsLoaded(state, songs) {
      state.playlist.loaded.songs = new Songs(songs)
    },
    setSongsPlaying(state, songs) {
      // clean history
      this.commit('resetHistory')
      this.commit('addSongsOriginal', songs)

      state.playlist.playing.songs = new Songs(songs)
      state.playlist.playing.songsShuffled = new Songs(songs.shuffle())
      console.log('Song linked list stored: ')
      console.log(state.playlist.playing.songs)
      console.log('shuffled songs: ')
      console.log(state.playlist.playing.songsShuffled)
    },
    addSongsOriginal(state, songs) {
      state.playlist.original.songs.push(songs)
    },
    nextTrack(state) {
      console.log('changed curr to next')
      console.log(state.playlist.playing.songsShuffled.curr)

      if (state.playMode == 'default') {
        state.playlist.playing.songs.curr =
          state.playlist.playing.songs.curr.next
        console.log('changed curr to next')
        console.log(state.playlist.playing.songs.curr)
      } else if (state.playMode == 'random') {
        state.playlist.playing.songsShuffled.curr =
          state.playlist.playing.songsShuffled.curr.next
      }
    },
    lastTrack(state) {
      console.log('lastTrack entered')
      let song = state.playlist.history.pop()
      if (song.id == state.songPlaying.detail.id)
        song = state.playlist.history.pop()

      const songNode = new SongsNode(song)

      if (state.playMode == 'default') {
        songNode.appendNext(state.playlist.playing.songs.curr)
        state.playlist.playing.songs.curr = songNode
      } else if (state.playMode == 'random') {
        songNode.appendNext(state.playlist.playing.songsShuffled.curr)
        state.playlist.playing.songsShuffled.curr = songNode
      }
    },
    pushToHistory(state, song) {
      const top = state.playlist.history.pop()
      if (top != undefined) {
        state.playlist.history.push(top)
        if (top.id == song.id) return
      }
      
      state.playlist.history.push(song)
      console.log('pushed to history: ')
      console.log(state.playlist.history)
    },
    resetHistory(state) {
      console.log('resetHistory')
      state.playlist.history = []
    },
    setPlayMode(state, newPlayMode) {
      state.playMode = newPlayMode
    },
  },
  getters: {
    isPlayingPlaylistEmpty: (state) => {
      return JSON.stringify(state.playlist.playing) == JSON.stringify({})
    },
  },
})

ipcRenderer.on('playlistsLoaded', (event, lists) => {
  // const vm =
  new Vue({
    router,
    vuetify,
    store,
    render: (h) =>
      h(app, {
        props: {
          playlists: lists,
        },
        ref: 'app',
      }),
    provide: function() {
      return {
        netease: netease,
      }
    },
  }).$mount('#app')

  // vm.$refs.app.playlists = lists
})

Array.prototype.shuffle = function() {
  let arr = this

  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  return arr
}
