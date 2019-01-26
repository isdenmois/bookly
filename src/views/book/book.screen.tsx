import * as React from 'react'
import { Text, ActivityIndicator } from 'react-native'
import { inject, provider, InjectorContext } from 'react-ioc'
import { observer } from 'mobx-react'
import { NavigationScreenProps } from 'react-navigation'
import { BookService } from './book.service'
import { BookListHeader } from './components/header'
import { BookMainInfo } from './components/book-main-info'

interface Props extends NavigationScreenProps {
}

@provider(BookService)
@observer
export class BookScreen extends React.Component<Props> {
  static navigationOptions = () => ({header: null})
  static contextType = InjectorContext

  bookService = inject(this, BookService)

  constructor(props, context) {
    super(props, context)

    this.bookService.fetch(this.props.navigation.getParam('workId'))
  }

  render() {
    return (
      <>
        <BookListHeader navigation={this.props.navigation}/>
        {this.bookService.loading &&
          <ActivityIndicator size='large'/>
        }
        {!this.bookService.loading && this.bookService.book &&
          <BookMainInfo book={this.bookService.book}/>
        }
      </>
    )
  }
}
