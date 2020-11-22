import React from 'react';
import { View, Text, TextInput, TextStyle, ViewStyle } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { DynamicStyleSheet, ColorSchemeContext } from 'react-native-dynamic';
import { dynamicColor } from 'types/colors';
import { withNavigationProps } from 'utils/with-navigation-props';
import { api, settings } from 'services';
import { FantlabLoginRequest } from 'services/api/fantlab/login';
import { Button, Dialog, ListItem } from 'components';

interface Props {
  navigation: NavigationScreenProp<void>;
  onSuccess: () => void;
  onClose: () => void;
}

@withNavigationProps()
export class FantlabLoginModal extends React.Component<Props> {
  static contextType = ColorSchemeContext;

  state = {
    isLoading: false,
    login: settings.userId,
    password: '',
    error: null,
  };

  passwordRef: TextInput;

  get isDisabled() {
    return !this.state.login || !this.state.password || this.state.isLoading;
  }

  render() {
    const s = ds[this.context];

    return (
      <Dialog style={s.container} title='Fantlab логин' onClose={this.props.onClose}>
        {this.state.error && <Text style={s.error}>{this.state.error.toString()}</Text>}

        <ListItem rowStyle={s.list}>
          <TextInput
            autoFocus
            autoCapitalize='none'
            autoCorrect={false}
            style={s.input}
            placeholder='Логин'
            returnKeyType='next'
            value={this.state.login}
            onChangeText={this.setLogin}
            onSubmitEditing={this.focusPassword}
          />
        </ListItem>

        <ListItem rowStyle={s.list}>
          <TextInput
            secureTextEntry
            style={s.input}
            autoCapitalize='none'
            autoCorrect={false}
            placeholder='Пароль'
            returnKeyType='done'
            value={this.state.password}
            onChangeText={this.setPassword}
            onSubmitEditing={this.login}
            ref={this.setPasswordRef}
          />
        </ListItem>

        <View style={s.buttonRow}>
          <Button textStyle={s.button} disabled={this.isDisabled} label='Войти' onPress={this.login} />
        </View>
      </Dialog>
    );
  }

  setLogin = login => this.setState({ login });
  setPassword = password => this.setState({ password });
  setPasswordRef = ref => (this.passwordRef = ref);

  focusPassword = () => this.passwordRef.focus();

  login = async () => {
    if (this.isDisabled) {
      return;
    }

    this.setState({ isLoading: true, error: null });

    let result: FantlabLoginRequest = { auth: 0 };
    let error = null;

    try {
      result = await api.login(this.state.login, this.state.password);
    } catch (e) {
      error = e;
    }

    if (!+result.auth) {
      return this.setState({ isLoading: false, error: error || result.error_msg || 'Не удалось залогиниться' });
    }

    settings.set('fantlabAuth', result['X-Session']);
    this.props.navigation.goBack();
    this.props.onSuccess();
  };
}

const ds = new DynamicStyleSheet({
  container: {
    paddingHorizontal: 20,
  },
  error: {
    color: dynamicColor.ErrorText,
  } as TextStyle,
  list: {
    paddingVertical: 0,
  } as ViewStyle,
  input: {
    flex: 1,
    fontSize: 16,
    color: dynamicColor.PrimaryText,
    padding: 0,
    paddingRight: 5,
    paddingVertical: 15,
  } as TextStyle,
  buttonRow: {
    alignItems: 'center',
    paddingVertical: 20,
  } as ViewStyle,
  button: {
    width: 100,
  } as TextStyle,
});
