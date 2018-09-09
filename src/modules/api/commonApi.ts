import { ApiBase, endpoint } from './utlis';

const USER_AGENT = 'LiveLib/4.0.5/15040005 (SM-G965F; Android 8.0.0; API 26)';

const API_KEY = 'and7mpp4ss';

class CommonApi extends ApiBase {
}

const publicHeaders = {
        'User-Agent': USER_AGENT,
    },
    publicQuery = {
        andyll: API_KEY,
    },
    commonApi = new CommonApi(publicHeaders, publicQuery);

export { commonApi };
