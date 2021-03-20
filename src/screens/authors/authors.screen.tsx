import React, { Component } from 'react';
import { StyleSheet, ViewStyle, FlatList } from 'react-native';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import { ColorSchemeContext } from 'react-native-dynamic';

import { MainRoutes, MainScreenProps } from 'navigation/routes';
import { t, database } from 'services';
import Author from 'store/author';
import { Screen, SearchBar } from 'components';
import { EmptyResult } from 'components/fetcher';
import { AuthorItem } from './components/author-item';

type Props = MainScreenProps<MainRoutes.Authors> & {
  authors: Author[];
};

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
    this.props.navigation.push(MainRoutes.AuthorSearch, { query: this.state.query });
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
