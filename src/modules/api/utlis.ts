import * as _ from 'lodash'
import { Alert } from 'react-native'
import { BASE_URL, DEV_URL } from 'react-native-dotenv'

export interface QueryParams {
  [index: string]: any
}

function queryParams(data: QueryParams = {}) {
  return Object.keys(data).map((key) => {
    const value = data[key]

    if (Array.isArray(value)) {
      const k = `${key}[]`
      const v = value.map(encodeURIComponent).join(`&${k}=`)

      return `${k}=${v}`
    }

    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
  }).join('&')
}

function fetchFn(fetch: Function, method, baseUrl, headers, query, body, list) {
  const params = (baseUrl.match(/:([\w]+)/g) || []).map(str => str.slice(1)),
        fetchParams: RequestInit = {headers, method}

  let urlStr = baseUrl

  _.forEach(params, param => {
    urlStr = urlStr.replace(`:${param}`, query[param])
  })

  const url = `${__DEV__ ? DEV_URL : BASE_URL}${urlStr}?${queryParams(_.omit(query, params))}`

  if (body) {
    fetchParams.body = body
  }

  return fetch(url, fetchParams)
    .then(res => res.json())
    .then(res => {
      if (res.status.message !== 'OK') {
        return Promise.reject(res.error)
      }

      return list ? {data: res.data, count: res.count} : res.data
    })
    .catch(error => {
      // TODO: вынести в отдельный модуль
      Alert.alert(`Ошибка при выполнении запроса: ${urlStr}`, JSON.stringify(error))

      return Promise.reject(error)
    })
}

export function endpoint(t: any, url: string, methods: string[] = ['get'], list = false): any {
  const result = {
    urlParams: (url.match(/:(\w)+/g) || []).map(s => s.slice(1)),
  }

  _.forEach(methods, method => {
    result[method.toLowerCase()] = (query, body) => fetchFn(t.fetch, method.toUpperCase(), url, t.headers, {...query, ...t.query}, body, list)
  })

  return result
}

export class ApiBase {
  fetch        = fetch
  headers: any = {}
  query: any   = {}
}
