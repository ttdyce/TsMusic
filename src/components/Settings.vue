<template>
  <v-container
  >
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>Single-line item</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title>Author</v-list-item-title>
        <v-list-item-subtitle>github.com/ttdyce</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-container>
</template>

<script>
export default {
	// Vuetify
	inject: ['theme'],
	
}
</script>
