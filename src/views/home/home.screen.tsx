import * as React from 'react'
import { ActivityIndicator, ScrollView, RefreshControl, Text, View, Button } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Query } from 'react-apollo'
import { observer } from 'mobx-react'
import { inject, InjectorContext } from 'react-ioc'

import { sessionStore } from 'services/store'
import { client, REST } from 'services/client'
import { DataContext } from 'services'

import { SearchHeader } from './components/search-header'
import { NavigationLinks } from './components/navigation-links'
import { CurrentBook } from './components/current-book'
import { BookChallenge } from './components/book-challenge'
import { USER_BOOKS_QUERY, USER_CHALLENGE_QUERY, BOOK_LIST_QUERY } from './queries'

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

  dataContext = inject(this, DataContext)

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
          <Query query={USER_BOOKS_QUERY} variables={variables} context={REST}>
            {this.renderCurrentBook}
          </Query>

          <Query query={USER_CHALLENGE_QUERY} variables={variables} context={REST}>
            {this.renderBookChallenge}
          </Query>

          <Query query={BOOK_LIST_QUERY}>
            {({data}) => <View>{data && data.books && data.books.map(b => <Text>{b.title} - {b.author}</Text>)}</View>}
          </Query>

          <Text>Читаю сейчас:</Text>
          {this.dataContext.now.map(book => (
            <View key={book.id}>
              <Text>Книга: {book.title}</Text>
              <Text>Автор: {book.authors.map(a => a.name).join(', ')}</Text>
              <Button title='Прочитано' onPress={book.markAsRead}/>
            </View>
          ))}

          <Text>Прочитано:</Text>
          {this.dataContext.read.map(book => (
            <View key={book.id}>
              <Text>Книга: {book.title}</Text>
              <Text>Автор: {book.authors.map(a => a.name).join(', ')}</Text>
            </View>
          ))}

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
