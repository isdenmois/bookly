import * as React from 'react'
import { ScrollView, RefreshControl, View, Text, Button } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { observer } from 'mobx-react'
import { provider, InjectorContext } from 'react-ioc'

import { client } from 'services/client'
import { Books } from 'services'
import { injectContext, injectProviderContext, inject } from 'services/react-16-5-context'

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

@injectProviderContext
@provider(HomeService)
@injectContext
@observer
export class HomeScreen extends React.Component<Props, State> {
  static navigationOptions = () => ({header: null})
  static contextType = InjectorContext

  state: State = {refreshing: false}
  books = inject(this, Books)

  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <SearchHeader navigation={this.props.navigation}/>

        <ScrollView>
          <CurrentBook navigation={this.props.navigation}/>

          <BookChallenge/>

          <Text>Читаю сейчас:</Text>
          {this.books.currentBooks.map(book => (
            <View key={book.id}>
              <Text>Книга: {book.title}</Text>
              <Text>Автор: {book.authors.map(a => a.name).join(', ')}</Text>
              <Button title='Прочитано' onPress={() => book.changeStatus('read', 5, new Date())}/>
            </View>
          ))}
           <Text>Прочитано:</Text>
          {this.books.haveRead.map(book => (
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

  refresh = async () => {
    this.setState({refreshing: true})

    await client.reFetchObservableQueries()

    this.setState({refreshing: false})
  }
}

HomeScreen.navigationOptions = () => ({header: null})
