import React from 'react';
import _ from 'lodash';
import { NavigationScreenProps } from 'react-navigation';
import { StyleSheet, ScrollView, View, Text, ViewStyle } from 'react-native';
import { inject, InjectorContext } from 'react-ioc';
import { FantlabAPI } from 'api';
import Book from 'store/book';
import { Fetcher } from 'components/fetcher';
import { SearchBar } from 'components/search-bar';
import { BookItem } from 'components/book-item';
import { EmptyResult } from './empty-result';

interface State {
  q: string;
  query: string;
}

export class SearchScreen extends React.Component<NavigationScreenProps, State> {
  static contextType = InjectorContext;

  state: State = {
    q: this.props.navigation.getParam('query'),
    query: this.props.navigation.getParam('query'),
  };

  api = inject(this, FantlabAPI);

  render() {
    return (
      <View style={s.container}>
        <SearchBar
          style={s.header}
          value={this.state.query}
          onChange={this.setQuery}
          onSearch={this.search}
          onBack={this.goBack}
        />

        <Fetcher q={this.state.q} api={this.api.searchBooks} empty={EmptyResult}>
          {this.renderResult}
        </Fetcher>
      </View>
    );
  }

  renderResult = (data: Book[], error) => {
    if (error) {
      return this.renderError(error);
    }

    return (
      <ScrollView contentContainerStyle={s.scroll}>
        {_.map(data, book => (
          <BookItem book={book} key={book.id} navigation={this.props.navigation} />
        ))}
      </ScrollView>
    );
  };

  renderError(error) {
    return <Text>{JSON.stringify(error)}</Text>;
  }

  goBack = () => this.props.navigation.pop();
  setQuery = query => this.setState({ query });
  search = () => this.setState({ q: this.state.query });
}

const s = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flexDirection: 'column',
    flex: 1,
  } as ViewStyle,
  header: {
    marginVertical: 10,
    marginHorizontal: 10,
  } as ViewStyle,
  scroll: {
    paddingHorizontal: 10,
    paddingBottom: 10,
  } as ViewStyle,
});