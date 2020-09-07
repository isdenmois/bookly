import React from 'react';
import { Text, TouchableOpacity, ViewStyle } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';

import { dynamicColor, boldText } from 'types/colors';
import { Dialog } from 'components';

import { BookSelectHeader } from './book-select/components/header';
import { BookList } from './book-select/components/book-list';
import { t, database } from 'services';
import { ColorSchemeContext, DynamicStyleSheet } from 'react-native-dynamic';
import ListBook, { prepareAddBooks, prepareRemoveBooks } from 'store/list-book';
import { Q } from '@nozbe/watermelondb';
import _ from 'lodash';
import { dbAction } from 'services/db';

interface Props {
  navigation: NavigationScreenProp<any>;
}

interface State {
  search: string;
  selected: Set<string>;
  initialSelected: string[];
}

export class ListBookSelectModal extends React.Component<Props, State> {
  static contextType = ColorSchemeContext;

  state: State = { search: '', selected: new Set(), initialSelected: [] };

  render() {
    const { search, selected } = this.state;
    const s = ds[this.context];

    return (
      <Dialog testID='BookSelectModal' modalStyle={s.borderRadius}>
        <BookSelectHeader search={this.state.search} onChange={this.setSearch} />
        <BookList search={search} selected={selected} onSelect={this.selectBook} onUnselect={this.unSelectBook} />

        <TouchableOpacity style={[s.button, s.borderRadius]} onPress={this.setBookSelected} testID='DoSelectBook'>
          <Text style={s.text}>{t('button.apply')}</Text>
        </TouchableOpacity>
      </Dialog>
    );
  }

  async componentDidMount() {
    const listId = this.props.navigation.getParam('listId');
    const listBooks = database.collections.get<ListBook>('list_books');

    const models = await listBooks.query(Q.where('list_id', listId)).fetch();
    const selected = models.map(m => m.book.id) as string[];

    this.setState({ initialSelected: selected, selected: new Set(selected) });
  }

  isSelected = id => this.state.selected.has(id);

  selectBook = id => {
    this.state.selected.add(id);
    this.setState({ selected: new Set(this.state.selected) });
  };

  unSelectBook = id => {
    this.state.selected.delete(id);
    this.setState({ selected: new Set(this.state.selected) });
  };

  @dbAction async updateBooks() {
    const listId = this.props.navigation.getParam('listId');
    const selected = Array.from(this.state.selected);
    const toAdd = _.difference(selected, this.state.initialSelected);
    const toRemove = _.difference(this.state.initialSelected, selected);

    return database.batch(
      ...prepareAddBooks(database, listId, toAdd),
      ...(await prepareRemoveBooks(database, listId, toRemove)),
    );
  }

  setSearch = search => this.setState({ search });

  setBookSelected = () => {
    this.updateBooks();
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
