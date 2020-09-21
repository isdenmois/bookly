const _ = require('lodash');
const AndroidDriver = require('detox/src/devices/drivers/android/AndroidDriver');
const MockServer = require('./mock-server');

const driver = new AndroidDriver({});

exports.getDevice = async function () {
  const { devices } = await driver.adb.devices();

  return devices.find(d => d.adbName);
};

exports.createConfig = function createConfig(device) {
  const config = require('../package.json').detox;

  _.forEach(config.configurations, configuration => {
    configuration.device = device;
  });

  return config;
};

exports.createMockServer = async function createMockServer(deviceId, port) {
  await driver.adb.adbCmd(deviceId, `reverse tcp:${port} tcp:${port}`);

  return new MockServer(port);
};
