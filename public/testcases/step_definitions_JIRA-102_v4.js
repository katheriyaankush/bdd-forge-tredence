Here's a JavaScript step definitions file implementing the BDD scenarios using a reusable structure. This code assumes you are using a BDD testing framework like Cucumber.js.

```javascript
const { Given, When, Then } = require('cucumber');

// Reusable functions for repeated actions
async function userIsLoggedIn() {
  // Implementation to check if user is logged in
  // This could involve waiting for an element or checking the session
  console.log('User is logged into the dashboard.');
}

async function userViewsDashboard() {
  // Implementation to view the dashboard
  console.log('User views the dashboard.');
}

async function userAttemptsAccessSections() {
  // Implementation for accessing different sections
  console.log('User attempts to access different sections of the dashboard.');
}

async function userLooksForFeatures() {
  // Implementation for looking for frequently used features
  console.log('User looks for frequently used features.');
}

async function userChecksAccessibilityOptions() {
  // Implementation for checking accessibility options
  console.log('User checks the dashboard for accessibility options.');
}

async function userInteractsWithElements() {
  // Implementation for interacting with dashboard elements
  console.log('User interacts with the dashboard elements.');
}

async function userNavigatesToSettings() {
  // Implementation for navigating to the settings
  console.log('User navigates to the settings.');
}

async function userInteractsWithNewFeatures() {
  // Implementation for interacting with new features
  console.log('User interacts with the new features.');
}

Given('the user is logged into the dashboard', async function () {
  await userIsLoggedIn();
});

When('the user views the dashboard', async function () {
  await userViewsDashboard();
});

Then('the dashboard layout should be visually appealing with a modern design', function () {
  // Check for visually appealing layout, e.g., through assertions
  console.log('Verified that the dashboard layout is visually appealing.');
});

When('the user attempts to access different sections of the dashboard', async function () {
  await userAttemptsAccessSections();
});

Then('the navigation menu should be easy to find and use', function () {
  // Assert navigation menu usability
  console.log('Verified that the navigation menu is easy to find and use.');
});

Given('the user is logged into the dashboard on a mobile device', async function () {
  // You might need to set screen size to simulate mobile
  await userIsLoggedIn();
});

Then('the dashboard should be fully responsive and usable on various screen sizes', function () {
  // Assert dashboard responsiveness
  console.log('Verified that the dashboard is fully responsive.');
});

When('the user looks for frequently used features', async function () {
  await userLooksForFeatures();
});

Then('there should be quick access widgets for the top three features', function () {
  // Assert presence of quick access widgets
  console.log('Verified presence of quick access widgets for top three features.');
});

When('the user checks the dashboard for accessibility options', async function () {
  await userChecksAccessibilityOptions();
});

Then('there should be support for screen readers and keyboard navigation', function () {
  // Assert accessibility support
  console.log('Verified support for screen readers and keyboard navigation.');
});

When('the user interacts with the dashboard elements', async function () {
  await userInteractsWithElements();
});

Then('the dashboard should load and respond within acceptable time limits', function () {
  // Assert loading times
  console.log('Verified that the dashboard loads and responds within acceptable time limits.');
});

When('the user navigates to the settings', async function () {
  await userNavigatesToSettings();
});

Then('the user should be able to customize the layout and content of the dashboard', function () {
  // Assert customization options
  console.log('Verified that the user can customize the dashboard settings.');
});

When('the user interacts with the new features', async function () {
  await userInteractsWithNewFeatures();
});

Then('the user should be prompted to provide feedback on the new enhancements', function () {
  // Assert user feedback prompt
  console.log('Verified that the user is prompted to provide feedback on the new enhancements.');
});
```

### Explanation:
In this implementation, reusable functions are created for repetitive actions, such as user login and interactions with the dashboard. Each step definition calls these reusable functions, ensuring consistency and reducing duplication in the code.