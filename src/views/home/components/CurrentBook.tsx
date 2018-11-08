import * as _ from 'lodash'
import * as React from 'react'
import { View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import { EmptyBook } from './EmptyBook'
import { WishBook } from './WishBook'
import { BookSelectDialog } from './BookSelectDialog'

interface Props extends NavigationScreenProps {
  books: any
}

interface State {
  bookSelectDialogVisible: boolean
}

// TODO: дни недели
const mutation = gql`
  mutation ChangeStatus($bookId: ID!, $book_read: Int!) {
    changeStatus(bookId: $bookId, book_read: $book_read) {
      id
      user_book_partial {
        book_read
      }
    }
  }
`

export class CurrentBook extends React.Component<Props, State> {
  state = {
    bookSelectDialogVisible: false,
  }

  render() {
    const wantToRead = this.wantToRead,
          currentBooks = this.currentBooks

    return (
      <Mutation mutation={mutation} refetchQueries={['home']}>
        {(changeStatus) => (
          <View>
            {currentBooks.length > 0 &&
             <WishBook book={currentBooks[0]} changeBookStatus={(book, params) => this.changeBookStatus(changeStatus, book, params)}/>
            }

            {currentBooks.length === 0 &&
             <EmptyBook onChooseBook={this.openBookSelectDialog} chooseBookAvailable={wantToRead.length > 0}/>
            }

            {!_.isEmpty(wantToRead) &&
             <BookSelectDialog visible={this.state.bookSelectDialogVisible}
                               books={wantToRead}
                               onClose={this.closeBookSelectDialog}
                               onSelect={book => this.selectBookAsRead(changeStatus, book)}/>
            }
          </View>
        )}
      </Mutation>
    )
  }

  get currentBooks() {
    return _.filter(this.props.books, book => +_.get(book, 'user_book_partial.book_read') === 2)
  }

  get wantToRead() {
    return _.filter(this.props.books, book => +_.get(book, 'user_book_partial.book_read') === 0)
  }

  // TODO вынести во внутрь компонента
  changeBookStatus = async (mutate, book, params) => {
    await mutate({variables: {bookId: book.id, ...params}})

    if (_.isEmpty(this.currentBooks)) {
      this.openBookSelectDialog()
    }
  }

  // TODO вынести во внутрь компонента
  selectBookAsRead = (mutate, book) => {
    mutate({variables: {bookId: book.id, book_read: 2}})
  }

  openBookSelectDialog = () => this.setState({bookSelectDialogVisible: true})
  closeBookSelectDialog = () => this.setState({bookSelectDialogVisible: false})
}
