const {
  login_status,
  user_playlist,
  playlist_detail,
  song_detail,
  song_url,
  check_music,
} = require('NeteaseCloudMusicApi')
// require("@nondanee/unblockneteasemusic");

export default class netease {
  constructor(cookie) {
    this.cookie = cookie
  }

  async getUserPlaylist() {
    try {
      const status = await login_status({
        cookie: this.cookie,
      })
      console.log(status)
      console.log(
        `Name: ${status.body.profile.nickname} (${status.body.profile.userId})`
      )

      const userid = status.body.profile.userId
      const playlist = await user_playlist({
        uid: userid,
        cookie: this.cookie,
      })
      console.log(playlist)
      console.log(
        `Printing playlist: ${playlist.body.playlist[1].name} (${playlist.body.playlist[1].id})`
      )
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
    const playlistDetails = await playlist_detail({
      id: lid,
      cookie: this.cookie,
    })
    console.log('loaded a playlist')
    console.log(playlistDetails)
    console.log(
      `Printing first song id: ${playlistDetails.body.privileges[0].id}`
    )
    return playlistDetails.body
  }

  async fetchSongs(playlistDetails) {
    // Get all song id as array
    const songids = []
    playlistDetails.privileges.forEach((x) => {
      songids.push(x.id)
    })
    console.log(songids)
    // Get all song details by ids
    let songsLoaded = await song_detail({
      ids: songids.toString(),
      cookie: this.cookie,
    })
    songsLoaded = songsLoaded.body
    // Load songs from playlist
    console.log(songsLoaded)
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
