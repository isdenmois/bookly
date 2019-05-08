export const url = '/:userId';

export const method = 'POST';

export const contentType = 'application/json';

export function mapParams(sync, changes) {
  return {
    query: { sync },
    body: changes,
  };
}
