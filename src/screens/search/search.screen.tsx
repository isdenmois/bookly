import React from 'react';
import { View, ViewStyle, TextStyle, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { dynamicColor, getColor } from 'types/colors';
import { api } from 'services';
import Book from 'store/book';
import { BookItem, Button, Fetcher, SearchBar, Screen } from 'components';
import { ColorSchemeContext, DynamicStyleSheet } from 'react-native-dynamic';
import { MainRoutes, MainScreenProps } from 'navigation/routes';

type Props = MainScreenProps<MainRoutes.Search>;

interface State {
  q: string;
  query: string;
  source: 'FantLab' | 'LiveLib';
}

export const fantlab = 'FantLab';
export const livelib = 'LiveLib';

export class SearchScreen extends React.Component<Props, State> {
  static contextType = ColorSchemeContext;

  state: State = {
    q: this.props.route.params.query,
    query: this.props.route.params.query,
    source: this.props.route.params.source || fantlab,
  };

  render() {
    const apiProp = this.state.source === fantlab ? api.searchBooks : api.lBooksSearch;
    const s = ds[this.context];
    const color = getColor(this.context);

    return (
      <Screen testID='searchScreen'>
        <SearchBar
          style={s.header}
          value={this.state.query}
          onChange={this.setQuery}
          onSearch={this.search}
          onBack={this.goBack}
        />
        <Fetcher
          contentContainerStyle={s.scroll}
          api={apiProp}
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
            testID='sourceToggler'
            textTestID='sourceTogglerText'
          />
        </View>
      </Screen>
    );
  }

  renderResult = (book: Book) => {
    let extra;
    if (this.props.route.params.paper && !book.status) {
      book.paper = true;
      extra = { paper: true };
    }

    return <BookItem key={book.id} book={book} fantlabId={this.props.route.params.fantlabId} extra={extra} />;
  };

  toggleSearchSource = () => this.setState({ source: this.state.source === fantlab ? livelib : fantlab });

  checkLoad = (data, append) => {
    // Ничего не найдено -- выходим
    if (append || !data?.items?.length) return;
    // Найдено больше 1 -- выходим
    if (!this.props.route.params.forceOpen && data.items.length > 1) return;
    // Изменяли параметры поиска -- выходим
    if (this.props.route.params.query !== this.state.q) return;
    if (this.props.route.params.source !== this.state.source) return;

    const foundOne = data.items.length === 1;
    const item = data.items.find(i => isEqual(i.title, this.state.q, foundOne));

    if (item) {
      this.props.navigation.replace(MainRoutes.Details, {
        bookId: item.id,
        fantlabId: this.props.route.params.fantlabId,
      });
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

const ds = new DynamicStyleSheet({
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
    backgroundColor: dynamicColor.SearchBackground,
    ...Platform.select({
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 1px 4px #0003',
      },
    }),
  } as ViewStyle,
  buttonText: {
    color: dynamicColor.PrimaryText,
  } as TextStyle,
});
