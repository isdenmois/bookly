import * as _ from 'lodash'
import { Alert } from 'react-native'
import { API_KEY, USER_AGENT, BASE_URL, DEV_URL } from 'react-native-dotenv'
import snakeCase from 'snakecase-keys'
import camelCase from 'camelcase-keys'

export interface QueryParams {
  [index: string]: any
}

interface EndpointParams {
  method: 'GET' | 'POST' | 'PATCH'
  list?: boolean
  fields?: (f: string) => string
  transform?: (r: any) => any
}

interface Endpoint extends EndpointParams {
  url: string
  queryParams: string[]
}

type Query<R, Q> = (query: Q, fields?: string) => Promise<R>

function queryParamsT(data: QueryParams = {}) {
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

function fetchFn(t: any, point: Endpoint, query, fields?: string) {
  const fetchParams: RequestInit = {
    method: point.method,
    headers: t.headers,
  }

  let urlStr = point.url

  _.forEach(point.queryParams, param => {
    urlStr = urlStr.replace(`:${param}`, query[param])
  })

  query.fields = point.fields ? point.fields(fields) : fields

  const queryParams = snakeCase({..._.omit(query, point.queryParams), ...t.query}, {deep: true}),
        queryString = queryParamsT(queryParams),
        url = `${__DEV__ ? DEV_URL : BASE_URL}${urlStr}?${queryString}`

  return fetch(url, fetchParams)
    .then(res => res.json())
    .then(res => {
      if (res.status.message !== 'OK') {
        return Promise.reject(res.error)
      }

      const data = camelCase(point.list ? {data: res.data, count: res.count} : res.data, {deep: true})

      return point.transform ? point.transform(data) : data
    })
    .catch(error => {
      // TODO: вынести в отдельный модуль
      Alert.alert(`Ошибка при выполнении запроса: ${urlStr}`, JSON.stringify(error))

      return Promise.reject(error)
    })
}

export function endpoint<Q = any, R = any>(url: string, params: EndpointParams = {method: 'GET'}): Query<Q, R> {
  const queryParams = (url.match(/:([\w]+)/g) || []).map(str => str.slice(1))

  return {...params, url, queryParams} as any
}

export class ApiBase {
  headers = {
    'User-Agent': USER_AGENT,
  }

  query: any = {
    andyll: API_KEY,
  }

  build() {
    _.forEach(this as any, (point, key) => {
      if (!point || !point.url) return undefined

      this[key] = (query, fields) => fetchFn(this, point, query, fields)
      this[key].method = point.method
    })
  }
}

function findFields(node, first?: boolean): string {
  const name = _.snakeCase(_.get(node, 'name.value')),
        children = _.get(node, 'selectionSet.selections')

  if (!_.isEmpty(children)) {
    let fields: any = children.map(n => findFields(n))

    fields = _.without(fields, '__typename').join(',')

    return first ? fields : `${name}(${fields})`
  }

  return name
}

export const rest = (e) => (root, args, ctx, info) => {
  let node = _.get(info, 'fieldNodes[0]'),
      fields = findFields(node, true)

  return e.method === 'GET' ? e(args, fields).catch(() => null) : e(args, fields)
}
