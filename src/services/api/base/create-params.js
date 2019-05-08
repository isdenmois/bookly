import _ from 'lodash';

export function createFetchParams(schema, body) {
  const params = {
    method: schema.method || 'GET',
  };

  params.headers = _.invoke(schema, 'headers') || {};

  if (schema.contentType) {
    params.headers['Content-Type'] = schema.contentType;
  }

  if (body) {
    params.body = params.headers['Content-Type'] === 'application/json' ? JSON.stringify(body) : body;
  }

  return params;
}
