import { action, observable } from 'mobx'
import { inject } from 'react-ioc'
import { DataContext } from './data-context'
import { Storage } from './storage'

const SESSION_KEY = 'SESSION_KEY'

export class Session {
  @observable userId: string    = null

  storage = inject(this, Storage)
  dataContext = inject(this, DataContext)

  @action loadSession() {
    return this.storage.getItem(SESSION_KEY)
      .then(session => JSON.parse(session))
      .then(session => this.setSession(session.userId))
      .catch(error => console.warn(error))
  }

  @action setSession(userId: string = null) {
    const session = JSON.stringify({userId})

    this.userId = userId

    this.storage.setItem(SESSION_KEY, session)

    if (userId) {
      return this.dataContext.restore(userId)
    }
  }

  @action stopSession() {
    this.userId = null

    return this.storage.clear()
  }
}
