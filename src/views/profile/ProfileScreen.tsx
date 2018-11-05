import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { NavigationActions, NavigationScreenProps, StackActions } from 'react-navigation'
import { Button, Container, Content, Text } from 'native-base'

import { StatusBar } from 'components/StatusBar'
import { SessionStore } from 'services/SessionStore'

interface Props extends NavigationScreenProps {
  sessionStore?: SessionStore;
}

@inject('sessionStore')
@observer
export class ProfileScreen extends React.Component<Props> {
  static navigationOptions = {headerTitle: 'Профиль'}

  render() {
    return (
      <Container>
        <StatusBar/>

        <Content>
          <Button onPress={this.logout}>
            <Text>Выйти</Text>
          </Button>
        </Content>
      </Container>
    )
  }

  logout = () => {
    this.props.sessionStore.stopSession()
    this.props.navigation.navigate('Login')
  }
}
