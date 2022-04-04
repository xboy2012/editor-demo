const webpack = require('webpack');
const config = require('./webpack.config');

const bootstrap = (fn) => {
  (async () => {
    try {
      await fn();
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  })();
};

const webpackBuild = (webpackConfig) => {
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        return reject(err);
      }
      if (stats.hasErrors()) {
        console.info(stats.toString(webpackConfig.stats));
        return reject(new Error('Webpack compilation errors'));
      }
      return resolve();
    });
  });
};

bootstrap(async () => {
  await webpackBuild(config);
});
