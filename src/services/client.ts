import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createBridgeLink } from 'apollo-bridge-link'
import resolvers from 'api/resolvers'

export const REST = {rest: true}

const schema = require('../../dev-tools/schema.graphqls')

const restLink = createBridgeLink({
  schema,
  resolvers,
})

const graphLink = new HttpLink({ uri: 'http://192.168.1.135:4466/' })

const link = ApolloLink.split(o => o.getContext().rest, restLink, graphLink)

const cache = new InMemoryCache({ addTypename: true })

export const client = new ApolloClient({ link, cache })
