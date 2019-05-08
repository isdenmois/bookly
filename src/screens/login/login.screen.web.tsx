import React from 'react';
import _ from 'lodash';
import { History } from 'history';
import { inject, InjectorContext, provider } from 'react-ioc';
import { ActivityIndicator } from 'react-native';
import { observer } from 'mobx-react';

import { LoginStore } from './login.store';

interface Props {
  history: History;
}

@provider(LoginStore)
@observer
export class LoginPage extends React.Component<Props> {
  static contextType = InjectorContext;

  loginStore = inject(this, LoginStore);

  render() {
    const { login, submitting } = this.loginStore;

    return (
      <form onSubmit={this.submit}>
        <input value={login} onChange={this.onLoginChange} />

        {submitting && <ActivityIndicator size='large' />}

        {!submitting && <button>Войти</button>}
      </form>
    );
  }

  submit = event => {
    event.preventDefault();
    const navigateTo = _.get(this.props, 'location.state.from.pathname') || '/';

    this.loginStore.submit().then(() => this.props.history.replace(navigateTo));
  };

  onLoginChange = event => {
    this.loginStore.setLogin(event.target.value);
  };
}
