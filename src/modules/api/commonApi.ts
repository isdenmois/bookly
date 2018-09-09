import { USER_AGENT, API_KEY } from 'react-native-dotenv';
import { ApiBase, endpoint } from './utlis';

class CommonApi extends ApiBase {
    @endpoint('/login') login;
}

const publicHeaders = {
        'User-Agent': USER_AGENT,
    },
    publicQuery = {
        andyll: API_KEY,
    },
    commonApi = new CommonApi(publicHeaders, publicQuery);

export { commonApi };
