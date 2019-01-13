import * as React from 'react'
import { InjectorContext, inject } from 'react-ioc'
import { computed } from 'mobx'
import * as _ from 'lodash'

import { Text, View, StyleSheet, ViewStyle, TextInput, TextStyle } from 'react-native'
import { Button } from 'native-base'

import { DataContext } from 'services'
import { BookListService } from '../services/book-list.service'

import { textM, paddingM } from 'constants/theme'
import { BookListOptionSelect } from './book-list-option-select'
import { TextM } from 'components/text'

interface Props {
  onClose: () => void
}

interface State {
  year: number
  authorId: number
  bookType: string
}

export class BookListOptions extends React.Component<Props, State> {
  static contextType = InjectorContext

  bookListService = inject(this, BookListService)
  dataContext = inject(this, DataContext)
  state: State = {
    year: this.bookListService.year,
    authorId: this.bookListService.authorId,
    bookType: this.bookListService.bookType,
  }

  render() {
    const filters = this.bookListService.filters

    return (
      <View style={s.container}>
        {filters.year && this.renderYearFilter()}
        {filters.author && this.renderAuthorFilter()}
        {filters.type && this.renderBookTypeFilter()}

        <Button full onPress={this.setFilters}>
          <Text>Применить</Text>
        </Button>
      </View>
    )
  }

  renderYearFilter() {
    const year = this.state.year

    return (
      <View style={s.filter}>
        <TextM style={s.filterLabel}>Год</TextM>
        <TextInput style={s.filterValue}
                   keyboardType='numeric'
                   placeholder='Год'
                   value={year && year.toString() || ''}
                   onChangeText={this.setYear}/>
      </View>
    )
  }

  renderAuthorFilter() {
    return (
      <View style={s.filter}>
        <TextM style={s.filterLabel}>Автор</TextM>
        <BookListOptionSelect data={this.bookListService.authorList}
                              textStyle={s.filterValue}
                              placeholder='Автор'
                              selected={this.state.authorId}
                              onSelect={this.setAuthor}
        />
      </View>
    )
  }

  renderBookTypeFilter() {
    return (
      <View style={s.filter}>
        <TextM style={s.filterLabel}>Тип книги</TextM>
        <BookListOptionSelect data={this.bookListService.bookTypeList}
                              textStyle={s.filterValue}
                              placeholder='Тип книги'
                              selected={this.state.bookType}
                              onSelect={this.setBookType}
        />
      </View>
    )
  }

  setYear = year => this.setState({year: +year})
  setAuthor = authorId => this.setState({authorId})
  setBookType = bookType => this.setState({bookType})

  setFilters = () => {
    this.bookListService.setFilters(this.state)
    this.props.onClose()
  }
}

const s = StyleSheet.create({
  container: {
    width: 300,
    flexDirection: 'column',
    alignItems: 'stretch',
  } as ViewStyle,
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  } as ViewStyle,
  filterLabel: {
    flex: 1,
  },
  filterValue: {
    flex: 3,
    fontSize: textM,
    paddingVertical: paddingM,
  } as TextStyle,
})
