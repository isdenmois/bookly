import React from 'react';
import _ from 'lodash';
import { ActivityIndicator, View, TextInput, Button } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { observer } from 'mobx-react';
import { inject, provider } from 'services';

import { LoginStore } from './login.store';

@provider(LoginStore)
@observer
export class LoginScreen extends React.Component<NavigationScreenProps> {
  loginStore = inject(LoginStore);

  render() {
    const { login, submitting } = this.loginStore;

    return (
      <View>
        <TextInput
          testID='loginField'
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

        {!submitting && <Button testID='submitButton' title='Войти' disabled={!login} onPress={this.submit} />}
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
