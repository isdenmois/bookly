Feature: Lists
  Scenario: Read books
    Given I see home screen

    When I tap on read count
    Then I see book item #293
    And I don't see book item #355
    And I don't see book item #111
    And I see another year button

  Scenario: Add another year to filters
    When I tap on another year button
    Then I see book item #293
    Then I see book item #355
    And I don't see book item #111

    Then I go back

  Scenario: Wish list
    Given I see home screen

    When I tap on wish count
    Then I see book item #111
    Then I see book item #333
    Then I see book item #589
    And I don't see book item #293
    And I don't see book item #355
