Here are the step definition functions for the given BDD scenarios written in JavaScript. These functions are designed to be reusable and follow a well-structured format for better clarity.


const { Given, When, Then } = require('cucumber');

let mobileUser;

// Step Definitions
Given('the mobile user has the correct username and password', function() {
    mobileUser = {
        username: 'validUser',
        password: 'validPassword'
    };
});

Given('the mobile user has an account with the correct username', function() {
    mobileUser = {
        username: 'validUser'
    };
});

Given('the mobile user does not have an account with the given username', function() {
    mobileUser = {
        username: 'invalidUser'
    };
});

Given('the mobile user enters an incorrect password', function() {
    // Simulate an incorrect password
    mobileUser.password = 'wrongPassword';
});

Given('the mobile user enters their username and password', function() {
    mobileUser.password = 'validPassword';
});

Given('the mobile user selects the "Remember Me" option', function() {
    mobileUser.rememberMe = true;
});

Given('the mobile user has entered their credentials', function() {
    mobileUser = {
        username: 'validUser',
        password: 'validPassword'
    };
});

Given('the network connection fails during the login attempt', function() {
    // Simulate a network failure
    this.networkConnection = false;
});

When('the mobile user enters their credentials on the login page', function() {
    // Simulate entering credentials
    login(mobileUser.username, mobileUser.password);
});

When('the mobile user submits the login form', function() {
    // Simulate the form submission
    submitLogin(mobileUser);
});

When('a mobile user accesses the login page', function() {
    // Simulate accessing the login page
    accessLoginPage();
});

When('the user submits the login form', function() {
    submitLogin(mobileUser);
});

When('the mobile user submits the login form', function() {
    submitLogin(mobileUser);
});

Then('the user should be redirected to their dashboard', function() {
    expect(getCurrentPage()).to.equal('dashboard');
});

Then('an error message should be displayed indicating invalid credentials', function() {
    expect(getErrorMessage()).to.equal('Invalid credentials');
});

Then('the user should remain on the login page', function() {
    expect(getCurrentPage()).to.equal('login');
});

Then('the page layout should adjust for mobile screens', function() {
    expect(isLayoutResponsive()).to.be.true;
});

Then('all input fields and buttons should be easily accessible', function() {
    expect(areInputsAccessible()).to.be.true;
});

Then('the user should remain logged in on subsequent visits on the same device', function() {
    expect(isUserLoggedIn(mobileUser.username)).to.be.true;
});

Then('the user should receive visual feedback indicating the login status (success/failure)', function() {
    expect(getLoginFeedback()).to.exist;
});

Then('an error message should be displayed indicating a network issue', function() {
    expect(getErrorMessage()).to.equal('Network error occurred');
});

// Helper Functions (For demonstration purposes)
function login(username, password) {
    // Logic to handle login
}

function submitLogin(user) {
    // Perform the login action
    if (!user.username || !user.password) {
        return showError('Invalid credentials');
    }
    // Simulate login decision based on username and password
    if (user.username === 'validUser' && user.password === 'validPassword') {
        redirectToDashboard();
    } else {
        showError('Invalid credentials');
    }
}

function accessLoginPage() {
    // Logic to simulate accessing the login page
}

function redirectToDashboard() {
    // Logic to redirect user to dashboard
}

function getCurrentPage() {
    // Logic to get current page
}

function getErrorMessage() {
    // Logic to get the error message displayed
}

function isLayoutResponsive() {
    // Logic to verify layout responsiveness
}

function areInputsAccessible() {
    // Logic to check if inputs are accessible
}

function isUserLoggedIn(username) {
    // Logic to check if a user is logged in
}

function getLoginFeedback() {
    // Logic to get login feedback status
}

function showError(message) {
    // Logic to display error message
}


In this implementation:
- Each step defined in the scenarios corresponds to a function in the step definitions.
- Generic functions are created for actions (like login, submit, access, and error handling) to keep the code DRY (Don't Repeat Yourself).
- Expectations at the end of each step utilize a hypothetical assertions framework, fostering better readability and maintainability.
- This structure allows for easy updates and enhancements as requirements change.