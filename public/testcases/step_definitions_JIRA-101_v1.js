const { Given, When, Then } = require('@cucumber/cucumber');

let isLoggedIn = false;
let errorMessage = '';
let welcomeMessage = '';
let loginPageVisible = true;
let preFilledCredentials = { username: '', password: '' };

// Given Step Definitions
Given('the mobile user is on the login page', function () {
    loginPageVisible = true;
});

Given('the mobile user is logged in', function () {
    isLoggedIn = true;
});

// When Step Definitions
When('the mobile user enters a valid username and password', function () {
    // Functionality to enter valid credentials
    // Assume valid credentials
    preFilledCredentials = { username: 'validUser', password: 'validPass' };
});

When('the mobile user enters an invalid username or password', function () {
    // Functionality to enter invalid credentials
    preFilledCredentials = { username: 'invalidUser', password: 'invalidPass' };
});

When('the mobile user leaves the username field empty', function () {
    preFilledCredentials.username = '';
    preFilledCredentials.password = 'validPass';
});

When('the mobile user leaves the password field empty', function () {
    preFilledCredentials.username = 'validUser';
    preFilledCredentials.password = '';
});

When('the mobile user checks the "Remember Me" checkbox', function () {
    // Functionality to check remember me
});

When('the mobile user clicks the "Login" button', function () {
    if (!preFilledCredentials.username) {
        errorMessage = 'Username is required';
    } else if (!preFilledCredentials.password) {
        errorMessage = 'Password is required';
    } else if (preFilledCredentials.username !== 'validUser' || preFilledCredentials.password !== 'validPass') {
        errorMessage = 'Invalid credentials';
    } else {
        isLoggedIn = true;
        welcomeMessage = 'Welcome to the homepage!';
        loginPageVisible = false;
    }
});

When('the mobile user clicks the "Logout" button', function () {
    if (isLoggedIn) {
        isLoggedIn = false;
        welcomeMessage = '';
        loginPageVisible = true;
    }
});

// Then Step Definitions
Then('the mobile user should be redirected to the homepage', function () {
    if (!isLoggedIn) {
        throw new Error('User is not logged in, cannot redirect to homepage.');
    }
});

Then('a welcome message should be displayed', function () {
    if (welcomeMessage !== 'Welcome to the homepage!') {
        throw new Error('Welcome message is not displayed.');
    }
});

Then('an error message should be displayed indicating invalid credentials', function () {
    if (errorMessage !== 'Invalid credentials') {
        throw new Error('Error message for invalid credentials not displayed.');
    }
});

Then('the mobile user should remain on the login page', function () {
    if (loginPageVisible === false) {
        throw new Error('User is not on the login page.');
    }
});

Then('an error message should be displayed indicating the username is required', function () {
    if (errorMessage !== 'Username is required') {
        throw new Error('Error message for missing username is not displayed.');
    }
});

Then('an error message should be displayed indicating the password is required', function () {
    if (errorMessage !== 'Password is required') {
        throw new Error('Error message for missing password is not displayed.');
    }
});

Then('the mobile user should be redirected to the login page', function () {
    if (loginPageVisible === false) {
        throw new Error('User is not redirected to the login page.');
    }
});

Then('a logout confirmation message should be displayed', function () {
    if (welcomeMessage !== '') {
        throw new Error('Logout confirmation message is not displayed.');
    }
});

Then('the mobile user should be logged in', function () {
    if (!isLoggedIn) {
        throw new Error('User is not logged in.');
    }
});

Then('the next time they open the app, their credentials should be pre-filled', function () {
    if (preFilledCredentials.username !== 'validUser') {
        throw new Error('Credentials are not pre-filled.');
    }
});
