# tsmusic

This an vuetify-electron application for music playing.  
It retrieve playlists from Netease Music and play songs with the player implemented in electron.  

## Core concept

- nPlaylist / External playlist (from Netease Music API)
  - playlist detail
  - song detail
  - song url
- Track System
  - currently-playing playlist
    - prev: a computed value from history
    - curr: SongNode
    - next: SongNode
  - play history
  - dual volume control
  - play mode
- Home
  - recently played playlists

Learn more at the [Technical README](TechnicalREADME.md)

