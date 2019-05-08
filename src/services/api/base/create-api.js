import _ from 'lodash';
import { createUrl } from './create-url';
import { createFetchParams } from './create-params';
import { parseResult } from './parse-result';

export function createApi(context, baseUrl, schema) {
  return function(...args) {
    const params = schema.mapParams ? schema.mapParams.apply(null, args) : {};
    const url = createUrl(`${baseUrl}${schema.url}`, context, params.query || {});

    return fetch(url, createFetchParams(schema, params.body)).then(parseResult(context, schema));
  };
}
