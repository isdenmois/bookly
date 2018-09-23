import { USER_AGENT, API_KEY } from 'react-native-dotenv';
import { ApiBase, endpoint } from './utlis';

class CommonApi extends ApiBase {
    headers = {
        'User-Agent': USER_AGENT,
    };
    query = {
        andyll: API_KEY,
    };

    @endpoint('/login') login;
}

export const commonApi = new CommonApi();
