import * as React from 'react'
import { InjectorContext, inject } from 'react-ioc'

import { textM, paddingM } from 'constants/theme'
import { DataContext } from 'services'

import { Text, View, StyleSheet, ViewStyle, TextInput, TextStyle } from 'react-native'
import { Button, Icon } from 'native-base'
import { TextM } from 'components/text'
import { BookListService } from '../services/book-list.service'

import { BookListOptionSelect } from './book-list-option-select'
import { BookListSort } from './book-list-sort'

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
        {this.renderSort()}
        {filters.year && this.renderYearFilter()}
        {filters.author && this.renderAuthorFilter()}
        {filters.type && this.renderBookTypeFilter()}

        <Button full onPress={this.setFilters}>
          <Text>Применить</Text>
        </Button>
      </View>
    )
  }

  renderSort() {
    return (
      <View style={s.filter}>
        <TextM style={s.filterLabel}>Сортировка</TextM>
        <BookListSort textStyle={s.filterValue}/>
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
        {Boolean(year) &&
          <Icon onPress={() => this.setYear(0)} name='ios-close'/>
        }
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
        {Boolean(this.state.authorId) &&
          <Icon onPress={() => this.setAuthor(0)} name='ios-close'/>
        }
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
        {Boolean(this.state.bookType) &&
          <Icon onPress={() => this.setBookType(null)} name='ios-close'/>
        }
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
    padding: 10,
  } as ViewStyle,
  filter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  } as ViewStyle,
  filterLabel: {
    flex: 2,
  },
  filterValue: {
    flex: 4,
    fontSize: textM,
    paddingVertical: paddingM,
  } as TextStyle,
})
