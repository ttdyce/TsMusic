<template>
	<div>
		<v-container grey lighten-5>
			<v-row>
				<v-col cols="6">
					<canvas
						hidden
						ref="myCanvas"
						id="myCanvas"
						width="300"
						height="200"
						style="border:1px solid #d3d3d3;"
					></canvas>
					<ClickableThumbnail
						:src="dailyFeedThumbnailData"
						:desc="`Daily feed | ${today.getDate()}/${today.getMonth() + 1}`"
						:onClickThumbnail="() => $router.push('/playlist/recommend')"
					/>
				</v-col>
				<v-col cols="6">
					<ClickableThumbnail
						src="err"
						desc="Heart beat"
						:onClickThumbnail="() => $router.push('/playlist/intelligence')"
					/>
				</v-col>
			</v-row>
		</v-container>

		<v-container py-0>
			<v-row no-gutters>
				<v-col>
					Recommended
					<v-divider></v-divider>
				</v-col>
			</v-row>
			<v-row
				py-0
				v-for="row in [recommendedRow1, recommendedRow2]"
				:key="row.id"
			>
				<v-col cols="3" v-for="playlist in row.playlists" :key="playlist.id">
					<ClickableThumbnail
						:src="playlist.coverImgUrl"
						:desc="playlist.name"
						:onClickThumbnail="
							() => $router.push(`/playlist/id/${playlist.id}`)
						"
					/>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script>
import ClickableThumbnail from './ClickableThumbnail'
export default {
	// Vuetify
	inject: ['theme', 'netease'],
	props: {
		playlists: Array,
	},
	components: {
		ClickableThumbnail,
	},
	data: function() {
		return {
			today: new Date(),
			dailyFeedThumbnailData: '',
			recommendedRow1: { id: 1, playlists: [] },
			recommendedRow2: { id: 2, playlists: [] },
		}
	},
	mounted() {
		// draw today feed thumbnail
		const today = new Date()
		const canvas = document.getElementById('myCanvas')
		const ctx = canvas.getContext('2d')

		ctx.font = "48px 'Noto Sans SC', 'Noto Sans', sans-serif"
		ctx.fillStyle = 'black'
		ctx.textAlign = 'center'
		ctx.fillText(
			today.toLocaleString(window.navigator.language, {
				day: '2-digit',
				month: 'short',
			}),
			canvas.width / 2,
			canvas.height / 2 + 48
		)

		ctx.font = "30px 'Noto Sans SC', 'Noto Sans', sans-serif"
		ctx.fillStyle = 'red'
		ctx.fillText(
			today.toLocaleString(window.navigator.language, { weekday: 'long' }),
			canvas.width / 2,
			52
		)

		this.dailyFeedThumbnailData = canvas.toDataURL()
	},
	watch: {
		// eslint-disable-next-line no-unused-vars
		playlists: async function(newVal, _oldVal) {
			//
			this.playlists = newVal
			const row1 = this.playlists.slice(1, 5)

			console.log(row1)
			for (let i = 0; i < row1.length; i++) {
				const playlist = row1[i]
				const playlistDetail = await this.netease.fetchPlaylist(playlist.lid)
				this.recommendedRow1.playlists.push(playlistDetail.playlist)
			}

			// console.log(this.playlists)
			// console.log(this.recommendedRow1);
		},

		// call again the method if the route changes
		$route: 'log',
	},
	methods: {
		log() {
			console.log("changed")
		},
	},
}
</script>
