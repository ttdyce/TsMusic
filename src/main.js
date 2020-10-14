import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Home from './components/Home'
import nPlaylist from './components/nPlaylist'
import { SongList, SongNode } from './model/SongList'
// var Mousetrap = require("mousetrap");
const { remote } = require('electron')

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Vuex)

// Define routes
const routes = [
	{ path: '/', component: Home },
	{ path: '/playlist/id/:id', component: nPlaylist, props: true },
	{ path: '/playlist/:type', component: nPlaylist, props: true },
]
const router = new VueRouter({
	routes, // short for `routes: routes`
})
const netease = remote.getGlobal('netease')
const electronStore = remote.getGlobal('electronStore')
var app = App
const volumeSaved = electronStore.get('volumeSaved', [100, 100])
// console.log(volumeSaved)

const store = new Vuex.Store({
	state: {
		songPlaying: {
			detail: {},
			url: {},
		},
		volumeSaved,
		playlist: {
			original: {
				songs: [],
			},
			playing: {
				songList: new SongList([]),
				songListShuffled: new SongList([]),
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
			state.playlist.loaded.songs = new SongList(songs)
		},
		setSongListPlaying(state, songs) {
			// clean history
			this.commit('resetHistory')
			this.commit('setSongsOriginal', songs)

			state.playlist.playing.songList = new SongList(songs)
			state.playlist.playing.songListShuffled = new SongList(songs.shuffle())
			console.log('Song linked list stored: ')
			console.log(state.playlist.playing.songList)
			console.log('shuffled songs: ')
			console.log(state.playlist.playing.songListShuffled)
		},
		setSongsOriginal(state, songs) {
			state.playlist.original.songs = songs
		},
		nextTrack(state) {
			console.log('changed curr to next')
			console.log(state.playlist.playing.songListShuffled.curr)

			if (state.playMode == 'default') {
				state.playlist.playing.songList.curr =
					state.playlist.playing.songList.curr.next
				console.log('changed curr to next')
				console.log(state.playlist.playing.songList.curr)
			} else if (state.playMode == 'random') {
				state.playlist.playing.songListShuffled.curr =
					state.playlist.playing.songListShuffled.curr.next

				if (state.playlist.playing.songListShuffled.curr == null) {
					// re-shuffle
					state.playlist.playing.songListShuffled = new SongList(
						state.playlist.original.songs.shuffle()
					)
					console.log(state.playlist.original.songs)
					console.log('renewed state.playlist.playing.songListShuffled')
					console.log(state.playlist.playing.songListShuffled)
					// this.commit('nextTrack')
				}
			}
		},
		lastTrack(state) {
			console.log('lastTrack entered')
			let song = state.playlist.history.pop()
			if (song.id == state.songPlaying.detail.id)
				song = state.playlist.history.pop()

			const songNode = new SongNode(song)

			if (state.playMode == 'default') {
				songNode.appendNext(state.playlist.playing.songList.curr)
				state.playlist.playing.songList.curr = songNode
			} else if (state.playMode == 'random') {
				songNode.appendNext(state.playlist.playing.songListShuffled.curr)
				state.playlist.playing.songListShuffled.curr = songNode
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
		isPlayingPlaylistEmpty: (state) => () => {
			console.log('checking isPlayingPlaylistEmpty')
			console.log(JSON.stringify(state.playlist.playing.songList))
			console.log(JSON.stringify(new SongList([])))
			console.log(
				JSON.stringify(state.playlist.playing.songList) ==
					JSON.stringify(new SongList([]))
			)
			return (
				JSON.stringify(state.playlist.playing.songList) ==
				JSON.stringify(new SongList([]))
			)
		},
	},
})

new Vue({
	router,
	vuetify,
	store,
	render: (h) =>
		h(app, {
			ref: 'app',
		}),
	provide: function() {
		return {
			netease: netease,
		}
	},
}).$mount('#app')

Array.prototype.shuffle = function() {
	let arr = this.slice()

	for (let i = arr.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1))
		;[arr[i], arr[j]] = [arr[j], arr[i]]
	}

	return arr
}
