<template>
	<div>
		<v-container grey lighten-5>
			<v-row>
				<v-col cols="6">
					<ClickableThumbnail
						src="https://picsum.photos/510/300?random"
						desc="Daily feed | {dateOfToday}"
            :onClickThumbnail="() => $router.push('/playlist/recommend')"
					/>
				</v-col>
				<v-col cols="6">
					<ClickableThumbnail
						src="https://picsum.photos/510/300?random"
						desc="Heart beat"
            :onClickThumbnail="() => $router.push('/playlist/intelligence')"
					/>
				</v-col>
			</v-row>
		</v-container>
		<v-container py-0>
			<v-row>
				<v-col cols="3">
					<ClickableThumbnail src="https://picsum.photos/510/300?random" />
				</v-col>
				<v-col cols="3">
					<ClickableThumbnail src="https://picsum.photos/510/300?random" />
				</v-col>
				<v-col cols="3">
					<ClickableThumbnail src="https://picsum.photos/510/300?random" />
				</v-col>
				<v-col cols="3">
					<ClickableThumbnail src="https://picsum.photos/510/300?random" />
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script>
import ClickableThumbnail from './ClickableThumbnail'
export default {
	// Vuetify
	inject: ['theme'],
	components: {
		ClickableThumbnail,
	},
}
</script>
