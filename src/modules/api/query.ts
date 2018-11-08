import { sessionStore, store } from 'services/store'
import { graphql } from 'react-apollo'

export const api: any = (query, mapParams) => (graphql as any)(query, {options: pickOptions(mapParams), props: pickProps})

function pickOptions(mapParams) {
  return props => ({variables: mapParams(props, sessionStore)})
}

function pickProps({ data }) {
  return data
}
