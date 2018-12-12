import { action, observable } from 'mobx'
import { inject } from 'react-ioc'
import { commonApi } from 'api'
import { Session } from 'services'

export class LoginStore {
  session = inject(this, Session)

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
      .then(data => this.session.setSession(data.sessionId, data.user.login))
      .then(() => {
        this.login    = ''
        this.password = ''
      })

    promise.finally(() => this.submitting = false)

    return promise
  }
}
