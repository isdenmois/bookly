import _ from 'lodash';

/**
 * Создает URL строку.
 */
export function createUrl(url, context, params) {
  const [urlStr, restParams] = replaceUrlParams(url.replace(':userId', context.session.userId), params);

  return _.isEmpty(restParams) ? urlStr : `${urlStr}?${queryParams(restParams)}`;
}

/**
 * Заменяет параметры в URL
 */
function replaceUrlParams(url, params) {
  const urlParams = (url.match(/:([\w]+)/g) || []).map(str => str.slice(1));

  urlParams.forEach(param => {
    url = url.replace(`:${param}`, params[param]);
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
