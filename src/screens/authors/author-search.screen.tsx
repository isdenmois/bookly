import React, { Component } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { ColorSchemeContext } from 'react-native-dynamic';

import { MainRoutes, MainScreenProps } from 'navigation/routes';
import { api, t } from 'services';
import Author from 'store/author';
import { Screen, SearchBar, Fetcher } from 'components';
import { AuthorItem } from './components/author-item';

type Props = MainScreenProps<MainRoutes.AuthorSearch>;

interface State {
  query: string;
  q: string;
}

export class AuthorSearchScreen extends Component<Props, State> {
  static contextType = ColorSchemeContext;

  state: State = { query: this.props.route.params.query, q: this.props.route.params.query };

  observeColumns = ['fav'];

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
        <Fetcher
          contentContainerStyle={s.scroll}
          api={api.authors}
          q={this.state.q}
          collection='authors'
          emptyText='authors.not-found'
          observeColumns={this.observeColumns}
          useFlatlist
        >
          {this.renderResult}
        </Fetcher>
      </Screen>
    );
  }

  renderResult = (author: Author) => <AuthorItem author={author} mode={this.context} />;

  setQuery = query => this.setState({ query });
  search = () => {
    this.setState({ q: this.state.query });
  };
  goBack = () => this.props.navigation.goBack();
}

const s = StyleSheet.create({
  header: {
    marginVertical: 10,
    marginHorizontal: 10,
  } as ViewStyle,
  scroll: {
    paddingHorizontal: 10,
  },
});
