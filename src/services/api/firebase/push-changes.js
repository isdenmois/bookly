export const url = '/:userId';

export const method = 'POST';

export const contentType = 'application/json';

export function mapParams(sync, body) {
  return {
    query: { sync },
    body
  };
}
