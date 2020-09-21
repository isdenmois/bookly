const { Given } = require('cucumber');

/* global element, by */

Given('I enter {string} username', async name => {
  await element(by.id('loginField')).typeText(name);

  await element(by.id('submitButton')).tap();
});
