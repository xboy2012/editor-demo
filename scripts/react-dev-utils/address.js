const os = require('os');

function getInterfaceName() {
  let val = 'eth';
  const platform = os.platform();
  if (platform === 'darwin') {
    val = 'en';
  } else if (platform === 'win32') {
    val = null;
  }
  return val;
}

const _interface = function () {
  const family = 'IPv4';
  const interfaces = os.networkInterfaces();
  const name = getInterfaceName();
  for (let i = -1; i < 8; i++) {
    const interfaceName = name + (i >= 0 ? i : ''); // support 'lo' and 'lo0'
    const items = interfaces[interfaceName];
    if (items) {
      for (let j = 0; j < items.length; j++) {
        const item = items[j];
        if (item.family === 'IPv4') {
          return item;
        }
      }
    }
  }

  // filter 127.0.0.1, get the first ip
  // eslint-disable-next-line guard-for-in
  for (const k in interfaces) {
    const items = interfaces[k];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.family === family && item.address !== '127.0.0.1') {
        return item;
      }
    }
  }
  return undefined;
};

/**
 * Get current machine IPv4
 *
 * @return {String} IP address
 */
exports.ip = function () {
  const item = _interface();
  return item && item.address;
};
