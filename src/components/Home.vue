<template>
  <div
    class="red"
  >
    <v-container class="grey lighten-5">
      <v-row>
        <v-col sm="4">
          <v-sheet :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`">
            <v-card>
              <v-skeleton-loader
                max-height="20vh"
                type="image"
              ></v-skeleton-loader>
            </v-card>
          </v-sheet>
        </v-col>
        <v-col sm="6">
          <v-row no-gutters>
            <v-col> Home</v-col>
          </v-row>
          <v-row no-gutters>
            <v-col> Playlistid {{ $route.params.id }} </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  // Vuetify
  inject: ["theme"],
};
</script>
