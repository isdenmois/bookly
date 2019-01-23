import * as React from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { Button, Header, Icon, Input, Item, Left, Text } from 'native-base'

import { color } from 'constants/colors'
import { If } from 'components/if'

interface Props extends NavigationScreenProps {
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
        <Left style={s.left}>
          <Button icon transparent onPress={() => this.props.navigation.goBack()}>
            <Icon style={s.icon} name='arrow-back' />
          </Button>
        </Left>
        <Item>
          <Icon name='ios-search'/>
          <Input placeholder='Поиск книг'
                 returnKeyType='search'
                 onChangeText={this.updateState}
                 onSubmitEditing={this.change}
                 value={this.state.value}/>
          {If(this.state.value) &&
            <Icon onPress={() => this.updateState('')} name='ios-close'/>
          }
        </Item>

        <Button transparent onPress={this.change}>
          <Text>Найти</Text>
        </Button>
      </Header>
    )
  }

  updateState = value => this.setState({value})
  change = () => this.props.onChange(this.state.value)
}

const s = StyleSheet.create({
  header: {
    backgroundColor: color.Green,
  } as ViewStyle,
  left: {
    flex: 0,
  } as ViewStyle,
  icon: {
    color: color.Black,
  },
})
