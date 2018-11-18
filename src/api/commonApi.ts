import { API_KEY, USER_AGENT } from 'react-native-dotenv'
import { ApiBase, endpoint } from './utlis'

class CommonApi extends ApiBase {
  login = endpoint('/login', {method: 'POST'})
}

export const commonApi = new CommonApi()
commonApi.build()
