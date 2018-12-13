import * as React from 'react'
import { Header, Item, Icon, Button, Text } from 'native-base'
import { NavigationScreenProps } from 'react-navigation'

import { Field } from 'components/field'

interface Props extends NavigationScreenProps {
}

interface State {
  value: string
}

export class SearchHeader extends React.Component<Props, State> {
  state: State = {value: ''}

  render() {
    return (
      <Header searchBar transparent>
        <Item rounded>
          <Icon name='ios-search'/>
          <Field placeholder='Поиск книг'
                 returnKeyType='search'
                 value={this.state.value}
                 onChangeText={this.saveText}
                 onSubmitEditing={this.openBooksSearchScreen}/>
        </Item>
        <Button transparent onPress={this.openBooksSearchScreen}>
          <Text>Найти</Text>
        </Button>
      </Header>
    )
  }

  saveText = value => this.setState({value})

  openBooksSearchScreen = () => {
    if (this.state.value) {
      this.props.navigation.push('BooksSearch', {query: this.state.value})
      this.setState({value: ''})
    }
  }
}
