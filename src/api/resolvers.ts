import { api } from './api'
import { rest } from './utlis'

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
