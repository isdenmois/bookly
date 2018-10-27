import * as _ from 'lodash'
import * as React from 'react'
import { View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'

import * as query from 'modules/api/query'

import { BookStatusMutation } from '../mutations/BookStatusMutation'
import { EmptyBook } from './EmptyBook'
import { WishBook } from './WishBook'
import { BookSelectDialog } from './BookSelectDialog'

interface Props extends NavigationScreenProps {
  books: any
}

interface State {
  bookSelectDialogVisible: boolean
}

export class CurrentBook extends React.Component<Props, State> {
  state = {
    bookSelectDialogVisible: false,
  }

  render() {
    const wantToRead = this.wantToRead,
          currentBooks = this.currentBooks

    return (
      <View>
        {currentBooks.length > 0 &&
          <WishBook book={currentBooks[0]} changeBookStatus={this.changeBookStatus}/>
        }

        {currentBooks.length === 0 &&
          <EmptyBook onChooseBook={this.openBookSelectDialog} chooseBookAvailable={wantToRead.length > 0}/>
        }

        {!_.isEmpty(wantToRead) &&
          <BookSelectDialog visible={this.state.bookSelectDialogVisible}
                            books={wantToRead}
                            onClose={this.closeBookSelectDialog}
                            onSelect={this.selectBookAsRead}/>
        }
      </View>
    )
  }

  get currentBooks() {
    return _.filter(this.props.books, book => +_.get(book, 'user_book_partial.book_read') === 2)
  }

  get wantToRead() {
    return _.filter(this.props.books, book => +_.get(book, 'user_book_partial.book_read') === 0)
  }

  changeBookStatus = async (book, params) => {
    const mutation = new BookStatusMutation(book, params)

    await query.update(mutation)

    if (_.isEmpty(this.currentBooks)) {
      this.openBookSelectDialog()
    }
  }

  selectBookAsRead = book => {
    const mutation = new BookStatusMutation(book, {book_read: 2})

    query.update(mutation)
  }

  openBookSelectDialog = () => this.setState({bookSelectDialogVisible: true})
  closeBookSelectDialog = () => this.setState({bookSelectDialogVisible: false})
}
