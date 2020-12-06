# Ts-Music

A streaming music player, hopefully for multi-platform. 

> Enjoy the moment...

(some screenshots)

(download badges? picture wanted)

**Sponsors**

/ 

## Features

Supported platform

- [x] Netease Music
- [ ] YouTube (Planned)

- User
  - Loading stored playlist
  - Loading platform-recommended playlist

- Platform
  - Searching
  - Unblock region limitation (Netease music)

- Player
  - Playing tracks
  - Dual volume control
  - Shortcuts

Learn more about the technical part [here (Technical README)](TechnicalREADME.md)

---

## Roadmap

| Status         | Title                        | Rollout version               |
| :------------- | ---------------------------- | ----------------------------- |
| Complete       | Session Login                | 0.0.0 Listen                  |
| Complete       | Loading user playlist        | 0.0.0                         |
| Complete       | Loading home, recent         | 0.0.0                         |
| Complete       | Update README: Roadmap       | 0.0.0                         |
| In-progress    | Animation design             | 0.1.0 Okay Design             |
| Planned Jan 21 | Design playlist's song table | 0.1.0                         |
| Planned        | Rethink design               | **0.2.0 UX (Public preview)** |
| Planned        | Improve Navigation           | 0.2.0                         |
| Planned        | Auto-update                  | 0.2.0                         |
| Planned Mar 21 | Spacebar play/pause          | 0.2.0                         |
| Planned        | Music Player shortcuts       | 0.3.0 Shortcuts               |
| Planned        | Settings shortcuts           | 0.3.0                         |

## Development

### Getting Started

**It is recommended to develop in [VSCode](https://code.visualstudio.com/)** 

<img src="screenshots\README\image-20201203232535804.png" alt="image-20201203232535804" style="zoom:80%;" />

Or the command-line-way...🙄

- To run the project:  
  `yarn electron:serve`

- To build the project:  
  `vue-cli-service electron:build`

---

## Versioning

- [SemVer](http://semver.org/)

For the versions available, see the [tags on this repository](https://github.com/ttdyce/TsMusic/tags)

## Authors

- **ttdyce** - *Initial work and maintenance* - [github](https://github.com/ttdyce)

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/ttdyce/TsMusic/blob/master/LICENSE.md) file for details

## Acknowledgment

Contributors

/ 

Dependencies

- [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) by [Binaryify](https://github.com/Binaryify)
- [electron-store](https://github.com/sindresorhus/electron-store) by [sindresorhus](https://github.com/sindresorhus/)
- [mousetrap](https://github.com/ccampbell/mousetrap) by [ccampbell](https://github.com/ccampbell) 
- [custom-electron-titlebar](https://github.com/AlexTorresSk/custom-electron-titlebar) by [AlexTorresSk](https://github.com/AlexTorresSk) (I wrote a simple one so... kind of... depended on it? right?)