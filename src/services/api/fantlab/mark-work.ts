import { FANTLAB_LOGIN_URL } from 'services/config';
import { API } from '../base/api';

type MarkWork = (bookId: string, mark: number) => Promise<void>;

export default (api: API<any, MarkWork>) =>
  api
    .baseUrl(FANTLAB_LOGIN_URL)
    .get('/work:bookId/ajaxsetmark:{mark}towork:bookId')
    .withAuth()
    .query((bookId: string, mark: number) => ({ bookId, mark }));
