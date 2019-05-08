import React from 'react';
import _ from 'lodash';
import { inject, InjectorContext, provider } from 'react-ioc';
import { ActivityIndicator, View, TextInput, Button } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { observer } from 'mobx-react';

import { LoginStore } from './login.store';

@provider(LoginStore)
@observer
export class LoginScreen extends React.Component<NavigationScreenProps> {
  static contextType = InjectorContext;

  loginStore = inject(this, LoginStore);

  render() {
    const { login, submitting } = this.loginStore;

    return (
      <View>
        <TextInput
          autoCapitalize='none'
          autoCorrect={false}
          autoFocus
          value={login}
          onChangeText={this.onLoginChange}
          placeholder='login'
          returnKeyType='done'
          onSubmitEditing={this.submit}
        />

        {submitting && <ActivityIndicator size='large' />}

        {!submitting && <Button title='Войти' onPress={this.submit} />}
      </View>
    );
  }

  submit = () => {
    const navigateTo = _.get(this.props, 'location.state.from.pathname') || 'Home';

    this.loginStore.submit().then(() => this.props.navigation.navigate(navigateTo));
  };

  onLoginChange = value => {
    this.loginStore.setLogin(value);
  };
}
