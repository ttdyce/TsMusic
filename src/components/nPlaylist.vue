<template>
	<div>
		<v-container class="grey lighten-5">
			<v-row>
				<!-- playlist thumbnail -->
				<v-col cols="3" xs="4">
					<Thumbnail :src="thumbnailSrc" />
				</v-col>
				<v-col sm="6">
					<v-row no-gutters v-if="isLoaded">
						<v-col>
							{{ playlistDetails.playlist.name }}
							({{ playlistDetails.playlist.trackCount }})
						</v-col>
					</v-row>
					<v-row no-gutters v-if="isLoaded">
						<v-col>
							Created by {{ playlistDetails.playlist.creator.nickname }}
						</v-col>
					</v-row>
					<v-row no-gutters>
						<v-col>
							<v-btn
								@click="
									isLoading = true
									$store.commit('setPlayerIsPaused', true)
									$store.commit('setSongListPlaying', {
										songs,
										id,
									})
								"
								>Play all</v-btn
							>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
		</v-container>
		<template>
			<v-data-table
				:headers="headers"
				:items="items"
				item-key="name"
				class="elevation-1"
				:search="search"
				:items-per-page="50"
			>
				<template v-slot:top>
					<v-text-field
						v-model="search"
						label="Search anything"
						class="mx-4"
					></v-text-field>
				</template>
				<template v-slot:item="{ item }">
					<tr
						@dblclick="
							isLoading = true
							setPlaylistIfEmpty(songs)
							setTrackByid(item.originalData)
						"
					>
						<td>
							{{ item.name }}<br />
							<a> {{ item.singers }} </a>
						</td>
						<td>{{ item.album }}</td>
					</tr>
				</template>
			</v-data-table>
		</template>
	</div>
</template>

<script>
import Thumbnail from './Thumbnail'
export default {
	components: {
		Thumbnail,
	},
	props: ['id'],
	data() {
		return {
			search: '',
			isLoading: false,
			isError: null,
			songs: null,
			playlistDetails: {
				playlist: {
					name: '',
					trackCount: -1,
					creator: {
						nickname: '',
					},
				},
			},
			thumbnailSrc: '',
		}
	},
	async created() {
		this.fetchData()
	},
	watch: {
		// call again the method if the route changes
		$route: 'fetchData',
	},
	computed: {
		headers() {
			return [
				{ text: 'Name', value: 'name' },
				{ text: 'Album', value: 'album' },
			]
		},
		items() {
			if (this.songs == null) return []
			const arr = []
			const toArNames = (ar) => {
				let arNames = ''
				ar.forEach((element, index) => {
					arNames += index == 0 ? element.name : ' / ' + element.name
				})
				return arNames
			}

			this.songs.forEach((x) =>
				arr.push({
					name: x.name,
					singers: toArNames(x.ar),
					album: x.al.name,
					originalData: x,
				})
			)
			return arr
		},
		isLoaded() {
			for (var i in this.playlistDetails) return true // playlistDetails is not empty
			return false
		},
		type() {
			if (this.id >= 0) return undefined

			var playlistTypes = {}
			playlistTypes[-1] = 'intelligence'
			playlistTypes[-2] = 'recommend'
			playlistTypes[-3] = 'recent'
			playlistTypes[-4] = 'playing'

			return playlistTypes[this.id] // undefined if not found
		},
	},
	methods: {
		async fetchData() {
			console.log('start fetching data...')
			// start fetching
			if (this.id >= 0) {
				// fetch by id
				this.isLoading = true
				this.error = this.songs = null
				const fetchedId = this.id

				const playlistDetails = await this.netease.fetchPlaylist(fetchedId)
				console.log('playlistDetails')
				console.log(playlistDetails)
				this.playlistDetails = playlistDetails
				this.thumbnailSrc = playlistDetails.playlist.coverImgUrl

				console.log('start songs' + Date())
				const songs = await this.netease.fetchSongs(playlistDetails)
				console.log('songs' + Date())
				// console.log(songs)
				// fetched!
				this.songs = songs
				// console.log('songs')
				// console.log(songs)
			} else if (this.type != undefined) {
				// fetch by type
				console.log('do fetch by type')
				if (this.type == 'recommend') {
					this.songs = await this.netease.getRecommendSongs()

					this.playlistDetails.playlist.name = 'Daily feed'
					this.playlistDetails.playlist.creator.nickname = 'You! '
					this.playlistDetails.playlist.trackCount = this.songs.length
					this.thumbnailSrc = await this.netease.getThumbnail(this.songs[0].id)
				} else if (this.type == 'intelligence') {
					// 心動模式
					console.log([
						this.$store.state.playlist.favorite.lid,
						this.$store.state.playlist.favorite.id,
					])
					if (this.$store.state.songPlaying.detail.id == undefined) {
						this.songs = await this.netease.getIntelligenceList(
							this.$store.state.playlist.favorite.lid,
							this.$store.state.playlist.favorite.id
						)
					} else {
						this.songs = await this.netease.getIntelligenceList(
							this.$store.state.songPlaying.detail.id,
							this.$store.state.playlist.playing.id
						)
					}
					console.log(this.songs)
					this.playlistDetails.playlist.name = 'Heart beating...'
					this.playlistDetails.playlist.creator.nickname = 'You! '
					this.playlistDetails.playlist.trackCount = this.songs.length
					this.thumbnailSrc = await this.netease.getThumbnail(this.songs[0].id)
				} else if (this.type == 'recent') {
					console.log(this.$store.state.playlist.history)
					this.songs = this.$store.state.playlist.history

					this.playlistDetails.playlist.name = 'Recent'
					this.playlistDetails.playlist.creator.nickname =
						'You from the past... '
					this.playlistDetails.playlist.trackCount = this.songs.length
					if (this.songs[0] != undefined)
						this.thumbnailSrc = await this.netease.getThumbnail(
							this.songs[0].id
						)
				} else if (this.type == 'playing') {
					console.log(this.$store.state.playlist.playing.songList)
					this.songs = this.$store.state.playlist.playing.songList.toArray()

					this.playlistDetails.playlist.name = 'Playing'
					this.playlistDetails.playlist.creator.nickname = 'You'
					this.playlistDetails.playlist.trackCount = this.songs.length
					if (this.songs[0] != undefined)
						this.thumbnailSrc = await this.netease.getThumbnail(
							this.songs[0].id
						)
				}

				console.log(this.songs)
			}
			this.isLoading = false
			this.error = false

			this.$store.commit('setSongsLoaded', this.songs)
			console.log('end fetching' + Date())
		},
		setPlaylistIfEmpty(incomingSongs) {
			if (this.$store.getters.isPlayingPlaylistEmpty)
				this.$store.commit('setSongListPlaying', {
					songs: incomingSongs,
					id: this.id,
				})
		},
		setTrackByid(song) {
			console.log(
				'this.$store.state.playlist.playing.songList.setExistingCurr(song)'
			)
			console.log(
				this.$store.state.playlist.playing.songList.setExistingCurr(song)
			)
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
