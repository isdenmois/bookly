import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createBridgeLink } from 'apollo-bridge-link'
import resolvers from 'api/resolvers'
import schema from './schema'

const link = createBridgeLink({
  schema,
  resolvers,
  mock: true,
})

const cache = new InMemoryCache({ addTypename: true })

export const client = new ApolloClient({
  link,
  cache,
  connectToDevTools: true,
  queryDeduplication: true,
})
