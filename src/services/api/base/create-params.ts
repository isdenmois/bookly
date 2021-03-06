import { Platform } from 'react-native';
import { settings } from 'services/settings';
import { queryParams } from './create-url';
import { Schema } from './api';

export function createFetchParams(schema: Schema, body) {
  const params: any = {
    method: schema.method,
  };

  params.headers = schema.headers || {};
  if (Platform.OS !== 'web') {
    params.headers['User-Agent'] = 'LiveLib/4.0.5/15040005 (SM-G965F; Android 8.0.0; API 26)';
  }

  if (schema.needAuth || (schema.passiveAuth && settings.fantlabAuth)) {
    params.headers.Cookie = `fl_s=${settings.fantlabAuth}`;
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
