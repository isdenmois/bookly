import React, { Component } from 'react';
import { StyleSheet, ViewStyle, FlatList } from 'react-native';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import { NavigationStackProp } from 'react-navigation-stack';
import { t, database } from 'services';
import Author from 'store/author';
import { Screen, SearchBar } from 'components';
import { ColorSchemeContext } from 'react-native-dynamic';
import { AuthorItem } from './components/author-item';
import { EmptyResult } from 'components/fetcher';

interface Props {
  navigation: NavigationStackProp;
  authors: Author[];
}

interface State {
  query: string;
}

const withAuthors: Function = withObservables(null, () => ({
  authors: database.collections.get('authors').query(Q.where('fav', true)),
}));

@withAuthors
export class AuthorsScreen extends Component<Props, State> {
  static contextType = ColorSchemeContext;

  state: State = { query: '' };

  render() {
    return (
      <Screen>
        <SearchBar
          style={s.header}
          value={this.state.query}
          placeholder={t('nav.authors')}
          onChange={this.setQuery}
          onSearch={this.search}
          onBack={this.goBack}
        />

        <FlatList
          contentContainerStyle={s.scroll}
          data={this.props.authors}
          keyExtractor={this.key}
          renderItem={this.renderItem}
          extraData={this.context}
          ListEmptyComponent={Empty}
        />
      </Screen>
    );
  }

  renderItem = ({ item }: { item: Author }) => {
    return <AuthorItem author={item} mode={this.context} />;
  };

  key(item: Author) {
    return item.id;
  }
  setQuery = query => this.setState({ query });
  search = () => {
    this.props.navigation.push('AuthorSearch', { query: this.state.query });
    this.setState({ query: '' });
  };
  goBack = () => this.props.navigation.goBack();
}

function Empty() {
  return <EmptyResult text='authors.no-added' />;
}

const s = StyleSheet.create({
  header: {
    marginVertical: 10,
    marginHorizontal: 10,
  } as ViewStyle,
  scroll: {
    paddingHorizontal: 10,
  } as ViewStyle,
});
