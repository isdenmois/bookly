Feature: Login
  Scenario: User is not existed
    When I enter "bad" username
    Then I don't see home screen
    Then I see login field

  Scenario: User existed
    When I enter "e2e" username
    Then I don't see login field
    Then I see home screen
