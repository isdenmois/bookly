import * as React from 'react'
import { InjectorContext, inject } from 'react-ioc'
import { observer } from 'mobx-react'

import { ListItem } from 'native-base'
import { TextM } from 'components/text'

import { BookListService } from '../services/book-list.service'

@observer
export class BookListTotal extends React.Component<any> {
  static contextType = InjectorContext

  bookListService = inject(this, BookListService)

  render() {
    const total = this.bookListService.books.length

    return (
      <ListItem first>
        <TextM>Всего: {total}</TextM>
      </ListItem>
    )
  }
}
