type DefaultFn<Params> = (params: Params) => Promise<any>;

export type Pagination<T> = T & { page: number };
export type ApiDefinition<Result extends Function> = (api: API<any, Result>) => any;

export interface API<Params = any, Fn extends Function = DefaultFn<Params>> {
  /**
   * Overrides base url
   * @param url - URL
   * @example api.baseUrl('http://localhost').get('/status')
   */
  baseUrl(url: string): Omit<this, 'baseUrl'>;

  /**
   * Creates GET request
   * @param url - URL
   * @param cache - allows save response to in-memory cache
   * @example api.get('/')
   * @example api.get('/', true)
   */
  get(url: string, cache?: boolean): Omit<this, 'get' | 'post' | 'put' | 'body' | 'baseUrl'>;

  /**
   * Creates POST request
   * @param url - URL
   * @example api.post('/')
   */
  post(url: string): Omit<this, 'get' | 'post' | 'put' | 'baseUrl'>;

  /**
   * Creates PUT request
   * @param url - URL
   * @example api.put('/')
   */
  put(url: string): Omit<this, 'get' | 'post' | 'put' | 'baseUrl'>;

  /**
   * Defines Content-Type header for request
   * @default 'application/json'
   * @param type - header value
   * @example api.contentType('application/xml')
   */
  contentType(type: string): Omit<this, 'get' | 'post' | 'put' | 'contentType' | 'baseUrl'>;

  /**
   * Marks schema as auth required
   */
  withAuth(): Omit<this, 'get' | 'post' | 'put' | 'contentType' | 'baseUrl' | 'withAuth'>;

  /**
   * Sets request redirect options for fetch
   * @param redirect - header value
   * @example api.redirect('manual')
   */
  redirect(redirect: RequestRedirect): Omit<this, 'get' | 'post' | 'put' | 'redirect'>;

  /**
   * Adds param to query params
   * @param param - param name
   * @example
   * getWork = createApi(api => api.get('/work').query('id'))
   *
   * getWork({id: 1, q: 2}) // Will send request to /work?id=1 and ignore q param
   */
  query(param: string): Pick<this, 'query' | 'body' | 'response' | 'filterBefore' | 'filter'>;

  /**
   * Creates query params from execute function arguments
   * @param param - function that creates query params
   * @example
   * schema = api => api
   *   .get('/login')
   *   .query((login, password) => ({ login, password }))
   * login = createApi(schema)
   *
   * login('user', 'pass') // Will send request to /login?user=user&password=pass
   */
  query(map: Function): Pick<this, 'query' | 'body' | 'response' | 'filterBefore' | 'filter'>;

  /**
   * Picks fields
   * @param fields - fields list to pick
   * @example
   * api
   *   .get('/search')
   *   .query(['bookId', 'sort'])
   */
  query(fields: string[]): Pick<this, 'query' | 'body' | 'response' | 'filterBefore' | 'filter'>;

  /**
   * Maps value and adds param to query params
   * @param param - param name
   * @param map - function that maps param value
   * @example
   * schema = api => api
   *   .get('/search')
   *   .query('q', q => q.trim().replace(' ', '+'))
   * search = createApi(schema)
   *
   * search({ q: 'stephen king ' }) // Will send request to /search?q=stephen+king
   */
  query(param: string, map: Function): Pick<this, 'query' | 'body' | 'response' | 'filterBefore' | 'filter'>;

  /**
   * Creates body from execute function arguments
   * @param map - function that creates body
   * @example
   * schema = api => api
   *   .post('/login')
   *   .body((login, password) => ({ login, password }))
   * login = createApi(schema)
   *
   * login('user', 'pass') // Will send request to /login with body: user=user&password=pass
   */
  body(map: Function): Pick<this, 'response' | 'filterBefore' | 'filter'>;

  /**
   * Filters array before response mapping
   * @param predicate - Filter predicate
   */
  filterBefore(predicate: Function | string | any): Pick<this, 'response' | 'filter'>;

  /**
   * Map response with map schema
   * @param object - map schema
   * @example
   * api.response({id: 'work_id'})
   */
  response(object: any): Pick<this, 'filter'>;

  /**
   * Map response with function
   * @param fn - function
   * @example
   * api.response(r => r.items.map(i => i.id))
   */
  response(fn: Function): Pick<this, 'filter'>;

  /**
   * Filter mapped result
   * @param fn - Filter predicate
   * @example
   * schema = api => api
   *   .get('/books')
   *   .filter('thumbnail') // Only books with thumbnail
   * @example
   * schema = api => api
   *   .get('/books')
   *   .filter({type: 'novel'}) // Only novels
   * @example
   * schema = api => api
   *   .get('/books')
   *   .filter(b => b.year > 2000) // Only books published after 2000
   */
  filter(predicate: Function | string | any): Pick<this, never>;
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

export class APIBuilder {
  r: Schema = {} as any;

  private m(method: string, url: string, cache?: boolean) {
    this.r.method = method;
    this.r.url = url;
    this.r.cache = cache;
    return this;
  }

  baseUrl(url: string) {
    this.r.baseUrl = url;
    return this;
  }

  get(url: string, cache?: boolean) {
    return this.m('GET', url, cache);
  }

  post(url: string): this {
    return this.m('POST', url);
  }

  put(url: string): this {
    return this.m('PUT', url);
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

  create() {
    return this.r;
  }
}
