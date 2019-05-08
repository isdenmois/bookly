import React from 'react';
import { InjectorContext, inject } from 'react-ioc';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Database } from '@nozbe/watermelondb';
import { NavigationScreenProps } from 'react-navigation';

import { BOOK_STATUSES } from 'enums/book-statuses.enum';
import { dbSync } from 'services/db';
import Book from 'store/book';
import { Dialog } from 'components/dialog';

import { BookSelectHeader } from './components/header';
import { BookList } from './components/book-list';

interface State {
  search: string;
  selected: Book;
}

export class BookSelectModal extends React.Component<NavigationScreenProps, State> {
  static contextType = InjectorContext;

  database = inject(this, Database);
  state: State = { search: '', selected: null };

  render() {
    const { search, selected } = this.state;
    return (
      <Dialog modalStyle={s.borderRadius} navigation={this.props.navigation}>
        <BookSelectHeader search={this.state.search} onChange={this.setSearch} />
        <BookList
          database={this.database}
          search={search}
          selected={!!selected && selected.id}
          onSelect={this.selectBook}
        />
        {selected && (
          <TouchableOpacity style={[s.button, s.borderRadius]} onPress={this.setBookSelected}>
            <Text style={s.text}>Выбрать</Text>
          </TouchableOpacity>
        )}
      </Dialog>
    );
  }

  selectBook = selected => this.setState({ selected });

  @dbSync updateBook() {
    return this.state.selected.setStatus(BOOK_STATUSES.NOW);
  }

  setSearch = search => this.setState({ search });

  setBookSelected = () => {
    this.updateBook();
    this.props.navigation.pop();
  };
}

const s = StyleSheet.create({
  borderRadius: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
  } as ViewStyle,
  button: {
    borderTopColor: '#E0E0E0',
    borderTopWidth: 0.5,
    paddingVertical: 20,
    backgroundColor: '#009688',
  } as ViewStyle,
  text: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
  } as ViewStyle,
});
