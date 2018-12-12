import * as React from 'react'
import { ActivityIndicator, KeyboardAvoidingView, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { Button, Container, Form, Icon, Item } from 'native-base'
import { NavigationScreenProps } from 'react-navigation'
import { observer } from 'mobx-react'
import { inject, InjectorContext, provider } from 'react-ioc'

import { TextM, TextL } from 'components/text'
import { Field } from 'components/field'
import { api } from 'api'
import { injectContext } from 'services/react-16-5-context'

import { LoginStore } from './login.store'
import { LoginTriangles } from './login-triangles'

interface Props extends NavigationScreenProps {
}

@injectContext
@provider(LoginStore)
@observer
@injectContext
export class LoginScreen extends React.Component<Props> {
  static navigationOptions = () => ({header: null})
  static contextType = InjectorContext

  loginStore = inject(this, LoginStore)
  private passwordField: Field

  componentWillMount() {
    if (api.query.session_id) {
      this.props.navigation.navigate('App')
    }
  }

  render() {
    const { login, password, submitting } = this.loginStore

    return (
      <Container style={s.container}>
        <LoginTriangles/>

        <KeyboardAvoidingView style={s.cardContainer} behavior='padding' enabled>
          <View style={s.header}>
            <TextL style={s.headerTitle}>Вход в аккаунт</TextL>
          </View>

          <View style={s.card}>
            <Form style={s.form}>
              <Item style={s.item}>
                <Icon name='ios-person' style={s.icon}/>
                <Field placeholder='Имя пользователя'
                       textContentType='username'
                       autoCapitalize='none'
                       autoCorrect={false}
                       value={login}
                       returnKeyType='next'
                       next={this.passwordField}
                       onChangeText={this.onLoginChange}/>
              </Item>
              <Item style={s.item}>
                <Icon name='ios-lock' style={s.icon}/>
                <Field placeholder='Пароль'
                       textContentType='password'
                       autoCapitalize='none'
                       autoCorrect={false}
                       secureTextEntry={true}
                       returnKeyType='done'
                       ref={field => this.passwordField = field}
                       value={password}
                       onSubmitEditing={this.submit}
                       onChangeText={this.onPasswordChange}/>
              </Item>
            </Form>

            {submitting &&
              <ActivityIndicator size='large'/>
            }

            {!submitting &&
              <Button full disabled={this.isDisabled} onPress={this.submit}>
                <TextM style={s.buttonText}>Войти</TextM>
              </Button>
            }
          </View>
        </KeyboardAvoidingView>
      </Container>
    )
  }

  get isDisabled() {
    return !this.loginStore.login || !this.loginStore.password
  }

  submit = () => {
    return this.loginStore
      .submit()
      .then(() => this.props.navigation.navigate('App'))
  }

  onLoginChange = (login: string) => {
    this.loginStore.setLogin(login)
  }

  onPasswordChange = (password: string) => {
    this.loginStore.setPassword(password)
  }
}

const s = StyleSheet.create({
  container: {
    backgroundColor: '#b8e6e3',
  } as ViewStyle,
  card: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 5,
  } as ViewStyle,
  header: {
    marginBottom: 20,
  } as ViewStyle,
  headerTitle: {
    textAlign: 'center',
    color: 'white',
  } as TextStyle,
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
  } as ViewStyle,
  form: {
    marginBottom: 20,
  } as ViewStyle,
  icon: {
    color: '#ccc',
  } as TextStyle,
  buttonText: {
    color: 'white',
  } as TextStyle,
  item: {
    marginLeft: 0,
  } as ViewStyle,
})
