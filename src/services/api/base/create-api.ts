import _ from 'lodash';
import { ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { inject } from 'services/inject/inject';
import { Navigation } from 'services/navigation';
import { Session } from 'services/session';
import { createUrl, getUrlParams } from './create-url';
import { createFetchParams } from './create-params';
import { parseResult } from './parse-result';
import { Schema } from './api';

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

export function removeFromCache(url: string) {
  for (let key of cacheStore.keys()) {
    if (key.includes(url)) {
      cacheStore.delete(key);
    }
  }

  if (__DEV__) {
    const cache = {};
    cacheStore.forEach((value, u) => (cache[u] = value));
    AsyncStorage.setItem('DEV_API_CACHE', JSON.stringify(cache));
  }
}

export function createApi<T extends Function>(baseUrl: string, schema: Schema): T {
  return function(...args) {
    const query = createQuery(schema.url, schema.query, args);
    const body = schema.body ? schema.body.apply(null, args) : args[0]?.body;
    const url = `${schema.baseUrl || baseUrl}${createUrl(schema.url, query || {})}`;

    return sendReq(schema, body, url);
  } as any;
}

function createQuery(url, query, args) {
  if (typeof query === 'function') {
    return query.apply(null, args);
  }
  const urlParams = getUrlParams(url).concat('page');

  if (Array.isArray(query)) {
    return _.pick(args[0], query.concat(urlParams));
  }

  const result = _.pick(args[0], urlParams);

  _.forEach(query, (value, key) => {
    if (!args[0][key] && !args[0][value]) return;

    if (typeof value === 'function') {
      result[key] = value(args[0][key]);
    } else {
      result[key] = args[0][value];
    }
  });

  return result;
}

function sendReq(schema: Schema, body, url) {
  if (schema.cache && cacheStore.has(url)) {
    return parseResult(schema, cacheStore.get(url));
  }

  return fetchData(url, schema, body)
    .then(r => !schema.notParse && r.json())
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

function fetchData(url, schema: Schema, body) {
  if (schema.needAuth && !inject(Session).fantlabAuth) {
    return auth(url, schema, body);
  }

  return fetch(url, createFetchParams(schema, body)).then(r => handleErrors(r, schema, body, url));
}

function handleErrors(response, schema: Schema, body, url) {
  if (!response.ok && schema.needAuth) {
    return auth(url, schema, body);
  }

  if (!response.ok) {
    // TODO: show errors
    const error = _.includes(response.headers.get('content-type'), 'application/json')
      ? response.json()
      : response.text();

    return error.then(e => Promise.reject(e));
  }

  return response;
}

function auth(url, schema: Schema, body) {
  return new Promise((resolve, onClose) => {
    const onSuccess = () => fetchData(url, schema, body).then(resolve);

    inject(Navigation).navigate('/modal/fantlab-login', { onSuccess, onClose });
  });
}
