import { API_KEY, USER_AGENT } from 'react-native-dotenv'
import { ApiBase, endpoint } from './utlis'

class CommonApi extends ApiBase {
  headers = {
    'User-Agent': USER_AGENT,
  }
  query   = {
    andyll: API_KEY,
  }

  @endpoint('/login', ['post']) login
}

export const commonApi = new CommonApi()
