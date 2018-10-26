import { action, observable } from 'mobx'
import { AsyncStorage } from 'react-native'

import { api } from 'modules/api/api'

const SESSION_KEY = 'SESSION_KEY'

export class SessionStore {
  @observable sessionId: string = null
  @observable userId: string    = null

  @action loadSession() {
    return AsyncStorage.getItem(SESSION_KEY)
      .then(session => JSON.parse(session))
      .then(session => this.setSession(session.sessionId, session.userId))
      .catch(error => console.warn(error))
  }

  @action setSession(sessionId: string, userId: string = null) {
    const session = JSON.stringify({sessionId, userId})

    this.sessionId       = sessionId
    this.userId          = userId
    api.query.session_id = sessionId

    return AsyncStorage.setItem(SESSION_KEY, session)
  }

  @action stopSession() {
    return AsyncStorage.removeItem(SESSION_KEY)
  }
}
