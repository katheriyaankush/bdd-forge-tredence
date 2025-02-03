```gherkin
Feature: Mobile User Login

  Scenario: Successful login for mobile users
    Given the mobile user is on the login page
    When the user enters a valid username and password
    And clicks the "Login" button
    Then the user should be redirected to the homepage
    And a welcome message should be displayed

  Scenario: Unsuccessful login with invalid credentials
    Given the mobile user is on the login page
    When the user enters an invalid username or password
    And clicks the "Login" button
    Then an error message should be displayed
    And the user should remain on the login page

  Scenario: Login button is disabled when fields are empty
    Given the mobile user is on the login page
    When the username and password fields are empty
    Then the "Login" button should be disabled

  Scenario: Remember me functionality works correctly
    Given the mobile user is on the login page
    When the user enters valid credentials and selects "Remember me"
    And clicks the "Login" button
    Then the user should be redirected to the homepage
    And the next time they visit the login page, their username should be pre-filled

  Scenario: Forgot password link navigates to reset page
    Given the mobile user is on the login page
    When the user clicks on the "Forgot Password?" link
    Then the user should be redirected to the password reset page

  Scenario: Login page is responsive and user-friendly on mobile devices
    Given the mobile user is accessing the login page
    When the user views the page on a mobile device
    Then the layout should be optimized for mobile screens
    And all buttons and links should be easily tappable
```