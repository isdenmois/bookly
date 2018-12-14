import { types as t, Instance, getSnapshot, getRoot } from 'mobx-state-tree'
import { firebase } from 'api/firebase'

export const Author = t.model('Author', {
  id: t.identifierNumber,
  name: t.string,
  saved: t.optional(t.boolean, false),
})
  .actions(self => ({
    save() {
      if (self.saved) return false

      const data = getSnapshot(self),
            root: any = getRoot(self)

      self.saved = true
      firebase.authorSave(root.user, data)
    },
  }))

export type Author = Instance<typeof Author>
