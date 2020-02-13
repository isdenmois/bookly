import React from 'react';
import { ActivityIndicator, View, Button, KeyboardAvoidingView, ViewStyle, TextStyle } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { observer } from 'mobx-react';
import { inject, provider } from 'services';
import { TextL, ListItem } from 'components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { color } from 'types/colors';

import { LoginTriangles } from './login-triangles';
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
      <View style={s.container}>
        <LoginTriangles />

        <KeyboardAvoidingView style={s.cardContainer} behavior='padding' enabled>
          <View>
            <TextL style={s.headerTitle}>Вход в аккаунт</TextL>
          </View>

          <View style={s.card}>
            <View style={s.form}>
              <ListItem
                testID='loginField'
                autoCapitalize='none'
                autoFocus
                keyboardType='decimal-pad'
                placeholder='Имя пользователя'
                value={login}
                onChange={this.onLoginChange}
                onSubmit={this.submit}
                icon={<Icon name='user' size={18} color={color.PrimaryText} />}
              />
            </View>

            {submitting && <ActivityIndicator size='large' />}

            {!submitting && <Button testID='submitButton' title='Войти' disabled={!login} onPress={this.submit} />}
          </View>
        </KeyboardAvoidingView>
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

const s = {
  container: {
    backgroundColor: '#b8e6e3',
    flex: 1,
    overflow: 'hidden',
  } as ViewStyle,
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  card: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderRadius: 5,
  } as ViewStyle,
  header: {
    marginBottom: 20,
  } as ViewStyle,
  headerTitle: {
    textAlign: 'center',
    color: 'white',
  } as TextStyle,
};
