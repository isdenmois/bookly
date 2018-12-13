import * as React from 'react'
import { observer } from 'mobx-react'
import { InjectorContext } from 'react-ioc'
import { NavigationScreenProps } from 'react-navigation'
import { Button, Container, Content, Text } from 'native-base'

import { Session } from 'services'
import { inject, injectContext } from 'services/react-16-5-context'
import { StatusBar } from 'components/status-bar'

interface Props extends NavigationScreenProps {
}

@injectContext
@observer
export class ProfileScreen extends React.Component<Props> {
  static navigationOptions = {headerTitle: 'Профиль'}
  static contextType = InjectorContext

  session = inject(this, Session)

  render() {
    return (
      <Container>
        <StatusBar/>

        <Content>
          <Button full onPress={this.logout}>
            <Text>Выйти</Text>
          </Button>
        </Content>
      </Container>
    )
  }

  logout = () => {
    this.session.stopSession()
    this.props.navigation.navigate('Login')
  }
}
