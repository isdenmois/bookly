import * as React from 'react'
import { Header, Left, Body, Right, Button, Icon, Title } from 'native-base'
import { InjectorContext, inject } from 'react-ioc'
import { NavigationScreenProp } from 'react-navigation'
const { withNavigation } = require('react-navigation')
import Popover from 'react-native-popover-view'
import { BookListOptions } from './book-list-options'
import { BookListService } from '../services/book-list.service'

interface Props {
  navigation?: NavigationScreenProp<any>
}

interface State {
  isVisible: boolean
}

@withNavigation
export class BookListHeader extends React.Component<Props, State> {
  static contextType = InjectorContext

  bookListService = inject(this, BookListService)

  state: State = {isVisible: false}
  buttonRect: any

  render() {
    return (
      <>
        <Popover isVisible={this.state.isVisible}
                 onClose={this.closePopover}
                 fromView={this.buttonRect}>
          <BookListOptions onClose={this.closePopover}/>
        </Popover>
        <Header>
          <Left>
            <Button transparent onPress={this.goBack}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>{this.bookListService.title}</Title>
          </Body>
          <Right>
            <Button transparent ref={ref => this.buttonRect = ref} onPress={this.openPopover}>
              <Icon name='menu' />
            </Button>
          </Right>
        </Header>
      </>
    )
  }

  goBack = () => {
    this.props.navigation.goBack()
  }

  openPopover = () => this.setState({isVisible: true})
  closePopover = () => this.setState({isVisible: false})
}
