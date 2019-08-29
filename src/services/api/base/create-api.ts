import _ from 'lodash';
import { ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { inject } from 'services/inject/inject';
import { Navigation } from 'services/navigation';
import { Session } from 'services/session';
import { createUrl } from './create-url';
import { createFetchParams } from './create-params';
import { parseResult } from './parse-result';

const cacheStore = new Map();

if (__DEV__) {
  AsyncStorage.getItem('DEV_API_CACHE')
    .then(cache => JSON.parse(cache || '{}'))
    .then(cache => {
      _.forEach(cache, (value, url) => cacheStore.set(url, value));
    });
}

export function clearCache() {
  cacheStore.clear();
  AsyncStorage.removeItem('DEV_API_CACHE');
  ToastAndroid.show('Очищен API Cache', ToastAndroid.SHORT);
}

type Schema<P> = {
  url: string;
  method?: string;
  baseUrl?: string;
  contentType?: string;
  mapParams?: P;
  mapBody?: any;
  cache?: boolean;
  redirect?: string;
  [key: string]: any;
};

export function createApi<P>(context, schema: Schema<P>): P {
  const api = function(...args) {
    const params = schema.mapParams ? (schema.mapParams as any).apply(null, args) : {};
    const url = `${schema.baseUrl || context.baseUrl}${createUrl(schema.url, params.query || {})}`;

    return sendReq(schema, params, url);
  };

  api.schema = schema;

  return api as any;
}

function sendReq(schema, params, url) {
  if (schema.cache && cacheStore.has(url)) {
    return parseResult(schema, cacheStore.get(url));
  }

  return fetchData(url, schema, params)
    .then(r => r.json())
    .then(data => {
      if (schema.cache) {
        cacheStore.set(url, data);
      }

      if (schema.cache && __DEV__) {
        const cache = {};
        cacheStore.forEach((value, u) => (cache[u] = value));
        AsyncStorage.setItem('DEV_API_CACHE', JSON.stringify(cache));
      }

      return data;
    })
    .then(response => parseResult(schema, response));
}

function fetchData(url, schema, params) {
  if (schema.needAuth && !inject(Session).fantlabAuth) {
    return auth(url, schema, params);
  }

  return fetch(url, createFetchParams(schema, params.body)).then(r => handleErrors(r, schema, params, url));
}

function handleErrors(response, schema, params, url) {
  if (!response.ok && schema.needAuth) {
    return auth(url, schema, params);
  }

  return response;
}

function auth(url, schema, params) {
  return new Promise(resolve => {
    const onSuccess = () => fetchData(url, schema, params).then(resolve);

    inject(Navigation).navigate('/modal/fantlab-login', { onSuccess });
  });
}
