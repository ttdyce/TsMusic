<template>
	<v-system-bar
		class="titlebar px-0"
		window
		dark
		app
		height="28"
		style="background-color: rgb(68, 68, 68); color: rgb(255, 255, 255); height: 30px;"
	>
		<div class="titlebar-drag-region"></div>
		<div
			style="width:100%;
    height: 100%;
    top: 0;
    left: 0;
    position: absolute;
    z-index: -1;"
		>
			<v-container fluid pa-0 fill-height>
				<v-row no-gutters justify="center">
					<v-col style="text-align: center">
						TSMusic
					</v-col>
				</v-row>
			</v-container>
		</div>
		<!-- <div
			style="width:100%;
    top: 0;
    left: 0;
    position: absolute;
    height: 100%;
    z-index: -1;"
		>
			<div style="text-align: center;">TSMusic</div>
		</div> -->

		<v-spacer></v-spacer>
		<!-- commented on Mac, todo 20220125 detect os platform, show windows key on windows only -->
		<!-- <div class="window-controls-container"> 
			<div class="window-icon-bg">
				<div class="window-icon window-minimize" @click="minimize()"></div>
			</div>
			<div class="window-icon-bg">
				<div
					class="window-icon"
					:class="{
						'window-unmaximize': isMaximized,
						'window-maximize': !isMaximized,
					}"
					@click="maximize()"
				></div>
			</div>
			<div class="window-icon-bg">
				<div class="window-icon-bg window-close-bg" @click="close()">
					<div class="window-icon window-close"></div>
				</div>
			</div>
		</div> -->
	</v-system-bar>
</template>

<script>
import { remote } from 'electron'
export default {
	data: () => ({
		currentWindow: remote.getCurrentWindow(),
		isMaximized: remote.getCurrentWindow().isMaximized(),
	}),
	computed: {},
	methods: {
		minimize() {
			this.currentWindow.minimize()
		},
		maximize() {
			if (this.isMaximized) {
				this.currentWindow.unmaximize()
			} else {
				this.currentWindow.maximize()
			}
		},
		close() {
			// if (this._options.hideWhenClickingClose) {
			// 	this.currentWindow.hide()
			// } else {
			this.currentWindow.close()
			// }
		},
	},
	created() {
		// register events
		this.currentWindow.on('maximize', () => {
			this.isMaximized = true
		})
		this.currentWindow.on('unmaximize', () => {
			this.isMaximized = false
		})
	},
}
</script>
