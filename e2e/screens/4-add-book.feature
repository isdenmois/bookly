Feature: Add book
  Scenario: Add book from search list
    Given I see home screen
    When I tap on shelves tab
    Then I should have wish count to be View all (1)

    Then I tap on search tab

    When I enter Spellslinger to search bar
    Then I see book item #111

    When I tap on change-status button #111
    And I tap on applyButton
    And I go back

    When I tap on shelves tab
    Then I should have wish count to be View all (2)

  Scenario: Add book from details
    Given I see shelves screen
    And I should have wish count to be View all (2)

    Then I tap on search tab

    Then I enter Charmcaster to search bar
    And I tap on book item #333
    Then I see details #333

    When I tap on details status button
    And I tap on applyButton
    And I go back
    And I go back
    And I tap on shelves tab

    Then I should have wish count to be View all (3)
