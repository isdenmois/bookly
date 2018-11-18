import { SessionStore } from 'services/SessionStore'
import { BookStore } from 'views/book/BookStore'
import { LoginStore } from 'views/login/LoginStore'

export const sessionStore = new SessionStore()
export const store = {
  sessionStore,
  bookStore: new BookStore(),
  loginStore: new LoginStore(sessionStore),
}
