global.jexpect = expect;

const detox = require('detox');
const { getDeviceId, createConfig, createMockServer } = require('./helpers');
const adapter = require('detox/runners/jest/adapter');
const specReporter = require('detox/runners/jest/specReporter');

// Set the default timeout
jest.setTimeout(120000);
jasmine.getEnv().addReporter(adapter);

// This takes care of generating status logs on a per-spec basis. By default, jest only reports at file-level.
// This is strictly optional.
jasmine.getEnv().addReporter(specReporter);

let mockServer;

beforeAll(async () => {
  const deviceId = await getDeviceId();
  const config = createConfig(deviceId);

  mockServer = await createMockServer(deviceId, 9001);
  mockServer.init();

  await detox.init(config);
});

beforeEach(async () => {
  await adapter.beforeEach();
});

afterAll(async () => {
  await adapter.afterAll();
  await detox.cleanup();
  mockServer && mockServer.close();
});
