# ts-music

This an vuetify-electron application for music playing.  
It retrieve playlists from Netease Music and play songs with the player implemented in electron.  

## Core

- Fetch playlist from [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)
  - enable unblocking with forked one [ttdyce/NeteaseCloudMusicApi](https://github.com/ttdyce/NeteaseCloudMusicApi)
- Play songs with HTML audio
  - dual volume control
  - random play mode by Fisher–Yates shuffle
- others (in-development)
  - Searching
  - A new home page
  
Learn more at the [Technical README](TechnicalREADME.md)

## Development

To run the project:  
`yarn electron:serve`

To build the project:  
`vue-cli-service electron:build`
