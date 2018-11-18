import * as _ from 'lodash'
import * as React from 'react'
import { View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'

import { Book } from 'models/Book'

import { EmptyBook } from './EmptyBook'
import { ReadNowBook } from './ReadNowBook'
import { BookSelectDialog } from './BookSelectDialog'

interface Props extends NavigationScreenProps {
  books: Book[]
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
          <ReadNowBook book={currentBooks[0]} navigation={this.props.navigation}/>
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

  get currentBooks(): Book[] {
    return _.filter(this.props.books, book => +_.get(book, 'userBookPartial.bookRead') === 2)
  }

  get wantToRead(): Book[] {
    return _.filter(this.props.books, book => +_.get(book, 'userBookPartial.bookRead') === 0)
  }

  openBookSelectDialog = () => this.setState({bookSelectDialogVisible: true})
  closeBookSelectDialog = () => this.setState({bookSelectDialogVisible: false})
}
