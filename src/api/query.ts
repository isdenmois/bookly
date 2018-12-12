import { graphql } from 'react-apollo'

export const api: any = (query, mapParams) => (graphql as any)(query, {options: pickOptions(mapParams), props: pickProps})

function pickOptions(mapParams) {
  return props => ({variables: mapParams(props)})
}

function pickProps({ data }) {
  return data
}
