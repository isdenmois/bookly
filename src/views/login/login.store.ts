import { action, observable } from 'mobx'
import { inject } from 'react-ioc'
import { Session } from 'services'

export class LoginStore {
  session = inject(this, Session)

  @observable login: string       = ''
  @observable submitting: boolean = false

  @action setLogin(login: string) {
    this.login = login
  }

  @action submit() {
    this.submitting = true

    const promise = this.session.setSession(this.login).then(() => {
      this.login = ''
    })

    promise.finally(() => this.submitting = false)

    return promise
  }
}
