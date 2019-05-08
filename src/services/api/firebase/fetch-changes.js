export const url = '/:userId';

export function mapParams(sync) {
  return {
    query: { sync },
  };
}
