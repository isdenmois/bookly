import { createApi } from './create-api';

type DefaultFn<Params> = (params: Params) => Promise<any>;

export type Pagination<T> = T & { page: number };

interface ApiCreator {
  /**
   * Creates GET request
   * @param url - URL
   * @param cache - allows save response to in-memory cache
   * @example api.get('/')
   * @example api.get('/', true)
   */
  get<T extends Function>(url: string, cache?: boolean): API<T>;
  get<T>(url: string, cache?: boolean): API<DefaultFn<T>>;

  /**
   * Creates POST request
   * @param url - URL
   * @example api.post('/')
   */
  post<T extends Function>(url: string): API<T>;

  /**
   * Creates PUT request
   * @param url - URL
   * @example api.put('/')
   */
  put<T extends Function>(url: string): API<T>;
}

export const api: ApiCreator = {
  get(url, cache) {
    return new APIBuilder('GET', url, cache);
  },
  post(url) {
    return new APIBuilder('POST', url);
  },
  put(url) {
    return new APIBuilder('PUT', url);
  },
} as any;

export interface API<Fn extends Function> {
  /**
   * Defines Content-Type header for request
   * @default 'application/json'
   * @param type - header value
   * @example api.get('/').contentType('application/xml')
   */
  contentType(type: string): this;

  /**
   * Marks schema as auth required
   * @example api.get('/').withAuth()
   */
  withAuth(): this;

  /**
   * Sets request redirect options for fetch
   * @param redirect - header value
   * @example api.get('/').redirect('manual')
   */
  redirect(redirect: RequestRedirect): this;

  /**
   * Adds param to query params
   * @param param - param name
   * @example
   * getWork = createApi(api.get('/work').query('id'))
   *
   * getWork({id: 1, q: 2}) // Will send request to /work?id=1 and ignore q param
   */
  query(param: string): this;

  /**
   * Creates query params from execute function arguments
   * @param param - function that creates query params
   * @example
   * schema = api
   *   .get('/login')
   *   .query((login, password) => ({ login, password }))
   * login = createApi(schema)
   *
   * login('user', 'pass') // Will send request to /login?user=user&password=pass
   */
  query(map: Function): this;

  /**
   * Picks fields
   * @param fields - fields list to pick
   * @example
   * api
   *   .get('/search')
   *   .query(['bookId', 'sort'])
   */
  query(fields: string[]): this;

  /**
   * Maps value and adds param to query params
   * @param param - param name
   * @param map - function that maps param value
   * @example
   * schema = api
   *   .get('/search')
   *   .query('q', q => q.trim().replace(' ', '+'))
   * search = createApi(schema)
   *
   * search({ q: 'stephen king ' }) // Will send request to /search?q=stephen+king
   */
  query(param: string, map: Function): this;

  /**
   * Creates body from execute function arguments
   * @param map - function that creates body
   * @example
   * schema = api
   *   .post('/login')
   *   .body((login, password) => ({ login, password }))
   * login = createApi(schema)
   *
   * login('user', 'pass') // Will send request to /login with body: user=user&password=pass
   */
  body(map: Function): this;

  /**
   * Filters array before response mapping
   * @param predicate - Filter predicate
   */
  filterBefore(predicate: Function | string | any): this;

  /**
   * Map response with map schema
   * @param object - map schema
   * @example
   * api.get('/').response({id: 'work_id'})
   */
  response(object: any): this;

  /**
   * Map response with function
   * @param fn - function
   * @example
   * api.get('/').response(r => r.items.map(i => i.id))
   */
  response(fn: Function): this;

  /**
   * Filter mapped result
   * @param fn - Filter predicate
   * @example
   * schema = api
   *   .get('/books')
   *   .filter('thumbnail') // Only books with thumbnail
   * @example
   * schema = api
   *   .get('/books')
   *   .filter({type: 'novel'}) // Only novels
   * @example
   * schema = api
   *   .get('/books')
   *   .filter(b => b.year > 2000) // Only books published after 2000
   */
  filter(predicate: Function | string | any): this;

  create(baseUrl: string): Fn;
}

export interface Schema {
  baseUrl?: string;
  method: string;
  url: string;
  cache?: boolean;
  headers?: HeadersInit;
  redirect?: RequestRedirect;
  response?: any | Function;
  query?: any | Function;
  body?: Function;
  needAuth?: boolean;
  filter?: Function;
  filterBefore?: Function;
}

class APIBuilder {
  r: Schema = {} as any;

  constructor(method: string, url: string, cache?: boolean) {
    this.r.method = method;
    this.r.url = url;
    this.r.cache = cache;
  }

  baseUrl(url: string) {
    this.r.baseUrl = url;
    return this;
  }

  withAuth(): this {
    this.r.needAuth = true;
    return this;
  }

  contentType(type: string) {
    this.r.headers = this.r.headers || {};
    this.r.headers['Content-Type'] = type;
    return this;
  }

  redirect(redirect: RequestRedirect) {
    this.r.redirect = redirect;
    return this;
  }

  query(param: any, map?: any) {
    if (typeof param === 'function' || Array.isArray(param)) {
      this.r.query = param;
      return this;
    }
    this.r.query = this.r.query || {};
    this.r.query[param] = map || param;

    return this;
  }

  body(map: Function) {
    this.r.body = map;
    return this;
  }

  response(map: any) {
    this.r.response = map;
    return this;
  }

  filter(fn: Function) {
    this.r.filter = fn;
    return this;
  }

  filterBefore(fn: Function) {
    this.r.filterBefore = fn;
    return this;
  }

  create(baseUrl: string) {
    return createApi(baseUrl, this.r);
  }
}
