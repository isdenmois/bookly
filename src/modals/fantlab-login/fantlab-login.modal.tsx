import React from 'react';
import { View, Text, TextInput, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { color } from 'types/colors';
import { withNavigationProps } from 'utils/with-navigation-props';
import { inject, Session } from 'services';
import { FantlabAPI } from 'services/api';
import { FantlabLoginRequest } from 'services/api/fantlab/login';
import { Button, Dialog, ListItem } from 'components';

interface Props extends NavigationScreenProps {
  onSuccess: () => void;
  onClose: () => void;
}

@withNavigationProps()
export class FantlabLoginModal extends React.Component<Props> {
  api = inject(FantlabAPI);
  session = inject(Session);

  state = {
    isLoading: false,
    login: this.session.userId,
    password: '',
    error: null,
  };

  passwordRef: TextInput;

  get isDisabled() {
    return !this.state.login || !this.state.password || this.state.isLoading;
  }

  render() {
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
      result = await this.api.login(this.state.login, this.state.password);
    } catch (e) {
      error = e;
    }

    if (!+result.auth) {
      return this.setState({ isLoading: false, error: error || result.error_msg || 'Не удалось залогиниться' });
    }

    this.session.setAuth(result['X-Session']);
    this.props.navigation.pop();
    this.props.onSuccess();
  };
}

const s = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  error: {
    color: color.ErrorText,
  } as TextStyle,
  list: {
    paddingVertical: 0,
  } as ViewStyle,
  input: {
    flex: 1,
    fontSize: 16,
    color: color.PrimaryText,
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
