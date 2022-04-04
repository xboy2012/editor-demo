const paths = require('./paths');
const errorOverlayMiddleware = require('./react-dev-utils/errorOverlayMiddleware');
const evalSourceMapMiddleware = require('./react-dev-utils/evalSourceMapMiddleware');
const ignoredFiles = require('./react-dev-utils/ignoredFiles');
const noopServiceWorkerMiddleware = require('./react-dev-utils/noopServiceWorkerMiddleware');
const redirectServedPath = require('./react-dev-utils/redirectServedPathMiddleware');

const host = process.env.HOST || '0.0.0.0';

module.exports = function () {
  return {
    // Enable hot reloading server. It will provide WDS_SOCKET_PATH endpoint
    // for the WebpackDevServer client so it can learn when the files were
    // updated. The WebpackDevServer client is included as an entry point
    // in the webpack development configuration. Note that only changes
    // to CSS are currently hot reloaded. JS changes will refresh the browser.
    hot: false,
    // Use 'ws' instead of 'sockjs-node' on server since we're using native
    // websockets in `webpackHotDevClient`.
    webSocketServer: 'ws',

    // It is important to tell WebpackDevServer to use the same "publicPath" path as
    // we specified in the webpack config. When homepage is '.', default to serving
    // from the root.
    // remove last slash so user can land on `/test` instead of `/test/`
    devMiddleware: {
      publicPath: paths.publicUrlOrPath.slice(0, -1),
    },

    // WebpackDevServer is noisy by default so we emit custom message instead
    // by listening to the compiler events with `compiler.hooks[...].tap` calls above.
    // quiet: true,
    // Reportedly, this avoids CPU overload on some systems.
    // https://github.com/facebook/create-react-app/issues/293
    // src/node_modules is not ignored to support absolute imports
    // https://github.com/facebook/create-react-app/issues/1065
    static: {
      watch: {
        ignored: ignoredFiles(paths.appSrc),
      },
      directory: paths.appPublic,
      publicPath: paths.publicUrlOrPath,
    },
    host,
    client: false,
    historyApiFallback: {
      // Paths with dots should still use the history fallback.
      // See https://github.com/facebook/create-react-app/issues/387.
      disableDotRule: true,
      index: paths.publicUrlOrPath,
    },
    allowedHosts: 'all',
    // `proxy` is run between `before` and `after` `webpack-dev-server` hooks
    // proxy,
    onBeforeSetupMiddleware({ app, server }) {
      // Keep `evalSourceMapMiddleware` and `errorOverlayMiddleware`
      // middlewares before `redirectServedPath` otherwise will not have any effect
      // This lets us fetch source contents from webpack for the error overlay
      app.use(evalSourceMapMiddleware(server));
      // This lets us open files from the runtime error overlay.
      app.use(errorOverlayMiddleware());
    },
    onAfterSetupMiddleware({ app }) {
      // Redirect to `PUBLIC_URL` or `homepage` from `package.json` if url not match
      app.use(redirectServedPath(paths.publicUrlOrPath));

      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
      app.use(noopServiceWorkerMiddleware(paths.publicUrlOrPath));
    },
  };
};
