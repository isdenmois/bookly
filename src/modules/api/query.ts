import * as _ from 'lodash'
import * as React from 'react'
import * as nearley from 'nearley'
import { api as endpoints } from './api'
import * as grammar from './query-parser'
import { sessionStore, store } from 'services/store'

export function gql(literals) {
  const r = literals.join().trim().replace(/\s+/g, ' '),
        parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))

  parser.feed(r)

  return parser.results[0]
}

const events = {}

function subscribe(event, fn) {
  events[event] = events[event] || []
  events[event].push(fn)

  return () => event[event] = _.without(event[event], fn)
}

export function trigger(event) {
  _.forEach(events[event], e => e())
}

export function api(params: any) {
  const endpnts = params.query.map(q => q.endpoint)

  return function (component: any): any {
    class ApiQueryContainer extends React.Component<any> {
      static navigationOptions = component.navigationOptions

      state = {
        isLoaded: false,
        loading: true,
      }

      offs = []

      componentDidMount() {
        this.loadData()
        this.offs = _.map(params.query, query => subscribe(query.endpoint, () => this.reloadQuery(query)))
      }

      componentWillUnmount() {
        _.flow(this.offs)()
      }

      render() {
        return React.createElement(component, {
          ...this.props,
          ...store.cacheStore.getValues(endpnts),
          refresh: this.loadData,
          isLoaded: this.state.isLoaded,
          loading: this.state.loading,
        })
      }

      reloadQuery(query) {
        const p = params.params(this.props, {}, sessionStore)

        return this.fetchQuery(query, p)
      }

      loadData = () => {
        const p = params.params(this.props, {}, sessionStore)

        this.setState({loading: true})

        return Promise
          .all(params.query.map(q => this.fetchQuery(q, p)))
          .then(() => this.setState({loading: false, isLoaded: true}))
      }

      fetchQuery(query, p) {
        const endpoint = endpoints[query.endpoint],
              queryParams = _.concat([], endpoint.urlParams, query.params)

        return endpoint
          .get({..._.pick(p, queryParams), fields: query.fields})
          .then(data => _.has(data, query.endpoint) ? data[query.endpoint] : data)
          .then(data => store.cacheStore.setValue(query.endpoint, data))
          .catch(() => null)
      }
    }

    return ApiQueryContainer
  }
}

export class Mutation {
  public trigger: string[]
  public endpoint: string
  public method: string = 'patch'

  constructor(public params) {
  }

  optimisticUpdate(cache: any) {
    // Do nothing
  }

  cacheUpdate(cache: any, result: any) {
    // Do nothing
  }
}

export async function update(mutation: Mutation) {
  mutation.optimisticUpdate(store.cacheStore)

  const result = await endpoints[mutation.endpoint][mutation.method](mutation.params)

  mutation.cacheUpdate(store.cacheStore, result)
  _.forEach(mutation.trigger, trigger)
}
