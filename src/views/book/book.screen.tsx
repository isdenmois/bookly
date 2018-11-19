import * as React from 'react'
import { ActivityIndicator, Button, Image, Text, View } from 'react-native'
import { inject, observer } from 'mobx-react'
import { BookStore } from './book.store'

@inject('bookStore')
@observer
export class BookScreen extends React.Component<any> {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('otherParam', 'A Nested Details Screen'),
    }
  }

  render() {
    const bookStore: BookStore = this.props.bookStore

    if (bookStore.isLoading) {
      return <ActivityIndicator/>
    }

    if (!bookStore.book) {
      return <View><Text>Книга не найдена</Text></View>
    }

    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Название: {bookStore.book.title}</Text>
        <Text>Автор: {bookStore.book.author}</Text>
        {bookStore.book.thumbnail &&
         <Image style={{width: 140, height: 140}} source={{uri: bookStore.book.thumbnail}}/>
        }
        <Text>{bookStore.book.rating} / 10</Text>
        <Text>{bookStore.book.description}</Text>
        <Button
          title='Update the title'
          onPress={() => this.props.navigation.setParams({otherParam: 'Updated!'})}
        />
      </View>
    )
  }

  componentWillUnmount() {
    this.listener.remove()
  }

  loadBook = () => {
    const bookId               = this.props.navigation.getParam('bookId', 'NO-ID'),
          bookStore: BookStore = this.props.bookStore

    if (bookStore.bookId !== bookId) {
      bookStore.loadBook(bookId)
      console.warn('Load book')
    }
  }

  private listener = this.props.navigation.addListener('willFocus', this.loadBook)
}
