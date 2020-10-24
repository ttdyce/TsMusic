var bundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  transpileDependencies: ["vuetify"],
  configureWebpack: {
    devtool: 'source-map', 
    module: {
      rules: [
         // fix webpack with NeteaseCloudMusicApi (in pac-proxy-agent -> iconv-lite) error
        {
          test: /node_modules[/\\](iconv-lite)[/\\].+/,
          resolve: {
            aliasFields: ["main"],
          },
        },
      ],
    },
    plugins: [
      new bundleAnalyzer({
        analyzerMode: "static",
        reportFilename: "report.html",
        openAnalyzer: false
    })
    ]
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      mainProcessWatch: ['src/background.js', 'src/api/netease.js']
    },
  },
};
