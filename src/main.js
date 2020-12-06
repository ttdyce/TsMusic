// const customTitlebar = require('custom-electron-titlebar')
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import Home from './components/Home'
import nPlaylist from './components/nPlaylist'
import Settings from './components/Settings'
import { SongList, SongNode } from './model/SongList'
import ElectronStore from 'electron-store'
// var Mousetrap = require("mousetrap");
const { remote } = require('electron')

// new customTitlebar.Titlebar({
// 	backgroundColor: customTitlebar.Color.fromHex('#444'),
// })

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Vuex)

const electronStore = new ElectronStore()

const main = async () => {
	// Define routes
	const routes = [
		{ path: '/', component: Home },
		{ path: '/playlist/id/:id', name: 'playlist', component: nPlaylist, props: true },
		{ path: '/settings', component: Settings},
	]
	const router = new VueRouter({
		routes, // short for `routes: routes`
	})
	const netease = remote.getGlobal('netease')
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
					// data-driven control music player
					songList: new SongList([]),
					songListShuffled: new SongList([]),
					id: -1, 
				},
				history: [],
				loaded: {
					songs: [],
				},
				favorite: { 
					// for /playlist/intelligence
					id: -1, 
					lid: -1, 
				}, 
			},
			playMode: 'default',
			// data-driven control music player
			player: {
				isPaused: true, 
				// url: '' // not yet migrated
			}, 
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
			setSongListFavorite(state, payload) {
				console.log('setSongListFavorite...');
				console.log(payload);
				state.playlist.favorite.id = payload.id
				state.playlist.favorite.lid = payload.lid
			}, 
			setSongListPlaying(state, payload) {
				// clean history
				this.commit('resetHistory')
				this.commit('setSongsOriginal', payload.songs)

				state.playlist.playing.songList = new SongList(payload.songs)
				state.playlist.playing.songListShuffled = new SongList(payload.songs.shuffle())
				state.playlist.playing.id = payload.id
				
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

				this.commit('pushToHistory', state.songPlaying.detail)
			},
			lastTrack(state) {
				console.log('lastTrack entered')
				let song = state.playlist.history.shift()
				if (song.id == state.songPlaying.detail.id)
					song = state.playlist.history.shift()

				const songNode = new SongNode(song)
				const placeholderNode = new SongNode()

				if (state.playMode == 'default') {
					placeholderNode.next = state.playlist.playing.songList.curr
					placeholderNode.appendNext(songNode)
					state.playlist.playing.songList.curr = songNode
				} else if (state.playMode == 'random') {
					placeholderNode.next = state.playlist.playing.songListShuffled.curr
					placeholderNode.appendNext(songNode)
					state.playlist.playing.songListShuffled.curr = songNode
				}
			},
			pushToHistory(state, song) {
				const top = state.playlist.history.shift()
				if (top != undefined) {
					state.playlist.history.unshift(top)
					if (top.id == song.id) return
				}

				state.playlist.history.unshift(song)
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
			togglePlay(state) {
				this.commit('setPlayerIsPaused', !state.player.isPaused)
			},
			setPlayerIsPaused(state, isPaused) {
				state.player.isPaused = isPaused
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

	netease.cookie = electronStore.get('cookie')

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
				electronStore,
				netease,
			}
		},
	}).$mount('#app')
}

main()

Array.prototype.shuffle = function() {
	let arr = this.slice()

	for (let i = arr.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1))
		;[arr[i], arr[j]] = [arr[j], arr[i]]
	}

	return arr
}
