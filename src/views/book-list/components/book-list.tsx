import * as React from 'react'
import { InjectorContext, inject } from 'react-ioc'
import { observer } from 'mobx-react'
import { NavigationScreenProps } from 'react-navigation'

import { FlatList, ScrollView } from 'react-native'
import { List, ListItem, Item } from 'native-base'

import { BookListService } from '../services/book-list.service'

interface Props extends NavigationScreenProps {
  listItem: any
}

@observer
export class BookList extends React.Component<Props> {
  static contextType = InjectorContext

  bookListService = inject(this, BookListService)
  lastIndex: number = 0

  public render() {
    this.lastIndex = this.bookListService.books.length - 1

    return (
      <List>
        <FlatList data={this.bookListService.books}
                  keyExtractor={this.keyExtractor}
                  renderItem={this.renderItem}
        />
      </List>
    )
  }

  private renderItem = ({item, index}) => {
    const Item = this.props.listItem

    return (
      <ListItem last={this.lastIndex === index}>
        <Item navigation={this.props.navigation} book={item}/>
      </ListItem>
    )
  }

  private keyExtractor = item => item.id.toString()
}
