const net = require('net');
const { ip: addressIP } = require('./address');

function listen(_port, hostname, callback) {
  let port = _port;
  const server = new net.Server();

  server.on('error', (err) => {
    server.close();
    if (err.code === 'ENOTFOUND') {
      return callback(null, port);
    }
    return callback(err);
  });

  server.listen(port, hostname, () => {
    port = server.address().port;
    server.close();
    return callback(null, port);
  });
}

function tryListen(host, _port, _maxPort, callback) {
  let port = _port;
  let maxPort = _maxPort;
  function handleError() {
    port++;
    if (port >= maxPort) {
      port = 0;
      maxPort = 0;
    }
    tryListen(host, port, maxPort, callback);
  }

  // 1. check specified host (or null)
  listen(port, host, (err, realPort) => {
    // ignore random listening
    if (port === 0) {
      callback(err, realPort);
      return;
    }

    if (err) {
      handleError(err);
      return;
    }

    // 2. check default host
    listen(port, null, (err) => {
      if (err) {
        handleError(err);
        return;
      }

      // 3. check localhost
      listen(port, 'localhost', (err) => {
        if (err) {
          handleError(err);
          return;
        }

        // 4. check current ip
        let ip;
        try {
          ip = addressIP();
        } catch (err) {
          // Skip the `ip` check if `address.ip()` fails
          callback(null, realPort);
          return;
        }

        listen(port, ip, (err, realPort) => {
          if (err) {
            handleError(err);
            return;
          }

          callback(null, realPort);
        });
      });
    });
  });
}

module.exports = (_port, _host, _callback) => {
  let port = _port;
  let host = _host;
  let callback = _callback;
  if (typeof port === 'function') {
    callback = port;
    port = null;
  } else if (typeof host === 'function') {
    callback = host;
    host = null;
  }
  port = parseInt(port) || 0;
  let maxPort = port + 10;
  if (maxPort > 65535) {
    maxPort = 65535;
  }
  if (typeof callback === 'function') {
    return tryListen(host, port, maxPort, callback);
  }
  // promise
  return new Promise((resolve, reject) => {
    tryListen(host, port, maxPort, (error, realPort) => {
      if (error) {
        reject(error);
      } else {
        resolve(realPort);
      }
    });
  });
};
