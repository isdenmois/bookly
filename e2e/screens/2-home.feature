Feature: Home
  Scenario: Home screen parts are visible
    Given I see home screen
    Then I should have current book title to equal "Противостояние"
    And I should have current book author to equal "Стивен Кинг"
    And I should have read count to be 1
    And I should have wish count to be 2
    And I should have planned books count to be 10

  Scenario: Mark book as read
    Given Book "293" is "n"
    And I see home-read button
    But I don't see book-select button

    When I mark current book as 5 stars

    Then I see book-select button
    And I should have read count to be 2
    And I should have wish count to be 2
    And Book "293" is "r"
    And Book "293" rating is 5
    But I don't see home-read-button

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
    And I should have read count to be 2
    And I should have wish count to be 1
    And Book "289" is "n"

  Scenario: Open current reading book
    When I tap on current thumbnail
    Then I see details #289
    And I go back
