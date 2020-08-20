const {
  login_status,
  user_playlist,
  playlist_detail,
  song_detail,
  //   song_url,
  //   check_music,
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
    let playlistLoaded = []

    console.log(playlistDetails)
    console.log(
      `Printing first song id: ${playlistDetails.body.privileges[0].id}`
    )
    // Get all song id as array
    const songids = []
    playlistDetails.body.privileges.forEach((x) => {
      songids.push(x.id)
    })
    console.log(songids)
    // Get all song details by ids
    playlistLoaded = await song_detail({
      ids: songids.toString(),
      cookie: this.cookie,
    })
    playlistLoaded = playlistLoaded.body
    console.log(playlistLoaded)

    // Load songs from playlist
    return playlistLoaded.songs
  }
}
