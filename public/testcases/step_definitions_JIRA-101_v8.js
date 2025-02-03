Below are the structured and reusable JavaScript step definitions for the provided BDD test cases. I'll assume that you are using a testing framework like Cucumber.js with a testing library (for example, WebDriverIO, Cypress, or Playwright).

```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');

// Step Definitions
Given('a mobile user is on the login page', async function () {
    await browser.url('/login'); // Replace '/login' with the actual login page URL
});

When('the user enters valid credentials', async function () {
    await $('#username').setValue('validUsername'); // Replace with the actual username
    await $('#password').setValue('validPassword'); // Replace with the actual password
});

When('the user enters a valid username and an incorrect password', async function () {
    await $('#username').setValue('validUsername'); // Replace with the actual username
    await $('#password').setValue('invalidPassword'); // Invalid password
});

When('the user enters a non-existent username and any password', async function () {
    await $('#username').setValue('nonExistentUser'); // Replace with a non-existent username
    await $('#password').setValue('anyPassword'); // Any password
});

When('the user leaves the username and password fields empty', async function () {
    await $('#username').setValue('');
    await $('#password').setValue('');
});

When('the user taps the "Login" button', async function () {
    await $('#loginButton').click(); // Replace with the actual selector for the login button
});

Then('the user should be redirected to the homepage', async function () {
    const currentUrl = await browser.getUrl();
    expect(currentUrl).to.equal('/homepage'); // Replace with the actual homepage URL
});

Then('a welcome message should be displayed', async function () {
    const welcomeMessage = await $('#welcomeMessage').getText(); // Replace with actual selector
    expect(welcomeMessage).to.contain('Welcome'); // Adjust based on expected welcome message
});

Then('an error message {string} should be displayed', async function (errorMessage) {
    const errorText = await $('#errorMessage').getText(); // Replace with actual selector
    expect(errorText).to.equal(errorMessage);
});

Then('the user should remain on the login page', async function () {
    const currentUrl = await browser.getUrl();
    expect(currentUrl).to.equal('/login'); // Replace with the actual login page URL
});

When('the user taps the "Forgot Password" link', async function () {
    await $('#forgotPasswordLink').click(); // Replace with the actual selector for the link
});

Then('the user should be redirected to the password recovery page', async function () {
    const currentUrl = await browser.getUrl();
    expect(currentUrl).to.equal('/forgot-password'); // Replace with the actual password recovery page URL
});

When('the user changes the device orientation from portrait to landscape', async function () {
    await browser.setOrientation('landscape'); // Mocking change; actual implementation may vary
});

Then('the login page layout should adapt accordingly', async function () {
    const layout = await $('#layoutElement'); // Replace with actual selector
    const isDisplayed = await layout.isDisplayed();
    expect(isDisplayed).to.be.true; // Adjust check based on layout changes
});

Then('all elements should remain accessible', async function () {
    const isUsernameAccessible = await $('#username').isDisplayed();
    const isPasswordAccessible = await $('#password').isDisplayed();
    expect(isUsernameAccessible).to.be.true;
    expect(isPasswordAccessible).to.be.true;
});

Given('a mobile user is logged in', async function () {
    await browser.url('/homepage'); // Assumes the user is redirected after login
});

When('the session times out', async function () {
    await browser.pause(300000); // Simulate wait time; adjust based on actual timeout
});

Then('the user should be logged out automatically', async function () {
    const currentUrl = await browser.getUrl();
    expect(currentUrl).to.equal('/login'); // Replace with the actual login page URL
});

Then('a message {string} should be displayed', async function (sessionMessage) {
    const sessionText = await $('#sessionMessage').getText(); // Replace with actual selector
    expect(sessionText).to.equal(sessionMessage);
});
```

### Notes:
1. Adjust the selectors (e.g., `#username`, `#password`, etc.) based on your application's HTML structure.
2. The URL paths used in the assertions should be updated to reflect your application's actual routing.
3. The methods used for pausing or mocking actions, like changing orientation, may vary based on the specific testing framework and environment. This example assumes a generic approach.
4. Make sure to import necessary libraries like `chai` or any assertion library as needed for your testing framework.