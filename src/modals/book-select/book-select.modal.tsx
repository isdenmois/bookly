import React from 'react';
import { Text, TouchableOpacity, ViewStyle } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { dynamicColor, boldText } from 'types/colors';
import Book from 'store/book';
import { Dialog } from 'components';

import { BookSelectHeader } from './components/header';
import { BookList } from './components/book-list';
import { t } from 'services';
import { ColorSchemeContext, DynamicStyleSheet } from 'react-native-dynamic';

interface Props {
  navigation: NavigationScreenProp<any>;
}

interface State {
  search: string;
  selected: Book;
}

export class BookSelectModal extends React.Component<Props, State> {
  static contextType = ColorSchemeContext;

  state: State = { search: '', selected: null };

  render() {
    const { search, selected } = this.state;
    const s = ds[this.context];

    return (
      <Dialog testID='bookSelectModal' modalStyle={s.borderRadius}>
        <BookSelectHeader search={this.state.search} onChange={this.setSearch} />
        <BookList search={search} selected={!!selected && selected.id} onSelect={this.selectBook} />
        {selected && (
          <TouchableOpacity style={[s.button, s.borderRadius]} onPress={this.setBookSelected} testID='doSelectBook'>
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

const ds = new DynamicStyleSheet({
  borderRadius: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
  } as ViewStyle,
  button: {
    paddingVertical: 20,
    backgroundColor: dynamicColor.Primary,
  } as ViewStyle,
  text: {
    color: dynamicColor.PrimaryTextInverse,
    fontSize: 18,
    textAlign: 'center',
    ...boldText,
  } as ViewStyle,
});
