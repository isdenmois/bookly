type DefaultFn<Params> = (params: Params) => Promise<any>;

export type Pagination<T> = T & { page: number };

export interface API<Params = any, Fn extends Function = DefaultFn<Params>> {
  /**
   * Creates GET request
   * @param url - URL
   * @param cache - allows save response to in-memory cache
   * @example api.get('/')
   * @example api.get('/', true)
   */
  get(url: string, cache?: boolean): Omit<this, 'get' | 'post' | 'put' | 'params'>;

  /**
   * Creates POST request
   * @param url - URL
   * @example api.post('/')
   */
  post(url: string): Omit<this, 'get' | 'post' | 'put'>;

  /**
   * Creates PUT request
   * @param url - URL
   * @example api.put('/')
   */
  put(url: string): Omit<this, 'get' | 'post' | 'put'>;

  /**
   * Defines Content-Type header for request
   * @default 'application/json'
   * @param type - header value
   * @example api.contentType('application/xml')
   */
  contentType(type: string): Omit<this, 'get' | 'post' | 'put' | 'contentType'>;

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
  query(param: string): Pick<this, 'query' | 'params' | 'mapBody'>;

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
  query(map: Function): Pick<this, 'query' | 'params' | 'mapBody'>;

  /**
   * Maps value and adds param to query params
   * @param param - param name
   * @param map - function that maps param value
   * @example
   * schema = api => api
   *   .get('/search')
   *   .query('q', q => q.trim.replace(' ', '+'))
   * search = createApi(schema)
   *
   * search({ q: 'stephen king ' }) // Will send request to /search?q=stephen+king
   */
  query(param: string, map: Function): Pick<this, 'query' | 'params' | 'mapBody'>;

  /**
   * Creates body from execute function arguments
   * @param param - function that creates body
   * @example
   * schema = api => api
   *   .post('/login')
   *   .params((login, password) => ({ login, password }))
   * login = createApi(schema)
   *
   * login('user', 'pass') // Will send request to /login with body: user=user&password=pass
   */
  params(param: Function): Pick<this, 'mapBody'>;

  /**
   * Map response with map schema
   * @param object - map schema
   * @example
   * api.mapBody({id: 'work_id'})
   */
  mapBody(object: any): Pick<this, never>;

  /**
   * Map response with function
   * @param fn - function
   * @example
   * api.mapBody(r => r.items.map(i => i.id))
   */
  mapBody(fn: Function): Pick<this, never>;
}

export class APIBuilder {
  method: string;
  url: string;
  cache: boolean;
  r: any = {};

  private m(method: string, url: string, cache?: boolean) {
    this.r.method = method;
    this.r.url = url;
    this.r.cache = cache;
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

  contentType(type: string) {
    this.r.contentType = type;
    return this;
  }

  redirect(redirect: RequestRedirect) {
    this.r.redirect = redirect;
    return this;
  }

  // query(param: string): this;
  // query(map: Function): this;
  // query(param: string, map: Function): this;
  query(param: any, map?: any) {
    // this.r.query =
    return this;
  }

  params(param: Function) {
    return this;
  }

  mapBody(mapBody: any) {
    this.r.mapBody = mapBody;
    return this;
  }
}
