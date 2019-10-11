import React from 'react';
import { NavigationStackProp } from 'react-navigation-stack';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { color } from 'types/colors';
import { withNavigationProps } from 'utils/with-navigation-props';
import { inject } from 'services';
import { API } from 'api';
import Book from 'store/book';
import { BookItem, Button, Fetcher, SearchBar } from 'components';

interface Props {
  navigation: NavigationStackProp;
  query: string;
}

interface State {
  q: string;
  query: string;
  source: string;
}

const fantlab = 'FantLab';
const livelib = 'LiveLib';

@withNavigationProps()
export class SearchScreen extends React.Component<Props, State> {
  state: State = {
    q: this.props.query,
    query: this.props.query,
    source: fantlab,
  };

  api = inject(API);

  render() {
    const api = this.state.source === fantlab ? this.api.searchBooks : this.api.lBooksSearch;

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
          api={api}
          q={this.state.q}
          collection='books'
          emptyText='Книги не найдены'
          useFlatlist
        >
          {this.renderResult}
        </Fetcher>

        <View style={s.buttonContainer}>
          <Button
            label={this.state.source}
            onPress={this.toggleSearchSource}
            icon={<Icon name='globe' size={18} color={color.PrimaryText} />}
            style={s.button}
            textStyle={s.buttonText}
          />
        </View>
      </View>
    );
  }

  renderResult = (book: Book) => {
    return <BookItem key={book.id} book={book} />;
  };

  toggleSearchSource = () => this.setState({ source: this.state.source === fantlab ? livelib : fantlab });

  goBack = () => this.props.navigation.goBack();
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
    paddingBottom: 60,
  } as ViewStyle,
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  } as ViewStyle,
  button: {
    backgroundColor: color.Background,
    elevation: 3,
  } as ViewStyle,
  buttonText: {
    color: color.PrimaryText,
  } as TextStyle,
});
