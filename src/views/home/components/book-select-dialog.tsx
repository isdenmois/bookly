import * as _ from 'lodash'
import * as React from 'react'
import gql from 'graphql-tag'
import { Body, Button, Radio, Content, Left, List, ListItem, Right, Text, Thumbnail } from 'native-base'
import { Dimensions, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'

import { client } from 'services/client'
import { Book } from 'models/book'

import { Dialog } from 'components/dialog'
import { TextM } from 'components/text'

interface Props {
  visible: boolean
  books: Book[]
  onClose: () => void
}

interface State {
  selected: any
}

const mutation = gql`
  mutation ChangeStatus($bookId: ID!, $bookRead: Int!) {
    changeStatus(bookId: $bookId, bookRead: $bookRead) {
      id
      userBookPartial {
        bookRead
      }
    }
  }
`

export class BookSelectDialog extends React.Component<Props, State> {
  state = {
    selected: null,
  }

  bookLast = 0

  componentWillReceiveProps(nextProps: Props) {
    this.bookLast = _.size(nextProps.books) - 1
  }

  render() {
    const maxHeight = Dimensions.get('window').height / 2

    return (
      <Dialog visible={this.props.visible} onClose={this.close} header='Выбор книги'>
        <Content style={[s.list, {maxHeight}]}>
          <List>
            {this.props.books.map(this.renderBook)}
          </List>
        </Content>

        <View style={s.button}>
          <Button full success onPress={this.save} disabled={!this.state.selected}>
            <TextM style={s.buttonText}>Подтвердить</TextM>
          </Button>
        </View>
      </Dialog>
    )
  }

  renderBook = (book: Book, rowId) => (
    <ListItem key={book.id} first={!rowId} last={rowId === this.bookLast} onPress={() => this.selectBook(book)}>
      <Left style={s.left}>
        <Thumbnail source={{uri: book.pic100}}/>
      </Left>

      <Body>
        <Text>{book.name}</Text>
        <Text note>{book.authorName}</Text>
      </Body>

      <Right style={s.right}>
        <Radio selected={book === this.state.selected} onPress={() => this.selectBook(book)}/>
      </Right>
    </ListItem>
  )

  close = () => {
    this.setState({selected: null})
    this.props.onClose()
  }

  selectBook(selected) {
    this.setState({selected})
  }

  save = () => {
    const { selected } = this.state,
          variables = {bookId: selected.id, bookRead: 2}

    client.mutate({mutation, variables})
    this.close()
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
