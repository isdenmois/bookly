import * as React from 'react'
import { ActivityIndicator, RefreshControl } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Query } from 'react-apollo'
import { Container, Content } from 'native-base'

import { sessionStore } from 'services/store'
import { client } from 'services/client'

import { SearchHeader } from './components/SearchHeader'
import { NavigationLinks } from './components/NavigationLinks'
import { CurrentBook } from './components/CurrentBook'
import { BookChallenge } from './components/BookChallenge'
import { USER_BOOKS_QUERY, USER_CHALLENGE_QUERY } from './queries'

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
      <Container>
        <SearchHeader navigation={this.props.navigation}/>

        <Content refreshControl={this.renderRefresh()}>
          <Query query={USER_BOOKS_QUERY} variables={variables}>
            {this.renderCurrentBook}
          </Query>

          <Query query={USER_CHALLENGE_QUERY} variables={variables}>
            {this.renderBookChallenge}
          </Query>

          <NavigationLinks navigation={this.props.navigation}/>
        </Content>
      </Container>
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
