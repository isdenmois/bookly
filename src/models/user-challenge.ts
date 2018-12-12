import { types as t } from 'mobx-state-tree'

export const UserChallenge = t.model('UserChallenge', {
  year: t.identifierNumber,
  booksCount: t.number,
})
