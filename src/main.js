import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Home from './components/Home'
import Playlist from './components/Playlist'
import Songs from './model/Songs'
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
    songPlaying: {},
    songDetails: {},
    volumeSaved: volumeSaved,
    playlist: {
      original: {},
      playing: {},
      loaded: {},
      playMode: 'default',
    },
  },
  mutations: {
    setSongPlaying(state, song) {
      state.songPlaying = song
    },
    setSongDetails(state, songDetails) {
      state.songDetails = songDetails
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
      // state.playlist.playing.songs = songs
      state.playlist.playing.songs = new Songs(songs)
      console.log('Song linked list stored: ')
      console.log(state.playlist.playing.songs)
    },
    setSongsOriginal(state, songs) {
      state.playlist.original.songs = songs
    },
    nextTrack(state) {
      state.playlist.playing.songs.curr = state.playlist.playing.songs.curr.next
      console.log('changed curr to next');
      console.log(state.playlist.playing.songs.curr);
    },
  },
  getters: {
    currTrack: (state) => {
      return state.playlist.playing.songs.curr
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
