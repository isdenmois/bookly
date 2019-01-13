import * as React from 'react'
import { provider, toFactory } from 'react-ioc'
import { NavigationScreenProps } from 'react-navigation'

import { BOOK_READ_STATUS } from 'models/book'
import { BookListService } from './services/book-list.service'
import { HaveReadItem } from './components/have-read-item'
import { BookList } from './components/book-list'

interface Props extends NavigationScreenProps {
}

const filters = {
  year: true,
  author: true,
}

const options = {
  status: BOOK_READ_STATUS.HAVE_READ,
  title: 'Прочитано',
  filters,
  year: new Date().getFullYear(),
}

@provider(
  [BookListService, toFactory(() => new BookListService(options))]
)
export class HaveReadListScreen extends React.Component<Props> {
  static navigationOptions = () => ({header: null})

  public render() {
    return <BookList navigation={this.props.navigation} listItem={HaveReadItem}/>
  }
}
