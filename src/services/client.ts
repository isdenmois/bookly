import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createBridgeLink } from 'apollo-bridge-link'
import resolvers from 'api/resolvers'

const schema = require('../../dev-tools/schema.graphqls')

const link = createBridgeLink({
  schema,
  resolvers,
})

const cache = new InMemoryCache({ addTypename: true })

export const client = new ApolloClient({ link, cache })
