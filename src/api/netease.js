const {
	login_status,
	user_playlist,
	playlist_detail,
	song_detail,
	song_url,
	check_music,
	recommend_songs,
	playmode_intelligence_list,
} = require('NeteaseCloudMusicApi')
// require("@nondanee/unblockneteasemusic");

// todo console.log here not produced somehow 20201015
export default class netease {
	constructor(cookie) {
		this.cookie = cookie
	}

	async isLoginOk() {
		const status = await login_status({
			cookie: this.cookie,
		})

		console.log('is login ok: ' + status.body.code == 200)
		return status.status == 200 // todo further checking maybe needed e.g. userid/name
	}

	async getThumbnail(id) {
		let songLoaded = await song_detail({
			ids: id.toString(),
			cookie: this.cookie,
		})

		console.log(songLoaded.body.songs[0].al.picUrl)

		return songLoaded.body.songs[0].al.picUrl
	}

	async getIntelligenceList(id, pid) {
		const intelligenceList = await playmode_intelligence_list({
			cookie: this.cookie,
			id: id,
			pid: pid,
		})

		const ids = []
		intelligenceList.body.data.forEach((item) => {
			ids.push(item.id)
		})

		let songsLoaded = await song_detail({
			ids: ids.toString(),
			cookie: this.cookie,
		})

		songsLoaded = songsLoaded.body.songs

		return songsLoaded
	}

	async getRecommendSongs() {
		const songsResponse = await recommend_songs({
			cookie: this.cookie,
		})

		const songs = songsResponse.body.data.dailySongs
		console.log('getRecommendSongs')
		console.log(songs)
		return songs
	}

	async getUserPlaylist() {
		try {
			const status = await login_status({
				cookie: this.cookie,
			})
			// console.log(status)
			// console.log(
			//   `Name: ${status.body.profile.nickname} (${status.body.profile.userId})`
			// )

			const userid = status.body.profile.userId
			const playlist = await user_playlist({
				uid: userid,
				cookie: this.cookie,
			})
			// console.log(playlist)
			// console.log(
			//   `Printing playlist: ${playlist.body.playlist[1].name} (${playlist.body.playlist[1].id})`
			// )
			// const playlistid = playlist.body.playlist[1].id
			// const playlistName = playlist.body.playlist[1].name

			// Load 2 playlists
			// Generate with vue
			let myPlaylists = [],
				othersPlaylists = []
			playlist.body.playlist.forEach((l) => {
				let lid = l.id
				let lName = l.name
				let luserid = l.userId

				if (userid == luserid) myPlaylists.push({ lName: lName, lid: lid })
				else othersPlaylists.push({ lName: lName, lid: lid })
			})

			return [myPlaylists, othersPlaylists]
		} catch (error) {
			console.log(error)
		}
	}

	async fetchPlaylist(lid) {
		console.log('netease fetchPlaylist start')

		const playlistDetails = await playlist_detail({
			id: lid,
			cookie: this.cookie,
		})
		console.log('fetchPlaylist')
		// console.log('loaded a playlist')
		// console.log(playlistDetails)
		// console.log(
		//   `Printing first song id: ${playlistDetails.body.privileges[0].id}`
		// )
		return playlistDetails.body
	}

	async fetchSongs(playlistDetails) {
		console.log('start netease fetchSongs')
		// Get all song id as array
		const songids = []
		playlistDetails.privileges.forEach((x) => {
			songids.push(x.id)
		})
		// console.log(songids)
		console.log('await song_detail')
		// Get all song details by ids
		let songsLoaded = await song_detail({
			ids: songids.toString(),
			cookie: this.cookie,
		})
		console.log('got song_detail')
		songsLoaded = songsLoaded.body
		// Load songs from playlist
		// console.log(songsLoaded)
		return songsLoaded.songs
	}

	async fetchPlaylistSongs(lid) {
		const playlistDetails = await this.fetchPlaylist(lid)
		return await this.fetchSongs(playlistDetails)
	}

	// try play netease's one, else play unblockneteasemusic's one
	async fetchSong(id) {
		let url, song
		try {
			const state = await check_music({
				id: id,
			})
			//todo state.body.success may never get false here
			console.log(`Song state: ${state.body}`)
			if (!state.body.success) throw new Error('netease cannot play')

			song = await song_url({
				id: id,
			})
			console.log(song)
			url = song.body.data[0].url

			if (url == null)
				// only providing demo version
				throw new Error('null url from netease api (demo version only?)')
		} catch (error) {
			console.log('Catched an error!')
			console.log(error)
			// const song = await match(id, ['kuwo', 'qq', 'youtube'])
			// console.log(song)
			// url = song.url
		} finally {
			console.log(`song's url = ${url}`)
		}

		return song
	}
}
