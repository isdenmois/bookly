describe('Login page', () => {
  it('should open home screen after login', async () => {
    await element(by.id('loginField')).typeText('e2e');

    await element(by.id('submitButton')).tap();

    await expect(element(by.id('homeScreen'))).toBeVisible();
  });
});
