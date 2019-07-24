import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Database } from '@nozbe/watermelondb';
import { NavigationScreenProps } from 'react-navigation';

import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { color } from 'types/colors';
import { inject } from 'services';
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
  database = inject(Database);
  state: State = { search: '', selected: null };

  render() {
    const { search, selected } = this.state;
    return (
      <Dialog testID='bookSelectModal' modalStyle={s.borderRadius}>
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
    borderTopColor: color.Border,
    borderTopWidth: 0.5,
    paddingVertical: 20,
    backgroundColor: color.Primary,
  } as ViewStyle,
  text: {
    color: color.PrimaryTextInverse,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'sans-serif-medium',
  } as ViewStyle,
});
