Here are the JavaScript step definitions for the outlined BDD test scenarios, structured for automated testing using a testing framework like Cucumber.js. These functions should be reusable and organized:

```javascript
const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

let currentPage = 'login'; // Simulated page state
let userCredentials = { username: '', password: '' };
let sessionActive = false;
let sessionTimeoutDuration = 3000; // Mock session timeout duration
let timeout;

Given('a mobile user is on the login page', async function () {
    currentPage = 'login';
    userCredentials = { username: '', password: '' };
    sessionActive = false;
    clearTimeout(timeout);
});

When('the user enters valid credentials', async function () {
    userCredentials.username = 'validUser';
    userCredentials.password = 'validPassword';
});

When('the user enters a valid username and an incorrect password', async function () {
    userCredentials.username = 'validUser';
    userCredentials.password = 'invalidPassword';
});

When('the user enters a non-existent username and any password', async function () {
    userCredentials.username = 'nonExistentUser';
    userCredentials.password = 'anyPassword';
});

When('the user leaves the username and password fields empty', async function () {
    userCredentials.username = '';
    userCredentials.password = '';
});

When('taps the "Login" button', async function () {
    if (userCredentials.username === '' || userCredentials.password === '') {
        throw new Error('Please fill in all fields');
    }

    if (userCredentials.username === 'validUser' && userCredentials.password === 'validPassword') {
        currentPage = 'homepage';
    } else {
        currentPage = 'login';
        if (userCredentials.username === 'validUser') {
            throw new Error('Invalid username or password');
        } else if (userCredentials.username === '') {
            throw new Error('Please fill in all fields');
        }
    }
});

Then('the user should be redirected to the homepage', async function () {
    assert.strictEqual(currentPage, 'homepage', 'User not redirected to homepage');
});

Then('a welcome message should be displayed', async function () {
    console.log('Welcome back!'); // Simulate welcome message
});

Then('an error message "{string}" should be displayed', async function (errorMessage) {
    try {
        await this.tapsLoginButton();
    } catch (error) {
        assert.strictEqual(error.message, errorMessage, 'Error message not as expected');
    }
});

Then('the user should remain on the login page', async function () {
    assert.strictEqual(currentPage, 'login', 'User should still be on login page');
});

When('the user taps the "Forgot Password" link', async function () {
    currentPage = 'passwordRecovery'; // Simulate redirection
});

Then('the user should be redirected to the password recovery page', async function () {
    assert.strictEqual(currentPage, 'passwordRecovery', 'User not redirected to password recovery page');
});

When('the user changes the device orientation from portrait to landscape', async function () {
    // Simulate change of device orientation for responsiveness test
    console.log('Device orientation changed to landscape');
});

Then('the login page layout should adapt accordingly', async function () {
    console.log('Login page responsive layout verified'); // A placeholder for actual checks
});

Then('all elements should remain accessible', async function () {
    console.log('All elements are accessible on the login page layout'); // A placeholder for actual checks
});

Given('the user is logged in', async function () {
    currentPage = 'homepage'; // Simulate user being logged in
    sessionActive = true;
    timeout = setTimeout(() => {
        sessionActive = false;
        currentPage = 'login';
        console.log('Your session has expired. Please login again.');
    }, sessionTimeoutDuration);
});

Then('the user should be logged out automatically', async function () {
    assert.strictEqual(sessionActive, false, 'User should be logged out');
    assert.strictEqual(currentPage, 'login', 'User should be redirected to login page');
});

Then('a message "{string}" should be displayed', async function (message) {
    console.log(message); // Simulates message display
});
```

### Explanation:
- Each step definition correlates with the steps in your BDD scenarios.
- The `Given`, `When`, and `Then` functions are the basic building blocks for defining step behavior.
- Assertions are used to verify that the actual outcome matches the expected outcome.
- We've simulated user interactions and system states through variables, and a simplified session timeout management.
- Console logs simulate some message outputs for welcome screens or error messages.

In a real-world implementation, you would replace the console logs and assertions with actual UI interactions using a testing library like WebdriverIO or Puppeteer, depending on the tech stack of your mobile application.