import * as _ from 'lodash'
import * as React from 'react'
import { View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'

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
          <WishBook book={currentBooks[0]} navigation={this.props.navigation}/>
        }

        {currentBooks.length === 0 &&
          <EmptyBook onChooseBook={this.openBookSelectDialog} chooseBookAvailable={wantToRead.length > 0}/>
        }

        {!_.isEmpty(wantToRead) &&
         <BookSelectDialog visible={this.state.bookSelectDialogVisible}
                            books={wantToRead}
                            onClose={this.closeBookSelectDialog}/>
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

  openBookSelectDialog = () => this.setState({bookSelectDialogVisible: true})
  closeBookSelectDialog = () => this.setState({bookSelectDialogVisible: false})
}
