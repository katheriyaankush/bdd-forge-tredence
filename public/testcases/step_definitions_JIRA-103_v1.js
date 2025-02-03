Here is a JavaScript step definition file that can be used with a BDD framework like Cucumber.js to cover the given scenarios related to mobile user login:

```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const loginPage = require('./pages/loginPage'); // Assuming you have a page object for the login page
const dashboardPage = require('./pages/dashboardPage'); // Assuming you have a page object for the dashboard page

Given('a mobile user is on the login page', async function () {
  await loginPage.navigateToLogin();
});

When('the user enters valid credentials', async function () {
  await loginPage.enterCredentials('validUser', 'validPassword'); // Replace with actual values or data file access
});

When('the user enters invalid credentials', async function () {
  await loginPage.enterCredentials('invalidUser', 'invalidPassword'); // Replace with actual values or data file access
});

When('the user leaves the credentials fields empty', async function () {
  await loginPage.enterCredentials('', ''); 
});

When('the user clicks the {string} button', async function (buttonName) {
  await loginPage.clickButton(buttonName);
});

Then('the user should be redirected to the dashboard', async function () {
  const currentUrl = await dashboardPage.getCurrentUrl();
  expect(currentUrl).to.contain('dashboard'); // Adjust as per your URL logic
});

Then('a welcome message should be displayed', async function () {
  const message = await dashboardPage.getWelcomeMessage();
  expect(message).to.equal('Welcome to your dashboard!'); // Adjust based on actual welcome message
});

Then('an error message should be displayed', async function () {
  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).to.not.be.empty;
});

Then('the user remains on the login page', async function () {
  const currentUrl = await loginPage.getCurrentUrl();
  expect(currentUrl).to.contain('login'); // Adjust as per your URL logic
});

Then('an error message indicating {string} should be displayed', async function (message) {
  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).to.equal(message);
});

When('the user clicks the {string} icon', async function (iconName) {
  await loginPage.clickIcon(iconName);
});

Then('the password input field should display the password characters', async function () {
  const isPasswordVisible = await loginPage.isPasswordVisible();
  expect(isPasswordVisible).to.be.true;
});

Then('the password input field should mask the password characters', async function () {
  const isPasswordMasked = await loginPage.isPasswordMasked();
  expect(isPasswordMasked).to.be.true;
});

Given('a mobile user is logged in and on the dashboard', async function () {
  await loginPage.login('validUser', 'validPassword');
});

When('the user is inactive for {int} minutes', async function (minutes) {
  await dashboardPage.setInactivity(minutes * 60 * 1000); // Simulate inactivity
});

Then('the user should be logged out automatically', async function () {
  const isLoggedOut = await loginPage.isLoggedOut();
  expect(isLoggedOut).to.be.true;
});

Then('the user should be redirected to the login page', async function () {
  const currentUrl = await loginPage.getCurrentUrl();
  expect(currentUrl).to.contain('login'); // Adjust as per your URL logic
});

When('the user clicks on {string}', async function (link) {
  await loginPage.clickLink(link);
});

When('enters a registered email address', async function () {
  await loginPage.enterEmail('registeredUser@example.com'); // Replace with actual registered email
});

Then('a confirmation message should be displayed', async function () {
  const message = await loginPage.getConfirmationMessage();
  expect(message).to.equal('A password reset email has been sent to your email address.'); // Adjust based on actual message
});

Then('the user should receive an email to reset their password', async function () {
  const emailReceived = await emailService.checkForResetEmail('registeredUser@example.com'); // Simulate email check
  expect(emailReceived).to.be.true;
});
```

### Notes:
1. **Page Objects**: This code assumes that you have page object files (`loginPage`, `dashboardPage`) that handle the interactions with the respective pages. You need to create these page object models according to your specific implementation details.

2. **Assertions**: This code makes use of assertions such as `expect().to.be.true` which from a testing library like Chai. Make sure to include a suitable assertion library in your project.

3. **Inactivity Simulation**: `setInactivity()` is a pseudo function that represents how you might simulate inactivity in your application. You’ll need to implement this based on your app’s actual behavior.

4. **Email Verification**: The email verification section assumes you have a service for checking email inboxes. This may require additional setup.

5. **A test framework**: You'll need to run this with a test framework that supports BDD like Cucumber.js or Jest with suitable configurations.