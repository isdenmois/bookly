import { types as t, Instance } from 'mobx-state-tree'

export const Author = t.model('Author', {
  id: t.identifier,
  name: t.string,
})

export type Author = Instance<typeof Author>
