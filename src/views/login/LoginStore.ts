import { observable, action } from 'mobx';
import { commonApi } from '../../modules/api/commonApi';
import { setSessionId } from '../../modules/api/api';

export class LoginStore {
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
          fields: 'session_id',
        };

        return commonApi.login.post(params)
            .then(data => setSessionId(data.session_id))
            .then(() => {
              this.login = '';
              this.password = '';
            });
    }
}
