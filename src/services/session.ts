import { action, observable } from 'mobx'
import { inject } from 'react-ioc'
import { Storage } from './storage'

import { api } from 'api'

const SESSION_KEY = 'SESSION_KEY'

export class Session {
  @observable userId: string    = null

  storage = inject(this, Storage)

  @action loadSession() {
    return this.storage.getItem(SESSION_KEY)
      .then(session => JSON.parse(session))
      .then(session => this.setSession(session.userId))
      .catch(error => console.warn(error))
  }

  @action setSession(userId: string = null) {
    const session = JSON.stringify({userId})

    this.userId = userId

    return this.storage.setItem(SESSION_KEY, session)
  }

  @action stopSession() {
    api.query.session_id = null
    return this.storage.removeItem(SESSION_KEY)
  }
}
