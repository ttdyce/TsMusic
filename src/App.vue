<template>
	<v-app>
		<v-navigation-drawer permanent app>
			<v-list-item>
				<v-list-item-content>
					<v-list-item-title class="title">
						TSMusic
					</v-list-item-title>
					<v-list-item-subtitle>
						unblocked, a better client
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
		</v-navigation-drawer>

		<!-- Sizes your content based upon application components -->
		<v-main>
			<!-- Provides the application the proper gutter -->
			<v-container fluid>
				<!-- route outlet -->
				<!-- component matched by the route will render here -->
				<router-view
					style="position:fixed; top:0;left:256px;right:0;bottom:180px;overflow-y: auto;"
				></router-view>
			</v-container>
		</v-main>

		<Player></Player>
	</v-app>
</template>

<script>
import Player from './components/Player'
export default {
	inject: ['netease'],
	components: {
		Player,
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
	},
	data: () => ({
		navigationItems: [
			{ title: 'Home', icon: 'mdi-home', route: '/' },
			{ title: 'Favorite', icon: 'mdi-heart', route: '/favorite' },
			{ title: 'Recent', icon: 'mdi-history', route: '/recent' },
		],
		playlists: [],
	}),
	created() {
		console.log('App.vue: netease.getUserPlaylist()')
		this.netease
			.getUserPlaylist()
			.then((lists) => {
				console.log('App.vue: netease.getUserPlaylist() entered')
				console.log(lists)
				this.playlists = lists[0].concat(lists[1])
			})
			.catch(function(reason) {
				console.log(reason)
			})
	},
}
</script>
