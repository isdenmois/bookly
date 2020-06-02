Feature: Home
  Scenario: Home screen parts are visible
    Given I see "Home"
    Then I should have "CurrentBookTitle" equal "Противостояние"
    And I should have "CurrentBookAuthor" equal "Стивен Кинг"
    And I should have "ReadCount" equal "1"
    And I should have "WishCount" equal "2"
    And I should have "PlannedBooksCount" equal "10"

  Scenario: Mark book as read
    Given Book "293" is "n"
    And I see "MarkAsRead"
    But I don't see "BookSelectButton"

    When I mark current book at 5 stars

    Then I see "BookSelectButton"
    And I should have "ReadCount" equal "2"
    And I should have "WishCount" equal "2"
    And Book "293" is "r"
    And Book "293" rating is 5
    But I don't see "MarkAsRead"

  Scenario: Select Book
    Given I see "BookSelectButton"
    And Book "289" is "w"

    When I tap "BookSelectButton"

    Then I see "BookSelectModal"
    And I see "BookToSelect289"
    And I see "BookToSelect589"

    When I tap "BookToSelect289"
    And I tap "DoSelectBook"

    Then I should have "CurrentBookTitle" equal "Кэрри"
    And I should have "ReadCount" equal "2"
    And I should have "WishCount" equal "1"
    And Book "289" is "n"

  Scenario: Open current reading book
    When I tap "CurrentThumbnail"
    Then I see "Details289"
    And I go back
