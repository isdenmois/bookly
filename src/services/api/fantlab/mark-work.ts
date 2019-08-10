import { FANTLAB_LOGIN_URL } from 'services/config';

export const baseUrl = FANTLAB_LOGIN_URL;

export const url = '/work:bookId/ajaxsetmark:{mark}towork:bookId';

export const needAuth = true;

export function mapParams({ bookId, mark }) {
  return {
    query: { bookId, mark },
  };
}
