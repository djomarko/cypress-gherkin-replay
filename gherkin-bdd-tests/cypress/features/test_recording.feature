@replay
Feature: Record/Replay
  Scenario: test capturing and replaying requests in first block
    Given I visit example.cypress.io
    When I click navigation button
    Then I see "laudantium enim quasi est" in the content
    When I click navigation button
    Then I see "merged custom fixture" in the content
    When I click navigation button
    Then I see "laudantium enim quasi est" in the content

  Scenario: test capturing and replaying requests in second block
    Given I visit example.cypress.io
    When I click post button
    Then I see "POST successful!" in the content
    When I click put button
