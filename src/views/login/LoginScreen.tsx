import * as React from 'react'
import { Dimensions, KeyboardAvoidingView, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { Body, Button, Card, CardItem, Container, Content, Form, Icon, Input, Item, Label } from 'native-base'
import { NavigationScreenProps } from 'react-navigation'
import { inject, observer } from 'mobx-react'

import { TextM, TextL } from 'components/Text'
import { api } from 'modules/api/api'

import { LoginStore } from './LoginStore'
import { LoginTriangles } from './LoginTriangles'

interface Props extends NavigationScreenProps {
  loginStore: LoginStore
}

@inject('loginStore')
@observer
export class LoginScreen extends React.Component<Props> {
  static navigationOptions = () => ({header: null})

  componentWillMount() {
    if (api.query.session_id) {
      this.props.navigation.navigate('App')
    }
  }

  render() {
    const {login, password} = this.props.loginStore

    return (
      <Container style={s.container}>
        <LoginTriangles/>

        <KeyboardAvoidingView style={s.cardContainer} behavior='padding' enabled>
          <View style={s.header}>
            <TextL style={s.headerTitle}>Вход в аккаунт</TextL>
          </View>

          <View style={s.card}>
            <Form style={s.form}>
              <Item>
                <Icon name='ios-person' style={s.icon}/>
                <Input placeholder='Имя пользователя'
                       textContentType='username'
                       autoCapitalize='none'
                       autoCorrect={false}
                       value={login}
                       onChangeText={this.onLoginChange}/>
              </Item>
              <Item>
                <Icon name='ios-lock' style={s.icon}/>
                <Input placeholder='Пароль'
                       textContentType='password'
                       autoCapitalize='none'
                       autoCorrect={false}
                       secureTextEntry={true}
                       value={password}
                       onChangeText={this.onPasswordChange}/>
              </Item>
            </Form>

            <Button full disabled={this.isDisabled} onPress={this.submit}>
              <TextM style={s.buttonText}>Войти</TextM>
            </Button>
          </View>
        </KeyboardAvoidingView>

      </Container>
    )
  }

  get isDisabled() {
    return !this.props.loginStore.login || !this.props.loginStore.password
  }

  submit = () => {
    return this.props.loginStore
      .submit()
      .then(() => this.props.navigation.navigate('App'))
  }

  onLoginChange = (login: string) => {
    this.props.loginStore.setLogin(login)
  }

  onPasswordChange = (password: string) => {
    this.props.loginStore.setPassword(password)
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
})
