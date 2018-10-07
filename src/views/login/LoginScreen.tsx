import * as React from 'react'
import { Button, Container, Content, Form, Input, Item, Label } from 'native-base'
import { NavigationScreenProps } from 'react-navigation'
import { inject, observer } from 'mobx-react'
import { TextM } from '../../components/Text'
import { api } from '../../modules/api/api'
import { LoginStore } from './LoginStore'

interface Props extends NavigationScreenProps {
  loginStore: LoginStore
}

@inject('loginStore')
@observer
export class LoginScreen extends React.Component<Props> {
  componentWillMount() {
    if (api.query.session_id) {
      this.props.navigation.replace('Home')
    }
  }

  render() {
    const {login, password} = this.props.loginStore

    return (
      <Container>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Имя пользователя</Label>
              <Input textContentType='username'
                     value={login}
                     onChangeText={this.onLoginChange}/>
            </Item>
            <Item floatingLabel last>
              <Label>Пароль</Label>
              <Input textContentType='password'
                     value={password}
                     onChangeText={this.onPasswordChange}/>
            </Item>
          </Form>
          <Button onPress={this.submit}>
            <TextM>Войти</TextM>
          </Button>
        </Content>
      </Container>
    )
  }

  submit = () => {
    return this.props.loginStore
      .submit()
      .then(() => this.props.navigation.replace('Home'))
  }

  onLoginChange = (login: string) => {
    this.props.loginStore.setLogin(login)
  }

  onPasswordChange = (password: string) => {
    this.props.loginStore.setPassword(password)
  }
}
