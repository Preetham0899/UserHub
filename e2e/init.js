// e2e/init.js
const detox = require('detox');
const config = require('../.detoxrc.js');

let detoxInstance;

beforeAll(async () => {
  // Detect Detox API style automatically
  if (typeof detox.Detox === 'function') {
    // For newer Detox versions (>=20.5)
    detoxInstance = new detox.Detox({ config });
    await detoxInstance.init();
    global.device = detoxInstance.device;
  } else {
    // For older Detox versions (<=20.4 or v19)
    await detox.init(config);
    detoxInstance = detox;
    global.device = detox.device;
  }
}, 300000);

afterAll(async () => {
  if (detoxInstance && typeof detoxInstance.cleanup === 'function') {
    await detoxInstance.cleanup();
  } else if (typeof detox.cleanup === 'function') {
    await detox.cleanup();
  }
});
