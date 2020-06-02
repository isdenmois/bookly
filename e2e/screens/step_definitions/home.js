const { Given, Then, When } = require('cucumber');
const assert = require('assert').strict;
const db = require('../../stubs/db.json');

// beforeEach(async () => {
//   await device.relaunchApp();
// });

const SeeIds = {
  Login: 'loginField',
  Home: 'homeScreen',
  CurrentBookTitle: 'homeBookTitle',
  CurrentBookAuthor: 'homeBookAuthor',
  MarkAsRead: 'homeReadButton',
};

Given('I entered {string} username', async name => {
  await element(by.id('loginField')).typeText(name);

  await element(by.id('submitButton')).tap();
});

When('I tap {string}', async id => {
  await element(by.id(SeeIds[id] || id)).tap();
});

Then('I go back', async () => {
  await element(by.id('GoBackButton')).tap();
});

Then('I see {string}', iSee);

Then("I don't see {string}", iNotSee);

Then('I should have {string} equal {string}', async (id, text) => {
  await expect(element(by.id(SeeIds[id] || id))).toHaveText(text);
});

Given('Book {string} is {string}', checkBookStatus);
Given('Book {string} rating is {int}', checkBookRating);

When('I mark current book at {int} stars', async rating => {
  await element(by.id('homeReadButton')).tap();

  await expect(element(by.id('changeStatusModal'))).toBeVisible();

  await element(by.id(`star-${rating - 1}`)).tap();
  await element(by.id('applyButton')).tap();
});

function checkBookStatus(id, status) {
  assert.equal(db.books[id].status, status);
}

function checkBookRating(id, rating) {
  assert.equal(db.books[id].rating, rating);
}

async function iSee(id) {
  await expect(element(by.id(SeeIds[id] || id))).toBeVisible();
}

async function iNotSee(id) {
  await expect(element(by.id(SeeIds[id] || id))).toBeNotVisible();
}
