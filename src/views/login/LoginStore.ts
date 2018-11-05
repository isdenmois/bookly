import { action, observable } from 'mobx'
import { commonApi } from 'modules/api/commonApi'
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
      fields: 'session_id,user(login)',
    }

    this.submitting = true

    return commonApi.login.post(params)
      .then(data => this.sessionStore.setSession(data.session_id, data.user.login))
      .then(() => {
        this.login    = ''
        this.password = ''
      })
      .finally(() => this.submitting = false)
  }
}
