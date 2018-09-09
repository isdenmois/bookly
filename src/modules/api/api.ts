import { ApiBase, endpoint } from './utlis';

const USER_AGENT = 'LiveLib/4.0.5/15040005 (SM-G965F; Android 8.0.0; API 26)';

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

api.query.session_id = '5bfdc211bb18f3645cff4ce36c8fdb68';
