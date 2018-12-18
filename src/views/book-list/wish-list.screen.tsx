import * as React from 'react'
import { InjectorContext, provider, inject, toFactory } from 'react-ioc'
import { observer } from 'mobx-react'
import { NavigationScreenProps } from 'react-navigation'

import { List, ListItem } from 'native-base'

import { BOOK_READ_STATUS } from 'models/book'
import { BookListService } from './services/book-list.service'
import { WishItem } from './components/wish-item'

interface Props extends NavigationScreenProps {
}

@provider(
  [BookListService, toFactory(() => new BookListService(BOOK_READ_STATUS.WANT_TO_READ))]
)
@observer
export class WishListScreen extends React.Component<Props> {
  static navigationOptions = () => ({title: 'Хочу прочитать'})
  static contextType = InjectorContext

  bookListService = inject(this, BookListService)

  public render() {
    const lastIndex = this.bookListService.books.length - 1

    return (
      <List>
        {this.bookListService.books.map((book, index) =>
          <ListItem key={book.id} last={lastIndex === index}>
            <WishItem navigation={this.props.navigation} book={book}/>
          </ListItem>
        )}
      </List>
    );
  }
}
