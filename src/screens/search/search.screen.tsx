import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { color } from 'types/colors';
import { withNavigationProps } from 'utils/with-navigation-props';
import { inject } from 'services';
import { FantlabAPI } from 'api';
import Book from 'store/book';
import { BookItem, Fetcher, SearchBar } from 'components';

interface Props extends NavigationScreenProps {
  query: string;
}

interface State {
  q: string;
  query: string;
}

@withNavigationProps()
export class SearchScreen extends React.Component<Props, State> {
  state: State = {
    q: this.props.query,
    query: this.props.query,
  };

  api = inject(FantlabAPI);

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
        <Fetcher
          contentContainerStyle={s.scroll}
          api={this.api.searchBooks}
          q={this.state.q}
          emptyText='Книги не найдены'
          useFlatlist
        >
          {this.renderResult}
        </Fetcher>
      </View>
    );
  }

  renderResult = (book: Book) => {
    return <BookItem key={book.id} book={book} />;
  };

  goBack = () => this.props.navigation.pop();
  setQuery = query => this.setState({ query });
  search = () => this.setState({ q: this.state.query });
}

const s = StyleSheet.create({
  container: {
    backgroundColor: color.Background,
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
