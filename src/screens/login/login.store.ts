import { action, observable } from 'mobx';
import { inject } from 'react-ioc';
import { Session, SyncService } from 'services';

export class LoginStore {
  session = inject(this, Session);
  syncService = inject(this, SyncService);

  @observable login: string = '';
  @observable submitting: boolean = false;

  @action setLogin(login: string) {
    this.login = login.trim();
  }

  @action submit() {
    this.submitting = true;

    const promise = Promise.resolve(this.session.setSession(this.login))
      .then(() => this.syncService.sync())
      .then(() => (this.login = ''));

    promise.finally(() => (this.submitting = false));

    return promise;
  }
}
