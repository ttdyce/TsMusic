export default class Songs {
  constructor(songsList) {
    let curr
    let next
    for (let index = 0; index < songsList.length - 1; index++) {
      const song = songsList[index]
      const nextSong = songsList[index + 1]
      if (index == 0) {
        curr = new SongsNode(song)
        next = new SongsNode(nextSong)
      } else {
        curr = next
        next = new SongsNode(nextSong)
      }
      
      curr.next = next

      if (index == 0) {
        this.head = curr
        this.curr = this.head
      }
    }
  }
}

class SongsNode {
  constructor(song) {
    this.song = song
    this.next = null
  }
}
