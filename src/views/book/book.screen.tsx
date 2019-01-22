import * as React from 'react'
import { Text } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { StatusBar } from 'components/status-bar'
import { BookListHeader } from './components/header'

interface Props extends NavigationScreenProps {
}

export class BookScreen extends React.Component<Props> {
  static navigationOptions = () => ({header: null})

  render() {
    return (
      <>
        <BookListHeader navigation={this.props.navigation}/>
        <Text>{this.props.navigation.getParam('workId')}</Text>
      </>
    )
  }
}
