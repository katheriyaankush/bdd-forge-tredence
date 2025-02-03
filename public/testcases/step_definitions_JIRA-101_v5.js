Here's a set of reusable JavaScript step definitions based on the provided BDD test cases for mobile user login. These step definitions are structured to work with a testing framework like Cucumber.js and will depend on a testing utility like WebdriverIO or Cypress for implementing the actual interactions:

```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');

// Assuming we have a helper utility for managing interactions
const loginHelper = require('./loginHelper');

Given('a mobile user is on the login page', async () => {
    await loginHelper.navigateToLoginPage();
});

When('the user enters valid credentials', async () => {
    await loginHelper.enterCredentials('validUser', 'validPassword');
});

When('the user enters a valid username and an incorrect password', async () => {
    await loginHelper.enterCredentials('validUser', 'invalidPassword');
});

When('the user enters a non-existent username and any password', async () => {
    await loginHelper.enterCredentials('nonExistentUser', 'anyPassword');
});

When('the user leaves the username and password fields empty', async () => {
    await loginHelper.enterCredentials('', '');
});

When('the user taps the {string} button', async (buttonText) => {
    await loginHelper.tapButton(buttonText);
});

When('the user taps the {string} link', async (linkText) => {
    await loginHelper.tapLink(linkText);
});

When('the user stays inactive for a specified period', async () => {
    await loginHelper.waitForSessionTimeout();
});

When('the user changes the device orientation from portrait to landscape', async () => {
    await loginHelper.changeDeviceOrientation('landscape');
});

Then('the user should be redirected to the homepage', async () => {
    const URL = await browser.getUrl();
    expect(URL).to.include('homepage'); // Modify according to the actual homepage URL pattern
});

Then('a welcome message should be displayed', async () => {
    const message = await loginHelper.getMessage();
    expect(message).to.equal('Welcome back!');
});

Then('an error message {string} should be displayed', async (errorMessage) => {
    const message = await loginHelper.getErrorMessage();
    expect(message).to.equal(errorMessage);
});

Then('the user should remain on the login page', async () => {
    const URL = await browser.getUrl();
    expect(URL).to.include('login'); // Modify according to the actual login URL pattern
});

Then('the user should be redirected to the password recovery page', async () => {
    const URL = await browser.getUrl();
    expect(URL).to.include('password-recovery'); // Modify according to the actual recovery URL pattern
});

Then('the login page layout should adapt accordingly', async () => {
    const layoutAdapted = await loginHelper.checkLayoutAdapted();
    expect(layoutAdapted).to.be.true; // Assuming a function that checks layout adaptation
});

Then('all elements should remain accessible', async () => {
    const elementsAccessible = await loginHelper.checkAllElementsAccessible();
    expect(elementsAccessible).to.be.true; // Assuming a function that verifies element accessibility
});

Then('the user should be logged out automatically', async () => {
    const isLoggedIn = await loginHelper.isLoggedIn();
    expect(isLoggedIn).to.be.false;
});

Then('the user should be redirected to the login page', async () => {
    const URL = await browser.getUrl();
    expect(URL).to.include('login'); // Modify according to the actual login URL pattern
});

Then('a message {string} should be displayed', async (sessionMessage) => {
    const message = await loginHelper.getMessage();
    expect(message).to.equal(sessionMessage);
});
```

### Notes:
1. In the step definitions above:
   - Each step corresponds to a part of the Gherkin scenario.
   - The `loginHelper` is assumed to be a utility that abstracts interactions with the login page and handles locating elements and performing actions.
   - Error messages and redirection URLs should be replaced with actual application paths or messages.
   - The `expect` statements are used here for assertions, assuming that the Chai library is used.
2. Ensure the testing environment is set up properly to use browser automation for performing actions in real time, capturing states, and validating results.