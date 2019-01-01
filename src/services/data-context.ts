import { Instance, unprotect } from 'mobx-state-tree'
import Models from 'models'
import { Storage } from './storage'

export class DataContext {
  static create(storage: Storage) {
    const store = Models.create({sync: 0}, {storage})

    if (__DEV__) {
      const makeInspectable = require('mobx-devtools-mst').default

      makeInspectable(store)
    }

    unprotect(store)

    return store
  }
}

export interface DataContext extends Instance<typeof Models> {}
