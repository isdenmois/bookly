import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { color } from 'types/colors';
import Book from 'store/book';
import { Dialog } from 'components';

import { BookSelectHeader } from './components/header';
import { BookList } from './components/book-list';
import { t } from 'services';

interface Props {
  navigation: NavigationScreenProp<any>;
}

interface State {
  search: string;
  selected: Book;
}

export class BookSelectModal extends React.Component<Props, State> {
  state: State = { search: '', selected: null };

  render() {
    const { search, selected } = this.state;
    return (
      <Dialog testID='BookSelectModal' modalStyle={s.borderRadius}>
        <BookSelectHeader search={this.state.search} onChange={this.setSearch} />
        <BookList search={search} selected={!!selected && selected.id} onSelect={this.selectBook} />
        {selected && (
          <TouchableOpacity style={[s.button, s.borderRadius]} onPress={this.setBookSelected} testID='DoSelectBook'>
            <Text style={s.text}>{t('button.apply')}</Text>
          </TouchableOpacity>
        )}
      </Dialog>
    );
  }

  selectBook = selected => this.setState({ selected });

  updateBook() {
    return this.state.selected.setStatus(BOOK_STATUSES.NOW);
  }

  setSearch = search => this.setState({ search });

  setBookSelected = () => {
    this.updateBook();
    this.props.navigation.goBack();
  };
}

const s = StyleSheet.create({
  borderRadius: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
  } as ViewStyle,
  button: {
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
