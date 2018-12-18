import * as React from 'react'
import { InjectorContext, provider, inject, toFactory } from 'react-ioc'
import { observer } from 'mobx-react'

import { ScrollView } from 'react-native'
import { List, ListItem } from 'native-base'

import { BOOK_READ_STATUS } from 'models/book'
import { BookListService } from './services/book-list.service'
import { HaveReadItem } from './components/have-read-item'

interface Props {
}

@provider(
  [BookListService, toFactory(() => new BookListService(BOOK_READ_STATUS.HAVE_READ))]
)
@observer
export class HaveReadListScreen extends React.Component<Props> {
  static navigationOptions = () => ({title: 'Прочитано'})
  static contextType = InjectorContext

  bookListService = inject(this, BookListService)

  public render() {
    const lastIndex = this.bookListService.books.length - 1

    return (
      <ScrollView>
        <List>
          {this.bookListService.books.map((book, index) =>
            <ListItem key={book.id} last={lastIndex === index}>
              <HaveReadItem book={book}/>
            </ListItem>
          )}
        </List>
      </ScrollView>
    );
  }
}
