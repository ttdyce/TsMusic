# Technical README

Data is a big part in vue.js so let's start this document from that part!  

## Overview

In vue.js, we develop components to separate code for different purposes. Here are some core components. 

- nPlaylist
  - display nPlaylist
  - play a playlist
  - **play a song in the playlist**
- Player
  - display song detail
    - thumbnail
    - song name
    - singer name
  - **play a song in the playlist**
  - control song
    - play / pause
    - to next / previous track
    - control progress
  - control volume
- Playlist
  - display currently playing playlist
  - display history playlist
- App

## nPlaylist

Data

- playlist detail
  - playlist name, thumbnail, songs, etc
- **currently playing playlist** (mostly set)
- **currently playing song** (mostly set)

## Player

Data

- dual volume
- song progress
- play mode
- history playlist
- **currently playing playlist** (everything, including UI)
- **currently playing song** (everything, including detail)

## Playlist (Playing)

Data

- Linked List of songs
- List of played songs
- Song playing
