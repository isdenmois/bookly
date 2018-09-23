import { observable, action } from 'mobx';
import { commonApi } from '../../modules/api/commonApi';
import { SessionStore } from '../../services/SessionStore';

export class LoginStore {
    constructor(private sessionStore: SessionStore) {
    }

    @observable login: string = '';
    @observable password: string = '';
    @observable isLoading: boolean = false;

    @action
    setLogin(login: string) {
        this.login = login;
    }

    @action
    setPassword(password: string) {
        this.password = password;
    }

    @action
    submit() {
        const params = {
          login: this.login,
          password: this.password,
          fields: 'session_id,user(login)',
        };

        return commonApi.login.post(params)
            .then(data => this.sessionStore.setSession(data.session_id, data.user.login))
            .then(() => {
              this.login = '';
              this.password = '';
            });
    }
}
