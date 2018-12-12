import * as React from 'react'
import { ScrollView, RefreshControl, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { observer } from 'mobx-react'
import { provider } from 'react-ioc'

import { client } from 'services/client'
import { injectContext } from 'services/react-16-5-context'

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

@observer
@injectContext
@provider(HomeService)
export class HomeScreen extends React.Component<Props, State> {
  static navigationOptions = () => ({header: null})

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

  renderRefresh() {
    return <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh}/>
  }

  refresh = async () => {
    this.setState({refreshing: true})

    await client.reFetchObservableQueries()

    this.setState({refreshing: false})
  }
}

HomeScreen.navigationOptions = () => ({header: null})
