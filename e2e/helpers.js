exports.login = async function login() {
  await element(by.id('loginField')).typeText('e2e');

  await element(by.id('submitButton')).tap();
};
