import { action, observable } from 'mobx'
import { commonApi } from 'api'
import { SessionStore } from 'services/SessionStore'

export class LoginStore {
  constructor(private sessionStore: SessionStore) {
  }

  @observable login: string      = ''
  @observable password: string   = ''
  @observable submitting: boolean = false

  @action setLogin(login: string) {
    this.login = login
  }

  @action setPassword(password: string) {
    this.password = password
  }

  @action submit() {
    const params = {
      login: this.login,
      password: this.password,
    }

    this.submitting = true

    const promise = commonApi.login(params, 'session_id,user(login)')
      .then(data => this.sessionStore.setSession(data.sessionId, data.user.login))
      .then(() => {
        this.login    = ''
        this.password = ''
      })

    promise.finally(() => this.submitting = false)

    return promise
  }
}
