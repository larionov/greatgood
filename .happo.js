const { RemoteBrowserTarget } = require('happo.io');

module.exports = {
  apiKey: '25489863ea',
  apiSecret: '6711c9db33e0663f75539cf7e',
  targets: {
    chrome: new RemoteBrowserTarget('chrome', {
      viewport: '1024x768',
    }),
  },
};
