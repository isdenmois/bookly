import { API_KEY, USER_AGENT } from 'react-native-dotenv'
import { ApiBase, endpoint } from './utlis'

class Api extends ApiBase {
  headers    = {
    'User-Agent': USER_AGENT,
  }
  query: any = {
    andyll: API_KEY,
  }

  @endpoint('/books') books
  @endpoint('/books/:bookId') book
  @endpoint('/users/:user/books/:type') userBooks
}

export const api = new Api()
