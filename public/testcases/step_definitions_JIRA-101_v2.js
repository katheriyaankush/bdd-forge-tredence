Here's a JavaScript step definition file that corresponds to the given BDD scenarios for mobile user login. This file utilizes commonly used libraries such as Cucumber.js and WebDriverJS (or Selenium) for step definitions. Ensure that your environment has the required setup to run this code.

```javascript
const { Given, When, Then } = require('@cucumber/cucumber');

// Mocking some generic functions for the actions
const mobileUser = {
    isOnLoginPage: async () => { /* logic to verify if on the login page */ },
    enterCredentials: async (username, password) => { /* logic to enter credentials */ },
    tapLoginButton: async () => { /* logic to tap the login button */ },
    checkRedirectToHomepage: async () => { /* logic to check redirect to homepage */ },
    checkWelcomeMessage: async () => { /* logic to validate the display of welcome message */ },
    checkErrorMessage: async (message) => { /* logic to validate displayed error message */ },
    checkRemainsOnLoginPage: async () => { /* logic to check remains on login page */ },
    checkRedirectToPasswordRecovery: async () => { /* logic to check redirect to password recovery page */ },
    checkPageResponsiveness: async () => { /* logic to check page layout adaptation */ },
    checkAllElementsAccessible: async () => { /* logic to check element accessibility */ },
    simulateInactivity: async () => { /* logic to simulate inactivity */ },
    checkSessionTimeout: async () => { /* logic to verify session timeout */ },
    checkSessionExpiredMessage: async () => { /* logic to verify session expired message */ },
};

// Step Definitions
Given('a mobile user is on the login page', async () => {
    await mobileUser.isOnLoginPage();
});

When('the user enters valid credentials', async () => {
    await mobileUser.enterCredentials('validUsername', 'validPassword'); // Replace with actual logic or parameters
});

When('the user enters a valid username and an incorrect password', async () => {
    await mobileUser.enterCredentials('validUsername', 'incorrectPassword');
});

When('the user enters a non-existent username and any password', async () => {
    await mobileUser.enterCredentials('nonExistentUsername', 'anyPassword');
});

When('the user leaves the username and password fields empty', async () => {
    await mobileUser.enterCredentials('', '');
});

When('the user taps the {string} button', async (button) => {
    if (button === "Login") {
        await mobileUser.tapLoginButton();
    }
});

When('the user taps the {string} link', async (link) => {
    if (link === "Forgot Password") {
        await mobileUser.tapForgotPasswordLink(); // Ensure this function exists
    }
});

When('the user stays inactive for a specified period', async () => {
    await mobileUser.simulateInactivity();
});

When('the session times out', async () => {
    await mobileUser.checkSessionTimeout();
});

Then('the user should be redirected to the homepage', async () => {
    await mobileUser.checkRedirectToHomepage();
});

Then('a welcome message should be displayed', async () => {
    await mobileUser.checkWelcomeMessage();
});

Then('an error message {string} should be displayed', async (message) => {
    await mobileUser.checkErrorMessage(message);
});

Then('the user should remain on the login page', async () => {
    await mobileUser.checkRemainsOnLoginPage();
});

Then('the user should be redirected to the password recovery page', async () => {
    await mobileUser.checkRedirectToPasswordRecovery();
});

Then('the login page layout should adapt accordingly', async () => {
    await mobileUser.checkPageResponsiveness();
});

Then('all elements should remain accessible', async () => {
    await mobileUser.checkAllElementsAccessible();
});

Then('the user should be logged out automatically', async () => {
    // Logic to verify user is logged out can go here
});

Then('a message {string} should be displayed', async (message) => {
    await mobileUser.checkSessionExpiredMessage(message);
});

```

### Explanation:
1. **Given Steps**: Set up the initial state (i.e., user is on the login page).
2. **When Steps**: Emulate the action performed by the user (e.g., entering credentials, tapping buttons).
3. **Then Steps**: Validate the expected outputs or state changes (e.g., redirecting to the homepage, showing messages).
4. **Reusability**: Step definitions reuse the functions in the `mobileUser` object to maintain code clarity and reduce duplication.

Make sure to replace the mock implementations in the `mobileUser` object with actual function definitions that interact with your application's UI or application code.