import * as _ from 'lodash'
import * as React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { Body, Button, Radio, Left, List, ListItem, Right, Text, Thumbnail } from 'native-base'
import { Dimensions, ScrollView, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import { inject, InjectorContext } from 'react-ioc'

import { BookS } from 'models/book'

import { Dialog } from 'components/dialog'
import { TextM } from 'components/text'
import { Books } from 'services'

interface Props extends NavigationScreenProps {
}

interface State {
  selected: BookS
}

export class BookSelectModal extends React.Component<Props, State> {
  static contextType = InjectorContext

  state = {
    selected: null,
  }

  books = inject(this, Books)
  bookLast = _.size(this.books.wantToRead) - 1

  render() {
    const maxHeight = Dimensions.get('window').height / 2

    return (
      <Dialog navigation={this.props.navigation} header='Выбор книги'>
        <ScrollView style={[s.list, {maxHeight}]}>
          <List>
            {this.books.wantToRead.map(this.renderBook)}
          </List>
        </ScrollView>

        <View style={s.button}>
          <Button full success onPress={this.save} disabled={!this.state.selected}>
            <TextM style={s.buttonText}>Подтвердить</TextM>
          </Button>
        </View>
      </Dialog>
    )
  }

  renderBook = (book: BookS, rowId) => (
    <ListItem key={book.id} first={!rowId} last={rowId === this.bookLast} onPress={() => this.selectBook(book)}>
      {Boolean(book.thumbnail) &&
        <Left style={s.left}>
          <Thumbnail source={{uri: book.thumbnail}}/>
        </Left>
      }

      <Body>
        <Text>{book.title}</Text>
        <Text note>{book.authorsName}</Text>
      </Body>

      <Right style={s.right}>
        <Radio selected={book === this.state.selected} onPress={() => this.selectBook(book)}/>
      </Right>
    </ListItem>
  )

  selectBook(selected) {
    this.setState({selected})
  }

  save = () => {
    this.state.selected.changeStatus('now')
    this.props.navigation.goBack()
  }
}

const s = StyleSheet.create({
  list: {
    flex: 0,
    borderBottomWidth: 0.5,
    borderColor: '#c9c9c9',
  } as ViewStyle,
  left: {
    flex: 0,
  } as ViewStyle,
  right: {
    flex: 0,
  } as ViewStyle,
  button: {
    padding: 20,
  } as ViewStyle,
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  } as TextStyle,
})
