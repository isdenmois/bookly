import React from 'react';
import _ from 'lodash';
import { TextInput, TextStyle } from 'react-native';
import { ColorSchemeContext, DynamicStyleSheet } from 'react-native-dynamic';
import { sortBy, prop } from 'rambdax';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import { observer } from 'mobx-react';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { dynamicColor } from 'types/colors';
import Author from 'store/author';
import { database } from 'store';
import { EditableListItem } from './editable-list-item';
import { BookFilters } from '../book-filters.service';

interface Props {
  authors?: Author[];
  status: BOOK_STATUSES;
  filters: BookFilters;
}

interface State {
  name: string;
}

const withAuthors: Function = withObservables(null, (props: Props) => {
  const queries = [
    Q.experimentalNestedJoin('book_authors', 'books'),
    Q.on('book_authors', Q.on('books', 'status', props.status)),
  ];
  const authors = database.collections.get('authors');

  return { authors: authors.query(...queries) };
});

@withAuthors
@observer
export class BookAuthorFilter extends React.PureComponent<Props, State> {
  static contextType = ColorSchemeContext;
  state: State = { name: '' };

  sortAuthors = sortBy(prop('name'));

  render() {
    if (!this.props.authors) return null;
    let authors = this.props.authors;
    const name = this.state.name.toLowerCase();
    const author = this.props.filters.author;

    if (this.state.name) {
      authors = authors.filter(a => a.name.toLowerCase().indexOf(name) >= 0);
    }

    const s = ds[this.context];
    const placeholderTextColor = dynamicColor.SecondaryText[this.context];

    return (
      <EditableListItem
        title='author'
        fields={this.sortAuthors(authors)}
        labelKey='name'
        value={author?.id}
        onChange={this.setAuthor}
        clearable
      >
        <TextInput
          style={s.input}
          placeholderTextColor={placeholderTextColor}
          onChangeText={this.setName}
          value={this.state.name}
          placeholder='поиск'
        />
      </EditableListItem>
    );
  }

  setName = name => this.setState({ name });

  setAuthor = id => {
    const author = _.find(this.props.authors, { id }) || null;

    this.props.filters.setFilter('author', author && _.pick(author, ['id', 'name']));
    this.setState({ name: '' });
  };
}

const ds = new DynamicStyleSheet({
  input: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    color: dynamicColor.PrimaryText,
    padding: 0,
    paddingRight: 5,
    paddingVertical: 15,
  } as TextStyle,
});
