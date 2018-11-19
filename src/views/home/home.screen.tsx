import * as React from 'react'
import { ActivityIndicator, ScrollView, RefreshControl, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Query } from 'react-apollo'

import { sessionStore } from 'services/store'
import { client } from 'services/client'

import { StatusBar } from 'components/status-bar'
import { SearchHeader } from './components/search-header'
import { NavigationLinks } from './components/navigation-links'
import { CurrentBook } from './components/current-book'
import { BookChallenge } from './components/book-challenge'
import { USER_BOOKS_QUERY, USER_CHALLENGE_QUERY } from './queries'
import { color } from '../../constants/colors'

interface Props extends NavigationScreenProps {
}

interface State {
  refreshing: boolean;
}

export class HomeScreen extends React.Component<Props, State> {
  static navigationOptions = () => ({header: null})

  state: State = {refreshing: false}

  render() {
    const variables = {
      user: sessionStore.userId,
      type: 'wish',
      start: 1,
      count: 24,
      year: currentYear(),
    }

    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <SearchHeader navigation={this.props.navigation}/>

        <ScrollView refreshControl={this.renderRefresh()}>
          <Query query={USER_BOOKS_QUERY} variables={variables}>
            {this.renderCurrentBook}
          </Query>

          <Query query={USER_CHALLENGE_QUERY} variables={variables}>
            {this.renderBookChallenge}
          </Query>

          <NavigationLinks navigation={this.props.navigation}/>
        </ScrollView>
      </View>
    )
  }

  renderRefresh() {
    return <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh}/>
  }

  renderCurrentBook = ({ loading, data }) => {
    if (loading) {
      return <ActivityIndicator/>
    }

    return <CurrentBook navigation={this.props.navigation} books={data.userBooks}/>
  }

  renderBookChallenge = ({ loading, data }) => {
    if (loading || !data.userChallenge) return null

    return <BookChallenge challenge={data.userChallenge}/>
  }

  refresh = async () => {
    this.setState({refreshing: true})

    await client.reFetchObservableQueries()

    this.setState({refreshing: false})
  }
}

function currentYear() {
  return new Date().getFullYear()
}
