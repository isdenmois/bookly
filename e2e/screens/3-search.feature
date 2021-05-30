Feature: Search
  Scenario: Should search book
    Given I see home screen

    When I tap on search tab
    And I enter Spellslinger to search bar

    Then I see book item #111
    And I don't see book item #222
    And I don't see book item #333

  Scenario: Should search another book
    Given I see search screen
    Then I tap on search clear

    When I enter Charmcaster to search bar
    Then I see book item #333
    And I don't see book item #111
    And I don't see book item #222

  Scenario: Should search in LiveLib
    Given I see search screen
    And I should have source toggler text to equal "FantLab"

    Then I tap on search clear

    When I enter Shadowblack to search bar
    And I tap on source toggler

    Then I should have source toggler text to equal "LiveLib"
    And I can see "bookIteml_222"
    And I don't see book item #111
    And I don't see book item #333

    Then I go back
