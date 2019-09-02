import { FANTLAB_LOGIN_URL } from 'services/config';
import { api } from '../base/api';

type MarkWork = (bookId: string, mark: number) => Promise<void>;

export default api
  .get<MarkWork>('/work:bookId/ajaxsetmark:{mark}towork:bookId')
  .baseUrl(FANTLAB_LOGIN_URL)
  .withAuth()
  .query((bookId: string, mark: number) => ({ bookId, mark }));
