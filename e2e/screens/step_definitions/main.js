const _ = require('lodash');
const { Then, When } = require('cucumber');

/* global expect, element, by */

When(/I tap on (.+)/, id => getElement(id).tap());
Then('I go back', () => element(by.id('goBackButton')).tap());
Then(/I see (.+)/, id => expect(getElement(id)).toBeVisible());
Then('I can see {string}', id => expect(element(by.id(id))).toBeVisible());
Then(/I don't see (.+)/, id => expect(getElement(id)).toBeNotVisible());
Then(/I should have (.+) to equal "(.+)"/, (id, text) => expect(getElement(id)).toHaveText(text));
Then(/I should have (.+) to be (.+)/, (id, text) => expect(getElement(id)).toHaveText(text));
Then(/I type (.+) to (.+)/, (text, id) => getElement(id).typeText(text));
Then(/I enter (.+) to (.+)/, (text, id) => getElement(id).typeText(text + '\n'));

function getElement(id) {
  return element(by.id(_.camelCase(id)));
}
