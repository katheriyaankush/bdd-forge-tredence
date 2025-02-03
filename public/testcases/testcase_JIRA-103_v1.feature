```gherkin
Feature: Mobile User Login

  Scenario: Successful login for mobile users
    Given a mobile user is on the login page
    When the user enters valid credentials
    And clicks the "Login" button
    Then the user should be redirected to the dashboard
    And a welcome message should be displayed

  Scenario: Failed login due to invalid credentials
    Given a mobile user is on the login page
    When the user enters invalid credentials
    And clicks the "Login" button
    Then an error message should be displayed
    And the user remains on the login page

  Scenario: Login with empty credentials
    Given a mobile user is on the login page
    When the user leaves the credentials fields empty
    And clicks the "Login" button
    Then an error message indicating "Please enter your credentials" should be displayed
    And the user remains on the login page

  Scenario: Password visibility toggle functionality
    Given a mobile user is on the login page
    When the user clicks the "Show Password" icon
    Then the password input field should display the password characters
    When the user clicks the "Hide Password" icon
    Then the password input field should mask the password characters

  Scenario: Automatic logout after a period of inactivity
    Given a mobile user is logged in and on the dashboard
    When the user is inactive for 15 minutes
    Then the user should be logged out automatically
    And the user should be redirected to the login page

  Scenario: Forgotten password feature
    Given a mobile user is on the login page
    When the user clicks on "Forgot Password?"
    And enters a registered email address
    Then a confirmation message should be displayed
    And the user should receive an email to reset their password
```