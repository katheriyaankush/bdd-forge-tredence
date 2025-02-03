```gherkin
Feature: Mobile User Login

  Scenario: Successful login for mobile users
    Given a mobile user is on the login page
    When the user enters valid credentials
    And taps the "Login" button
    Then the user should be redirected to the homepage
    And a welcome message should be displayed

  Scenario: Unsuccessful login with incorrect password
    Given a mobile user is on the login page
    When the user enters a valid username and an incorrect password
    And taps the "Login" button
    Then an error message "Invalid username or password" should be displayed
    And the user should remain on the login page

  Scenario: Unsuccessful login with non-existent username
    Given a mobile user is on the login page
    When the user enters a non-existent username and any password
    And taps the "Login" button
    Then an error message "Invalid username or password" should be displayed
    And the user should remain on the login page

  Scenario: Login attempt with empty fields
    Given a mobile user is on the login page
    When the user leaves the username and password fields empty
    And taps the "Login" button
    Then an error message "Please fill in all fields" should be displayed
    And the user should remain on the login page

  Scenario: "Forgot Password" link functionality
    Given a mobile user is on the login page
    When the user taps the "Forgot Password" link
    Then the user should be redirected to the password recovery page

  Scenario: Login page responsiveness
    Given a mobile user is on the login page
    When the user changes the device orientation from portrait to landscape
    Then the login page layout should adapt accordingly
    And all elements should remain accessible

  Scenario: Session timeout behavior
    Given a mobile user is logged in
    And the user stays inactive for a specified period
    When the session times out
    Then the user should be logged out automatically
    And redirected to the login page
    And a message "Your session has expired. Please login again." should be displayed
```