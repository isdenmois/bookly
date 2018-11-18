import * as React from 'react'
import { Constants } from 'expo'
import { Button, Header, Icon, Input, Item, Text } from 'native-base'

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
      <Header searchBar style={{marginTop: Constants.statusBarHeight}}>
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
