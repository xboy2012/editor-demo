'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', (err) => {
  throw err;
});

const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const paths = require('./paths');
const clearConsole = require('./react-dev-utils/clearConsole');
const openBrowser = require('./react-dev-utils/openBrowser');
const {
  choosePort,
  createCompiler,
  prepareUrls,
} = require('./react-dev-utils/WebpackDevServerUtils');
const configFactory = require('./webpack.dev.config');
const createDevServerConfig = require('./webpackDevServer.config');

const isInteractive = process.stdout.isTTY;

// Tools like Cloud9 rely on this.
const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

if (process.env.HOST) {
  console.log(
    chalk.cyan(
      `Attempting to bind to HOST environment variable: ${chalk.yellow(
        chalk.bold(process.env.HOST)
      )}`
    )
  );
  console.log("If this was unintentional, check that you haven't mistakenly set it in your shell.");
  console.log(`Learn more here: ${chalk.yellow('https://cra.link/advanced-config')}`);
  console.log();
}

Promise.resolve()
  .then(() => {
    // We attempt to use the default port but if it is busy, we offer the user to
    // run on a different port. `choosePort()` Promise resolves to the next free port.
    return choosePort(HOST, DEFAULT_PORT);
  })
  .then((port) => {
    if (!port) {
      // We have not found a port.
      return;
    }

    const config = configFactory();
    const protocol = 'http';
    const appName = require(paths.appPackageJson).name;

    const urls = prepareUrls(protocol, HOST, port, paths.publicUrlOrPath.slice(0, -1));
    const devSocket = {
      // eslint-disable-next-line no-use-before-define
      warnings: (warnings) => devServer.sockWrite(devServer.sockets, 'warnings', warnings),
      // eslint-disable-next-line no-use-before-define
      errors: (errors) => devServer.sockWrite(devServer.sockets, 'errors', errors),
    };
    // Create a webpack compiler that is configured with custom messages.
    const compiler = createCompiler({
      appName,
      config,
      devSocket,
      urls,
      useYarn: true,
      useTypeScript: false,
      tscCompileOnError: false,
      webpack,
    });
    // Serve webpack assets generated by the compiler over a web server.
    const serverConfig = createDevServerConfig();
    const devServer = new WebpackDevServer(compiler, serverConfig);
    // Launch WebpackDevServer.
    devServer.listen(port, HOST, (err) => {
      if (err) {
        console.log(err);
        return;
      }
      if (isInteractive) {
        clearConsole();
      }

      console.log(chalk.cyan('Starting the development server...\n'));
      openBrowser(urls.localUrlForBrowser);
    });

    ['SIGINT', 'SIGTERM'].forEach(function (sig) {
      process.on(sig, function () {
        devServer.close();
        process.exit();
      });
    });

    if (process.env.CI !== 'true') {
      // Gracefully exit when stdin ends
      process.stdin.on('end', function () {
        devServer.close();
        process.exit();
      });
    }
  })
  .catch((err) => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });