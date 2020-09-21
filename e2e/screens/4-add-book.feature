Feature: Add book
  Scenario: Add book from search list
    Given I see home screen
    And I should have wish count to be 1

    Then I enter Spellslinger to search bar
    And I see book item #111

    When I tap on change-status button #111
    And I tap on applyButton
    And I go back

    Then I should have wish count to be 2

  Scenario: Add book from details
    Given I see home screen
    And I should have wish count to be 2

    Then I enter Charmcaster to search bar
    And I tap on book item #333
    Then I see details #333

    When I tap on details status button
    And I tap on applyButton
    And I go back
    And I go back

    Then I should have wish count to be 3
