class SongList {
  constructor(songsList) {
    let curr
    let next
    for (let index = 0; index < songsList.length - 1; index++) {
      const song = songsList[index]
      const nextSong = songsList[index + 1]
      if (index == 0) {
        curr = new SongNode(song)
        next = new SongNode(nextSong)
      } else {
        curr = next
        next = new SongNode(nextSong)
      }

      curr.next = next

      if (index == 0) {
        this.curr = curr
        this.head = this.curr
      }
    }
  }

  setExistingCurr(song) {
    let cursor = this.head
    do {
      if (cursor.song.id == song.id) {
        this.curr = cursor
        return true
      }

      cursor = cursor.next
    } while (cursor.hasNext())

    return false
  }

  replaceCurr(newNode) {
    newNode.next = this.curr
    this.curr = newNode
  }

  toArray(){
    const array = []
    var cursor = this.curr

    while(cursor != null){
      array.push(cursor.song)
      cursor = cursor.next
    }

    return array
  }
}

class SongNode {
  constructor(song) {
    this.song = song
    this.next = null
  }

  hasNext() {
    return this.next != null
  }

  appendNext(newNext){
    newNext.next = this.next
    this.next = newNext
  }
}

export { SongList, SongNode }
