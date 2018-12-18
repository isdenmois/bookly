import * as React from 'react'
import { provider, toFactory } from 'react-ioc'
import { NavigationScreenProps } from 'react-navigation'

import { BOOK_READ_STATUS } from 'models/book'
import { BookListService } from './services/book-list.service'
import { WishItem } from './components/wish-item'
import { BookList } from './components/book-list'

interface Props extends NavigationScreenProps {
}

@provider(
  [BookListService, toFactory(() => new BookListService(BOOK_READ_STATUS.WANT_TO_READ))]
)
export class WishListScreen extends React.Component<Props> {
  static navigationOptions = () => ({title: 'Хочу прочитать'})

  public render() {
    return <BookList navigation={this.props.navigation} listItem={WishItem}/>
  }
}
