import * as React from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { observer } from 'mobx-react'
import { inject, provider, InjectorContext } from 'react-ioc'

import { DataContext } from 'services'
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

  dataContext = inject(this, DataContext)

  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <SearchHeader navigation={this.props.navigation}/>

        <ScrollView refreshControl={this.renderRefresh()}>
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

    await this.dataContext.reload()

    this.setState({refreshing: false})
  }
}

HomeScreen.navigationOptions = () => ({header: null})
