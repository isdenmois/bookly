const detox = require('detox');
const { getDevice, createConfig, createMockServer } = require('../../helpers');
const { AfterAll, BeforeAll } = require('cucumber');

let mockServer;

BeforeAll(async () => {
  const device = await getDevice();
  const config = createConfig({ adbName: device.adbName });

  mockServer = await createMockServer(device.adbName, 9001);
  mockServer.init();

  await detox.init(config);
});

AfterAll(async () => {
  await detox.cleanup();
  mockServer && mockServer.close();
});
