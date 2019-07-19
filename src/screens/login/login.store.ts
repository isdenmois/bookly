import { action, observable } from 'mobx';
import { Session, SyncService, inject } from 'services';

export class LoginStore {
  session = inject(Session);
  syncService = inject(SyncService);

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
