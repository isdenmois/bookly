import { action, observable } from 'mobx';
import { Session, SyncService, inject } from 'services';
import { ToastAndroid } from 'react-native';

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

    this.session.set('userId', this.login);

    try {
      await this.syncService.sync();
    } catch (e) {
      ToastAndroid.show(e?.message || 'Не удалось войти', ToastAndroid.SHORT);
      this.session.set('userId', null);
      throw e;
    } finally {
      this.login = '';
      this.submitting = false;
    }
  }
}
