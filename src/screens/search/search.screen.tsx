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
  source?: string;
  forceOpen?: boolean;
  fantlabId?: string;
}

interface State {
  q: string;
  query: string;
  source: string;
}

export const fantlab = 'FantLab';
export const livelib = 'LiveLib';

@withNavigationProps()
export class SearchScreen extends React.Component<Props, State> {
  state: State = {
    q: this.props.query,
    query: this.props.query,
    source: this.props.source || fantlab,
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
          onLoad={this.checkLoad}
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
    return <BookItem key={book.id} book={book} fantlabId={this.props.fantlabId} />;
  };

  toggleSearchSource = () => this.setState({ source: this.state.source === fantlab ? livelib : fantlab });

  checkLoad = (data, append) => {
    // Ничего не найдено -- выходим
    if (append || !data || !data.items || !data.items.length) return;
    // Найдено больше 1 -- выходим
    if (!this.props.forceOpen && data.items.length > 1) return;
    // Изменяли параметры поиска -- выходим
    if (this.props.query !== this.state.q) return;

    const foundOne = data.items.length === 1;
    const item = data.items.find(i => isEqual(i.title, this.state.q, foundOne));

    if (item) {
      this.props.navigation.replace('Details', { bookId: item.id, fantlabId: this.props.fantlabId });
      return true;
    }
  };
  goBack = () => this.props.navigation.goBack();
  setQuery = query => this.setState({ query });
  search = () => this.setState({ q: this.state.query });
}

const e = /ё/gi;

function isEqual(a: string, b: string, withStartsWith: boolean) {
  if (a === b) return true;
  if (!a || !b) return false;
  a = a.replace(e, 'е').toLowerCase();
  b = b.replace(e, 'е').toLowerCase();

  if (withStartsWith) {
    return a.startsWith(b);
  }

  return a === b;
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
