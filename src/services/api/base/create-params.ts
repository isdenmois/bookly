import _ from 'lodash';
import { inject } from 'services/inject/inject';
import { Session } from 'services/session';

export function createFetchParams(schema, body) {
  const params: any = {
    method: schema.method || 'GET',
  };

  params.headers = _.invoke(schema, 'headers') || {};

  if (schema.contentType) {
    params.headers['Content-Type'] = schema.contentType;
  }

  if (schema.needAuth) {
    params.headers.Cookie = `fl_s=${inject(Session).fantlabAuth}`;
  }

  if (schema.redirect) {
    params.redirect = schema.redirect;
  }

  if (body) {
    params.body = params.headers['Content-Type'] === 'application/json' ? JSON.stringify(body) : body;
  }

  return params;
}
