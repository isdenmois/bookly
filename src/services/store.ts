import { SessionStore } from 'services/session.store'
import { BookStore } from 'views/book/book.store'
import { LoginStore } from 'views/login/login.store'

export const sessionStore = new SessionStore()
export const store = {
  sessionStore,
  bookStore: new BookStore(),
  loginStore: new LoginStore(sessionStore),
}
