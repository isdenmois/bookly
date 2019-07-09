import React from 'react';
import { TextInput, StyleSheet, TextStyle } from 'react-native';
import { sortBy, prop } from 'rambdax';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import { color } from 'types/colors';
import Author from 'store/author';
import { EditableListItem } from './editable-list-item';

interface Props {
  authors?: Author[];
  value: string;
  onChange: (type: string, authorId: string) => void;
}

interface State {
  name: string;
}

@withObservables([], ({ database, status }) => {
  const queries = [Q.on('books', 'status', status), Q.on('book_authors', '_status', Q.notEq('deleted'))];

  return {
    authors: database.collections.get('authors').query(...queries),
  };
})
export class BookAuthorFilter extends React.PureComponent<Props, State> {
  state: State = { name: '' };

  sortAuthors = sortBy(prop('name'));

  render() {
    if (!this.props.authors) return null;
    let authors = this.props.authors;
    const name = this.state.name.toLowerCase();

    if (this.state.name) {
      authors = authors.filter(a => a.name.toLowerCase().indexOf(name) >= 0);
    }

    return (
      <EditableListItem
        title='Автор'
        fields={this.sortAuthors(authors)}
        labelKey='name'
        value={this.props.value}
        onChange={this.setAuthor}
        clearable
      >
        <TextInput style={s.input} onChangeText={this.setName} value={this.state.name} />
      </EditableListItem>
    );
  }

  setName = name => this.setState({ name });

  setAuthor = value => {
    this.props.onChange('author', value);
    this.setState({ name: '' });
  };
}

const s = StyleSheet.create({
  input: {
    flex: 1,
    textAlign: 'right',
    fontSize: 16,
    color: color.Black,
    padding: 0,
    paddingRight: 5,
    paddingVertical: 15,
  } as TextStyle,
});
