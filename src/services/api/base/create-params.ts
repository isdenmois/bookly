import _ from 'lodash';
import { inject } from 'services/inject/inject';
import { Session } from 'services/session';
import { queryParams } from './create-url';
import { Schema } from './api';

export function createFetchParams(schema: Schema, body) {
  const params: any = {
    method: schema.method,
  };

  params.headers = _.get(schema, 'headers') || {};

  if (schema.needAuth) {
    params.headers.Cookie = `fl_s=${inject(Session).fantlabAuth}`;
  }

  if (schema.redirect) {
    params.redirect = schema.redirect;
  }

  if (body && params.headers['Content-Type'] === 'application/json') {
    params.body = JSON.stringify(body);
  }

  if (body && params.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    params.body = queryParams(body);
  }

  return params;
}
