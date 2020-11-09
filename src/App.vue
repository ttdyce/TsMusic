<template>
	<v-app>
		<v-dialog v-model="dialog" persistent max-width="600px">
			<v-card>
				<v-card-title>
					<span class="headline">Login</span>
				</v-card-title>
				<v-card-text>
					<v-container>
						<v-row>
							<v-col cols="12" sm="6" md="4">
								<v-text-field
									v-model="cookie"
									label="Session cookie"
									placeholder="MUSIC_U=10101010..."
									required
									:autofocus="dialog"
								></v-text-field>
							</v-col>
						</v-row>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="dialog = false">
						Close
					</v-btn>
					<v-btn color="blue darken-1" text @click="setCookie(cookie)">
						Save
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<Custom-v-system-bar></Custom-v-system-bar>

		<v-navigation-drawer permanent app>
			<v-list-item>
				<v-list-item-content>
					<v-list-item-title class="title">
						TSMusic
					</v-list-item-title>
					<v-list-item-subtitle>
						unblocked, for a better client
					</v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>

			<v-list dense nav>
				<v-list-item
					v-for="item in navigationItems"
					:key="item.title"
					link
					@click="goRoute(item.route)"
				>
					<v-list-item-icon>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>{{ item.title }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>

			<v-list-item>
				<v-list-item-content>
					<v-list-item-subtitle>
						Playlist
					</v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>

			<v-list dense nav>
				<v-list-item
					v-for="playlist in playlists"
					:key="playlist.lid"
					link
					@click="goPlaylist(playlist.lid)"
				>
					<v-list-item-icon>
						<v-icon>mdi-playlist-music</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>{{ playlist.lName }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>

			<template v-slot:append>
				<v-container fluid>
					<v-row justify="center">
						<v-col cols="2">
							Login
						</v-col>
						<v-col cols="2">
							Login
						</v-col>
						<v-col cols="2">
							Login
						</v-col>
					</v-row>
				</v-container>
			</template>
		</v-navigation-drawer>

		<!-- Sizes your content based upon application components -->
		<v-main>
			<!-- Provides the application the proper gutter -->
			<v-container fluid>
				<!-- route outlet -->
				<!-- component matched by the route will render here -->
				<router-view
					style="position:fixed; top:28px;left:256px;right:0;bottom:180px;overflow-y: auto;"
					:playlistsFromApp="playlists"
				></router-view>
			</v-container>
		</v-main>

		<Player></Player>
	</v-app>
</template>

<script>
import Player from './components/Player'
import CustomVSystemBar from './components/CustomVSystemBar'

export default {
	inject: ['netease', 'electronStore'],
	components: {
		Player,
		CustomVSystemBar,
	},
	methods: {
		goBack() {
			window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
		},
		goPlaylist(id) {
			if (id != this.$route.params.id) this.$router.push(`/playlist/id/${id}`)
		},
		goRoute(route) {
			if (route != this.$route.path) this.$router.push(route)
		},
		setCookie(cookie) {
			cookie = `MUSIC_U=${cookie.replace(/"|MUSIC_U=/g, '')}`

			console.log(cookie)
			this.electronStore.set('cookie', cookie)
			this.netease.cookie = cookie

			this.fetchPlaylist()
		},
		fetchPlaylist() {
			this.netease
				.isLoginOk()
				.then((ok) => {
					console.log('ok? ' + ok)
					if (!ok) {
						this.dialog = true
					}
					this.dialog = false

					this.netease
						.getUserPlaylist()
						.then(async (lists) => {
							console.log(lists)
							this.playlists = lists[0].concat(lists[1])

							const playlistBody = await this.netease.fetchPlaylist(
								this.playlists[0].lid
							)
							this.$store.commit('setSongListFavorite', {
								lid: this.playlists[0].lid,
								id: playlistBody.playlist.tracks[0].id,
							})
						})
						.catch(function(reason) {
							console.log(reason)
						})
				})
				.catch(function(reason) {
					console.log(reason)
				})
		},
	},
	data: () => ({
		navigationItems: [
			{ title: 'Home', icon: 'mdi-home', route: '/' },
			{
				title: 'Heart-Beat Mode',
				icon: 'mdi-heart',
				route: '/playlist/intelligence',
			},
			{ title: 'Recent', icon: 'mdi-history', route: '/playlist/recent' },
		],
		playlists: [],
		cookie: '',
		dialog: true,
	}),
	created() {
		console.log('App: this.netease')
		console.log(this.netease)
		console.log('App.vue: await !this.netease.isLoginOk')
		// console.log(await !this.netease.isLoginOk)

		this.fetchPlaylist()
	},
}
</script>
