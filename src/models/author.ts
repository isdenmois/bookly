import { types as t, Instance, getSnapshot, getRoot } from 'mobx-state-tree'
import { firebase } from 'api/firebase'

export const Author = t.model('Author', {
  id: t.identifierNumber,
  name: t.string,
  sync: t.optional(t.Date, 0),
})
  .views(self => ({
    get saved() {
      return (self.sync as any) > 0
    },
  }))
  .actions(self => ({
    save() {
      if (self.saved) return false

      const data = getSnapshot(self),
            root: any = getRoot(self)

      self.sync = new Date()
      firebase.authorSave(root.user, data)
    },
  }))

export type Author = Instance<typeof Author>
