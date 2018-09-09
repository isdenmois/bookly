import * as _ from 'lodash';

export interface QueryParams {
    [index: string]: any
}

const BASE_URL = 'https://livelib.ru/' + 'apiapp/v2.0';

function queryParams(data: QueryParams = {}) {
    return Object.keys(data).map((key) => {
        const value = data[key];

        if (Array.isArray(value)) {
            const k = `${key}[]`;
            const v = value.map(encodeURIComponent).join(`&${k}=`);

            return `${k}=${v}`;
        }

        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }).join('&');
}

function fetchFn(fetch: Function, method, baseUrl, headers, query) {
    const params = (baseUrl.match(/\:([\w]+)/g) || []).map(str => str.slice(1));

    let urlStr = baseUrl;

    _.forEach(params, param => {
        urlStr = urlStr.replace(`:${param}`, query[param]);
    });

    const url = `${BASE_URL}${urlStr}?${queryParams(_.omit(query, params))}`;

    return fetch(url, {headers, method})
        .then(res => res.json())
        .then(res => {
            if (res.status.message !== 'OK') {
                return Promise.reject(res);
            }

            return res.data;
        });
}

export function endpoint(url: string) {
    return function(target: any, propertyKey: string) {
        Object.defineProperty(target, propertyKey, {
            get: function () {
                return {
                    get: (query) => fetchFn(this.fetch, 'GET', url, this.headers, {...query, ...this.query}),
                };
            },
        });
    };
}

export class ApiBase {
    fetch = fetch;

    constructor(public headers: any = {}, public query: any = {}) {
    }
}
