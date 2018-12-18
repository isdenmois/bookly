import * as React from 'react'
import { InjectorContext, inject } from 'react-ioc'
import { observer } from 'mobx-react'
import { NavigationScreenProps } from 'react-navigation'

import { ScrollView } from 'react-native'
import { List, ListItem } from 'native-base'

import { BookListService } from '../services/book-list.service'

interface Props extends NavigationScreenProps {
  listItem: any
}

@observer
export class BookList extends React.Component<Props> {
  static contextType = InjectorContext

  bookListService = inject(this, BookListService)

  public render() {
    const lastIndex = this.bookListService.books.length - 1,
          Item = this.props.listItem

    return (
      <ScrollView>
        <List>
            {this.bookListService.books.map((book, index) =>
              <ListItem key={book.id} last={lastIndex === index}>
                <Item navigation={this.props.navigation} book={book}/>
              </ListItem>
            )}
        </List>
      </ScrollView>
    );
  }
}
