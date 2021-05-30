const { Given, When } = require('cucumber');
const assert = require('assert').strict;
const db = require('../../stubs/db.json');

/* global expect, element, by */

Given('Book {string} is {string}', (id, status) => assert.strictEqual(db.books[id].status, status));
Given('Book {string} rating is {int}', (id, rating) => assert.strictEqual(db.books[id].rating, rating));

When('I mark current book as {int} stars', async rating => {
  await element(by.id('iFinishedButton')).tap();

  await expect(element(by.id('changeStatusModal'))).toBeVisible();

  await element(by.id(`star-${rating - 1}`)).tap();
  await element(by.id('applyButton')).tap();
});
