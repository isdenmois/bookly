import * as React from 'react'
import { FantlabWork } from '../api/fantlab'
import * as _ from 'lodash'
import { ActivityIndicator } from 'react-native'
import { List, ListItem } from 'native-base'

interface Props {
  loading: boolean
  books: FantlabWork[]
  itemComponent: any
  emptyComponent: any
}

export class WorkList extends React.Component<Props> {
  render() {
    if (this.props.loading) return <ActivityIndicator size='large'/>

    const { emptyComponent: Empty, itemComponent: Item, books} = this.props

    return (
      <>
        {this.props.books && !this.props.books.length && <Empty/>}

        {this.props.books && this.props.books.length > 0 &&
          <List>
            {_.map(books, item =>
              <ListItem key={item.work_id}>
                <Item item={item}/>
              </ListItem>
            )}
          </List>
        }
      </>
    )
  }
}
