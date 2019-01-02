import * as React from 'react'
import { InjectorContext, inject } from 'react-ioc'
import { observer } from 'mobx-react'
import { NavigationScreenProps } from 'react-navigation'

import { FlatList } from 'react-native'
import { Drawer, List, ListItem, Content, Container } from 'native-base'
import { StatusBar } from 'components/status-bar'

import { BookListService } from '../services/book-list.service'

import { BookListTotal } from './book-list-total'
import { BookListHeader } from './book-list-header'

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
      <Container>
        <StatusBar/>
        <BookListHeader/>
        <Content>
          <List>
            <FlatList data={this.bookListService.books}
                      keyExtractor={this.keyExtractor}
                      renderItem={this.renderItem}
                      ListHeaderComponent={BookListTotal}
            />
          </List>
        </Content>
      </Container>
    )
  }

  private renderItem = ({item, index}) => {
    const Item = this.props.listItem

    return (
      <ListItem style={{height: 150}} last={this.lastIndex === index}>
        <Item navigation={this.props.navigation} book={item}/>
      </ListItem>
    )
  }

  private keyExtractor = item => item.id.toString()
}
