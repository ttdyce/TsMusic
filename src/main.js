import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Home from './components/Home'
import Playlist from './components/Playlist'
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
const store = new Vuex.Store({
  state: {
    songPlaying: {},
  },
  mutations: {
    setSongPlaying(state, newSong) {
      state.songPlaying = newSong
    },
  },
})
var app = App
const netease = remote.getGlobal('netease')

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
