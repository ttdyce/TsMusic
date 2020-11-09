<template>
	<div @click="onClickThumbnail()" class="grey lighten-3 clickable rounded">
		<div v-if="desc != undefined || desc != ''">
			{{ desc }}
		</div>
		<div>
			<Thumbnail :src="src" classes="rounded-b"/>
		</div>
	</div>
</template>

<script>
import Thumbnail from './Thumbnail'
export default {
	components: { Thumbnail },
	props: {
		src: String,
		desc: String,
		onClickThumbnail: Function,
	},
	inject: ['theme'],
	methods: {
		// log(msg) {
		// 	console.log(msg)
		// },
	},
}
</script>
