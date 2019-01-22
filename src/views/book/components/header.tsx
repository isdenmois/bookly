import * as React from 'react'
import { Linking } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Body, Button, Header, Icon, Left, Right, Title } from 'native-base'
import { Feature } from 'utils/feature'

interface Props extends NavigationScreenProps {
}

export class BookListHeader extends React.Component<Props> {
  render() {
    return (
      <Header transparent>
        <Left>
          <Button transparent onPress={this.goBack}>
            <Icon name='arrow-back'/>
          </Button>
        </Left>
        <Body>
          <Title>Подробности</Title>
        </Body>
        <Right>
          <Feature version='3.0.0'>
            <Button transparent>
              <Icon name='create'/>
            </Button>
          </Feature>
          <Button transparent onPress={this.openBookURL}>
            <Icon name='open'/>
          </Button>
        </Right>
      </Header>
    )
  }

  goBack = () => {
    this.props.navigation.goBack()
  }

  openBookURL = () => {
    const workId = this.props.navigation.getParam('workId')

    Linking.openURL(`http://fantlab.ru/work${workId}`)
  }
}
