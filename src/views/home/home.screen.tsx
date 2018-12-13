import * as React from 'react'
import { ScrollView, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { observer } from 'mobx-react'
import { provider, InjectorContext } from 'react-ioc'

import { HomeService } from './home.service'

import { SearchHeader } from './components/search-header'
import { NavigationLinks } from './components/navigation-links'
import { CurrentBook } from './components/current-book'
import { BookChallenge } from './components/book-challenge'

interface Props extends NavigationScreenProps {
  store: any
}

interface State {
  refreshing: boolean;
}

@provider(HomeService)
@observer
export class HomeScreen extends React.Component<Props, State> {
  static navigationOptions = () => ({header: null})
  static contextType = InjectorContext

  state: State = {refreshing: false}

  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <SearchHeader navigation={this.props.navigation}/>

        <ScrollView>
          <CurrentBook navigation={this.props.navigation}/>

          <BookChallenge/>

          <NavigationLinks navigation={this.props.navigation}/>
        </ScrollView>
      </View>
    )
  }
}

HomeScreen.navigationOptions = () => ({header: null})
