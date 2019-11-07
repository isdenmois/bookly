import React from 'react';
import { ActivityIndicator, View, TextInput, Button } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { observer } from 'mobx-react';
import { inject, provider } from 'services';

import { LoginStore } from './login.store';

interface Props {
  navigation: NavigationScreenProp<any>;
  location: any;
}

@provider(LoginStore)
@observer
export class LoginScreen extends React.Component<Props> {
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
    const navigateTo = this.props.location?.state.from?.pathname || 'Home';

    this.loginStore.submit().then(() => this.props.navigation.navigate(navigateTo));
  };

  onLoginChange = value => {
    this.loginStore.setLogin(value);
  };
}
