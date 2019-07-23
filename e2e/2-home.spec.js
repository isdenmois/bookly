const { login } = require('./helpers');
const db = require('./mock-server/db.json');

describe('Home page', () => {
  beforeAll(async () => {
    await login();
  });

  it('mark book as read', async () => {
    await expect(element(by.id('homeScreen'))).toBeVisible();
    jexpect(db.books['293'].status).toBe('n');

    await element(by.id('homeReadButton')).tap();

    await expect(element(by.id('changeStatusModal'))).toBeVisible();

    await element(by.id('star-5')).tap();
    await element(by.id('applyButton')).tap();

    await expect(element(by.id('homeReadButton'))).toBeNotVisible();

    jexpect(db.books['293'].status).toBe('r');
    jexpect(db.books['293'].rating).toBe(6);
  });
});
