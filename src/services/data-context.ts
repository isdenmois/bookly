import { Instance, unprotect } from 'mobx-state-tree'
import Models from 'models'

export class DataContext {
  static create() {
    const store = Models.create({})

    if (__DEV__) {
      const makeInspectable = require('mobx-devtools-mst').default

      makeInspectable(store)
    }

    unprotect(store)

    return store
  }
}

export interface DataContext extends Instance<typeof Models> {}
