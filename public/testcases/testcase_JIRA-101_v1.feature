```gherkin
Feature: Mobile User Login

  Scenario: Successful login for valid mobile users
    Given the mobile user is on the login page
    When the mobile user enters a valid username and password
    And clicks the "Login" button
    Then the mobile user should be redirected to the homepage
    And a welcome message should be displayed

  Scenario: Failed login with invalid credentials for mobile users
    Given the mobile user is on the login page
    When the mobile user enters an invalid username or password
    And clicks the "Login" button
    Then an error message should be displayed indicating invalid credentials
    And the mobile user should remain on the login page

  Scenario: Login attempt with empty username for mobile users
    Given the mobile user is on the login page
    When the mobile user leaves the username field empty
    And enters a password
    And clicks the "Login" button
    Then an error message should be displayed indicating the username is required
    And the mobile user should remain on the login page

  Scenario: Login attempt with empty password for mobile users
    Given the mobile user is on the login page
    When the mobile user enters a valid username
    And leaves the password field empty
    And clicks the "Login" button
    Then an error message should be displayed indicating the password is required
    And the mobile user should remain on the login page

  Scenario: Logout from mobile user account
    Given the mobile user is logged in
    When the mobile user clicks the "Logout" button
    Then the mobile user should be redirected to the login page
    And a logout confirmation message should be displayed

  Scenario: Remember me functionality for mobile users
    Given the mobile user is on the login page
    When the mobile user enters valid credentials
    And checks the "Remember Me" checkbox
    And clicks the "Login" button
    Then the mobile user should be logged in
    And the next time they open the app, their credentials should be pre-filled
```