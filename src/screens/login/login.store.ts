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

  @action async submit() {
    this.submitting = true;

    this.session.setSession(this.login);

    try {
      await this.syncService.sync();
      this.login = '';
    } catch (e) {
      console.error(e);
      this.session.setSession(null);
      throw e;
    } finally {
      this.submitting = false;
    }
  }
}
