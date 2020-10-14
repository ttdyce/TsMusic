<template>
	<!-- image loaded -->
	<v-img
		max-height="20vh"
		min-height="16vh"
		v-if="src != ''"
		:src="src"
		alt="oops, cannot load album thumbnail! "
	>
		<template v-slot:placeholder>
			<!-- image loading -->
			<v-sheet :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`">
				<v-card>
					<v-skeleton-loader max-height="12vh" type="image"></v-skeleton-loader>
				</v-card>
			</v-sheet>
		</template>
	</v-img>
</template>

<script>
export default {
	props: {
		src: String,
	},
	inject: ['theme'],
}
</script>
