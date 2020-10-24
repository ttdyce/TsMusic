<template>
	<span @click="onClickThumbnail()">
		<p v-if="desc != undefined || desc != ''">
			{{ desc }}
		</p>
		<p>
			<Thumbnail :src="src" />
		</p>
	</span>
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
