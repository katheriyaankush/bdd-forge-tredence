```gherkin
Feature: Enhance Dashboard UI

  Scenario: User should see an updated layout on the dashboard
    Given the user is logged into the dashboard
    When the user navigates to the dashboard
    Then the user should see an updated layout with a modern design 
    And the layout should be responsive to different screen sizes

  Scenario: User should find improved navigation options
    Given the user is on the dashboard
    When the user looks for navigation options
    Then the user should see clear and easily accessible navigation links
    And the navigation should include links to recent activities and favorite items

  Scenario: User should see enhanced data visualization features
    Given the user is viewing their dashboard
    When the user looks at the data visualization components
    Then the user should see graphs and charts that are more intuitive and informative
    And the user should be able to hover over data points for more details

  Scenario: User customization options are available
    Given the user is logged into the dashboard
    When the user wants to customize their view
    Then the user should see options to rearrange widgets 
    And the user should be able to save their custom layout

  Scenario: New notifications are highlighted
    Given the user is on the dashboard
    When new notifications are available
    Then the user should see a prominent notification banner
    And the banner should provide quick access to the latest alerts

  Scenario: Help and support information is easy to find
    Given the user is on the dashboard
    When the user looks for help and support
    Then the user should see a clearly marked help section
    And the help section should include FAQs, contact info, and guides
```