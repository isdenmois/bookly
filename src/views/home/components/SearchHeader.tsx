import * as React from 'react'
import { Header, Item, Input, Icon, Button, Text } from 'native-base'

interface Props {
}

export class SearchHeader extends React.Component<Props> {
  render() {
    const HeaderComponent = Header as any

    return (
      <HeaderComponent searchBar transparent>
        <Item rounded>
          <Icon name='ios-search'/>
          <Input placeholder='Поиск книг'/>
        </Item>
        <Button transparent>
          <Text>Найти</Text>
        </Button>
      </HeaderComponent>
    )
  }
}
