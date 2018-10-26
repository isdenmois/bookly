import { SessionStore } from 'services/SessionStore'
import { CacheStore } from 'services/CacheStore'
import { BookStore } from 'views/book/BookStore'
import { LoginStore } from 'views/login/LoginStore'

export const sessionStore = new SessionStore()
export const store = {
  sessionStore,
  cacheStore: new CacheStore(),
  bookStore: new BookStore(),
  loginStore: new LoginStore(sessionStore),
}
