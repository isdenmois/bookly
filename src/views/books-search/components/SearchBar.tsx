import * as React from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { Button, Header, Icon, Input, Item, Text } from 'native-base'

import * as color from 'constants/colors'

interface Props {
  value: string
  onChange: (value: string) => void
}

interface State {
  value: string
}

export class SearchBar extends React.Component<Props, State> {
  state: State = {value: this.props.value}

  render() {
    return (
      <Header searchBar style={s.header}>
        <Item>
          <Icon name='ios-search'/>
          <Input placeholder='Поиск книг'
                 returnKeyType='search'
                 onChangeText={this.updateState}
                 onSubmitEditing={this.change}
                 value={this.state.value}/>
        </Item>

        <Button transparent onPress={this.change}>
          <Text>Search</Text>
        </Button>
      </Header>
    )
  }

  updateState = value => this.setState({value})
  change = () => this.props.onChange(this.state.value)
}

const s = StyleSheet.create({
  header: {
    backgroundColor: color.green,
  } as ViewStyle,
})
