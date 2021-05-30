Feature: Home
  Scenario: Home screen parts are visible
    Given I see home screen
    Then I should have current book title to equal "Противостояние"

  Scenario: Mark book as read
    When I tap on shelves tab
    And I should have read count to be View all (1)
    Then I should have wish count to be View all (2)
    Then I tap on home tab

    Given Book "293" is "n"
    And I see I-finished button
    But I don't see book-select button

    When I mark current book as 5 stars

    Then I see book-select button

    When I tap on shelves tab
    Then I should have wish count to be View all (2)
    And I should have read count to be View all (2)
    Then I tap on home tab

    And Book "293" is "r"
    And Book "293" rating is 5
    But I don't see I-finished button

    Then I scroll to bottom of home screen
    And I see read book 293

    Then I scroll to top of home screen

  Scenario: Select Book
    Given I see book-select button
    And Book "289" is "w"

    When I tap on book-select button

    Then I see book-select modal
    And I see book to select #289
    And I see book to select #589

    When I tap on "BookToSelect289"
    And I tap on "DoSelectBook"

    Then I should have current book title to equal "Кэрри"
    And Book "289" is "n"

    When I tap on shelves tab
    Then I should have wish count to be View all (1)
    And I should have read count to be View all (2)
    Then I tap on home tab

  Scenario: Open current reading book
    When I tap on current thumbnail
    Then I see details #289
    And I go back
