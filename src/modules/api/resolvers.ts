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

const rest = (endpoint, mapFields = null, mapResult = null, method = 'get') => (root, args, ctx, info) => {
  let node = _.get(info, 'fieldNodes[0]'),
      fields = findFields(node, true)

  if (mapFields) {
    fields = mapFields(fields)
  }

  return endpoint[method]({...args, fields}).then(data => mapResult ? mapResult(data) : data).catch(() => null)
}

export default {
  Query: {
    userChallenge: rest(api.userChallenge, f => `user_challenge(${f})`, r => _.get(r, 'user_challenge')),
    userBooks: rest(api.userBooks),
    searchBooks: rest(api.books, f => f.replace(/count,books\(/, '').replace(/\)$/, ''), r => ({count: r.count, books: r.data})),
  },
  Mutation: {
    changeStatus: rest(api.myBook, f => f.replace('user_book_partial', 'user_book'), result => ({id: result.id, user_book_partial: result.user_book}), 'patch'),
  },
}
