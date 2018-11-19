import * as _ from 'lodash'
import * as React from 'react'
import { View } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'

import { Book } from 'models/book'

import { EmptyBook } from './empty-book'
import { ReadNowBook } from './read-now-book'

interface Props extends NavigationScreenProps {
  books: Book[]
}

export class CurrentBook extends React.Component<Props> {
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
      </View>
    )
  }

  get currentBooks(): Book[] {
    return _.filter(this.props.books, book => +_.get(book, 'userBookPartial.bookRead') === 2)
  }

  get wantToRead(): Book[] {
    return _.filter(this.props.books, book => +_.get(book, 'userBookPartial.bookRead') === 0)
  }

  openBookSelectDialog = () => this.props.navigation.navigate('BookSelect', {books: this.wantToRead})
}
