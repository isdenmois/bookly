import _ from 'lodash';
import { createUrl } from './create-url';
import { createFetchParams } from './create-params';
import { parseResult } from './parse-result';

const cacheStore = new Map();

export function createApi(context, schema) {
  return function(...args) {
    const params = schema.mapParams ? schema.mapParams.apply(null, args) : {};
    const url = createUrl(`${context.baseUrl}${schema.url}`, context, params.query || {});

    return sendReq(context, schema, params, url);
  };
}

function sendReq(context, schema, params, url) {
  if (schema.cache && cacheStore.has(url)) {
    console.log('Cache HIT: ', url);

    return parseResult(context, schema, cacheStore.get(url));
  }

  if (schema.cache) {
    console.log('Cache MISS: ', url);
  }

  return fetch(url, createFetchParams(schema, params.body))
    .then(r => r.json())
    .then(data => {
      if (schema.cache) {
        cacheStore.set(url, data);
      }

      return data;
    })
    .then(response => parseResult(context, schema, response));
}
