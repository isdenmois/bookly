import _ from 'lodash';
import { ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
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

export function createApi(context, schema) {
  return function(...args) {
    const params = schema.mapParams ? schema.mapParams.apply(null, args) : {};
    const url = `${context.baseUrl}${createUrl(schema.url, params.query || {})}`;

    return sendReq(schema, params, url);
  };
}

function sendReq(schema, params, url) {
  if (schema.cache && cacheStore.has(url)) {
    return parseResult(schema, cacheStore.get(url));
  }

  return fetch(url, createFetchParams(schema, params.body))
    .then(r => r.json())
    .then(data => {
      if (schema.cache) {
        cacheStore.set(url, data);
      }

      if (schema.cache && __DEV__) {
        const cache = {};
        cacheStore.forEach((value, url) => (cache[url] = value));
        AsyncStorage.setItem('DEV_API_CACHE', JSON.stringify(cache));
      }

      return data;
    })
    .then(response => parseResult(schema, response));
}
