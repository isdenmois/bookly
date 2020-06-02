Feature: Login
  Scenario: User is not existed
    When I entered "bad" username
    Then I don't see "Home"
    Then I see "Login"

  Scenario: User existed
    When I entered "e2e" username
    Then I don't see "Login"
    Then I see "Home"
