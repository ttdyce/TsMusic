module.exports = {
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    devtool: 'source-map', 
    module: {
      rules: [
        // todo testing if this fixes is needed, seems running fine 20200928
        // { // fix webpack with NeteaseCloudMusicApi (in pac-proxy-agent) error
        //   test: /node_modules[/\\](iconv-lite)[/\\].+/,
        //   resolve: {
        //     aliasFields: ["main"],
        //   },
        // },
      ],
    },
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      mainProcessWatch: ['src/background.js']
    },
  },
};
