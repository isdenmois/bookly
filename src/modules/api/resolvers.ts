import * as _ from 'lodash'
import { api } from './api'

const findFields = (node, first?: boolean): string => {
  const name = _.get(node, 'name.value'),
        children = _.get(node, 'selectionSet.selections')

  if (!_.isEmpty(children)) {
    let fields: any = children.map(n => findFields(n))

    fields = _.without(fields, '__typename').join(',')

    return first ? fields : `${name}(${fields})`
  }

  return name
}

const rest = (endpoint) => (root, args, ctx, info) => {
  let node = _.get(info, 'fieldNodes[0]'),
      fields = findFields(node, true)

  return endpoint.method === 'GET' ? endpoint(args, fields).catch(() => null) : endpoint(args, fields)
}

export default {
  Query: {
    userChallenge: rest(api.userChallenge),
    userBooks: rest(api.userBooks),
    searchBooks: rest(api.books),
  },
  Mutation: {
    changeStatus: rest(api.updateBook),
  },
}
