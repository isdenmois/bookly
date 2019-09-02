import _ from 'lodash';
import { inject } from 'services/inject/inject';
import { Session } from 'services/session';

const PARAMS_REGEX = /:[{]?([\w]+)[}]?/g;
const DELIMITERS = /[:{}]+/g;

/**
 * Создает URL строку.
 */
export function createUrl(url: string, params) {
  if (url.includes(':userId')) {
    const session = inject(Session);

    url = url.replace(':userId', session.userId);
  }

  [url, params] = replaceUrlParams(url, params);

  return _.isEmpty(params) ? url : `${url}?${queryParams(params)}`;
}

/**
 * Заменяет параметры в URL
 */
function replaceUrlParams(url, params) {
  const urlParams: string[] = _.uniq((url.match(PARAMS_REGEX) || []).map(str => str.replace(DELIMITERS, '')));

  urlParams.forEach(param => {
    url = url.replace(new RegExp(`:[{]?${param}[}]?`, 'g'), params[param]);
  });

  return [url, _.omit(params, urlParams)];
}

/**
 * Формирует query-params
 */
function queryParams(params) {
  return Object.keys(params)
    .map(key => {
      const value = params[key];

      if (Array.isArray(value)) {
        const k = `${key}[]`;
        const v = value.map(encodeURIComponent).join(`&${k}=`);

        return `${k}=${v}`;
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');
}
