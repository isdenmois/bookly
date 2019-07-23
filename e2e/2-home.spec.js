const { login } = require('./helpers');
const db = require('./mock-server/mocks/db.json');

describe('Home page', () => {
  beforeAll(async () => {
    await login();
  });

  it('render current read book', async () => {
    await expect(element(by.id('homeScreen'))).toBeVisible();
    await expect(element(by.id('homeBookTitle'))).toHaveText('Противостояние');
    await expect(element(by.id('homeBookAuthor'))).toHaveText('Стивен Кинг');
  });

  it('mark book as read', async () => {
    await expect(element(by.id('homeReadButton'))).toBeVisible();
    await expect(element(by.id('bookSelectButton'))).toBeNotVisible();
    jexpect(db.books['293'].status).toBe('n');

    await element(by.id('homeReadButton')).tap();

    await expect(element(by.id('changeStatusModal'))).toBeVisible();

    await element(by.id('star-5')).tap();
    await element(by.id('applyButton')).tap();

    await expect(element(by.id('homeReadButton'))).toBeNotVisible();
    await expect(element(by.id('bookSelectButton'))).toBeVisible();

    jexpect(db.books['293'].status).toBe('r');
    jexpect(db.books['293'].rating).toBe(6);
  });

  it('select book', async () => {
    await expect(element(by.id('bookSelectButton'))).toBeVisible();
    await element(by.id('bookSelectButton')).tap();

    await expect(element(by.id('bookSelectModal'))).toBeVisible();
  });
});
