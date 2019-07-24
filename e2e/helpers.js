const _ = require('lodash');
const AndroidDriver = require('detox/src/devices/drivers/AndroidDriver');
const MockServer = require('./mock-server');

let driver = new AndroidDriver({});

exports.login = async function login() {
  await element(by.id('loginField')).typeText('e2e');

  await element(by.id('submitButton')).tap();
};

exports.getDeviceId = function getDeviceId() {
  return driver.findDeviceId(_.identity);
};

exports.createConfig = function createConfig(deviceId) {
  const config = require('../package.json').detox;

  _.forEach(config.configurations, configuration => (configuration.name = deviceId));

  return config;
};

exports.createMockServer = async function createMockServer(deviceId, port) {
  await driver.adb.adbCmd(deviceId, `reverse tcp:${port} tcp:${port}`);

  return new MockServer(port);
};
