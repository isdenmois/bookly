import React, { Component } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { NavigationStackProp } from 'react-navigation-stack';
import { withNavigationProps } from 'utils/with-navigation-props';
import { t } from 'services';
import { ColorSchemeContext } from 'react-native-dynamic';
import Author from 'store/author';
import { Screen, SearchBar, Fetcher } from 'components';
import { AuthorItem } from './components/author-item';
import { api } from 'services';

interface Props {
  navigation: NavigationStackProp;
  query: string;
}

interface State {
  query: string;
  q: string;
}

@withNavigationProps()
export class AuthorSearchScreen extends Component<Props, State> {
  static contextType = ColorSchemeContext;

  state: State = { query: this.props.query, q: this.props.query };

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
