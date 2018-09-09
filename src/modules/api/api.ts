import { AsyncStorage } from 'react-native';
import { ApiBase, endpoint } from './utlis';

const USER_AGENT = 'LiveLib/4.0.5/15040005 (SM-G965F; Android 8.0.0; API 26)';
const SESSION_ID_KEY = 'SESSION_ID';
const API_KEY = 'and7mpp4ss';

class Api extends ApiBase {
    @endpoint('/books') books;
    @endpoint('/books/:bookId') book;
}

const privateHeaders = {
        'User-Agent': USER_AGENT,
      },
      privateQuery = {
        andyll: API_KEY,
      },
      api = new Api(privateHeaders, privateQuery);

export { api };

export async function loadSessionId() {
    try {
        const sessionId = await AsyncStorage.getItem(SESSION_ID_KEY);

        if (sessionId) {
            api.query.session_id = sessionId;
        }
    } catch (e) {
        // Do nothing.
    }
}

export function setSessionId(session_id: string) {
    api.query.session_id = session_id;
    return AsyncStorage.setItem(SESSION_ID_KEY, session_id);
}
