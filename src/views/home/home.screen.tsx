import * as React from 'react'
import { ScrollView, RefreshControl, View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Query } from 'react-apollo'
import { observer } from 'mobx-react'
import { inject, InjectorContext } from 'react-ioc'

import { client, REST } from 'services/client'
import { Books, Session } from 'services'

import { SearchHeader } from './components/search-header'
import { NavigationLinks } from './components/navigation-links'
import { CurrentBook } from './components/current-book'
import { BookChallenge } from './components/book-challenge'
import { USER_CHALLENGE_QUERY } from './queries'

interface Props extends NavigationScreenProps {
  store: any
}

interface State {
  refreshing: boolean;
}

@observer
export class HomeScreen extends React.Component<Props, State> {
  static navigationOptions = () => ({header: null})
  static contextType = InjectorContext

  books = inject(this, Books)
  session = inject(this, Session)

  state: State = {refreshing: false}

  render() {
    const variables = {
      user: this.session.userId,
      type: 'wish',
      start: 1,
      count: 24,
      year: currentYear(),
    }

    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <SearchHeader navigation={this.props.navigation}/>

        <ScrollView refreshControl={this.renderRefresh()}>
          <CurrentBook navigation={this.props.navigation}/>

          <Query query={USER_CHALLENGE_QUERY} variables={variables} context={REST}>
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
