import { API_KEY, USER_AGENT } from 'react-native-dotenv'
import { ApiBase, endpoint } from './utlis'

class Api extends ApiBase {
  headers    = {
    'User-Agent': USER_AGENT,
  }
  query: any = {
    andyll: API_KEY,
  }

  books = endpoint(this, '/books', ['get'], true)
  book = endpoint(this, '/books/:bookId')
  userBooks = endpoint(this, '/users/:user/books/:type')
  userChallenge = endpoint(this, '/challenges/:year/readers/:user')
  myBook = endpoint(this, '/me/books/:bookId', ['patch'])
}

export const api = new Api()
