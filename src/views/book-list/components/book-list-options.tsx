import * as React from 'react'
import { InjectorContext, inject } from 'react-ioc'

import { Text, View, StyleSheet, ViewStyle, TextInput } from 'react-native'
import { Button } from 'native-base'

import { BookListService } from '../services/book-list.service'

interface Props {
  onClose: () => void
}

interface State {
  year: number
}

export class BookListOptions extends React.Component<Props, State> {
  static contextType = InjectorContext

  bookListService = inject(this, BookListService)
  state: State = {
    year: this.bookListService.year,
  }

  render() {
    const { year } = this.state,
          filters = this.bookListService.filters

    return (
      <View style={s.container}>
        <Text>Фильтры для "{this.bookListService.title}"</Text>
        {filters.year &&
          <TextInput keyboardType='numeric'
                    placeholder='Год'
                    value={year && year.toString() || ''}
                    onChangeText={this.setYear}/>
        }
        <Button onPress={this.setFilters}>
          <Text>Применить</Text>
        </Button>
      </View>
    )
  }

  setYear = year => this.setState({year: +year})
  setFilters = () => {
    this.bookListService.setFilters(this.state)
    this.props.onClose()
  }
}

const s = StyleSheet.create({
  container: {
    width: 300,
  } as ViewStyle,
})
