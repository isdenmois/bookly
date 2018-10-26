import * as _ from 'lodash'
import * as React from 'react'
import { NavigationScreenProps } from 'react-navigation'

import { notImplemented } from 'constants/not-implemented-yet'

import { EmptyBook } from './EmptyBook'
import { WishBook } from './WishBook'

interface Props extends NavigationScreenProps {
  books: any
}

export class CurrentBook extends React.Component<Props> {
  render() {
    const books = this.currentBooks

    if (_.isEmpty(books)) {
      return <EmptyBook onChooseBook={notImplemented}/>
    }

    return <WishBook book={books[0]}/>
  }

  get currentBooks() {
    return _.filter(this.props.books, book => +_.get(book, 'user_book_partial.book_read') === 2)
  }
}
