import React, { Component } from 'react';
import _ from 'lodash';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ImageStyle,
  TextStyle,
  ViewStyle,
  Platform,
} from 'react-native';
import { DynamicStyleSheet, ColorSchemeContext } from 'react-native-dynamic';
import { Thumbnail, ScreenHeader, Screen } from 'components';
import { navigation } from 'services';
import Book from 'store/book';
import { dynamicColor, boldText, lightText } from 'types/colors';
import { merge } from './top-rate-sort';

interface Props {
  navigation: any;
}

interface State {
  result: Book[];
  pair: Book[];
  pollEnabled: boolean;
}

export class TopRateScreen extends Component<Props> {
  static contextType = ColorSchemeContext;

  state = {
    result: null,
    pair: null,
    pollEnabled: null,
  };

  match = _.noop;

  compare = (a: Book, b: Book) => {
    this.setState({ pair: [a, b], pollEnabled: true });

    return new Promise<0 | 1>(resolve => {
      this.match = resolve;
    }).then(index => {
      this.setState({ pollEnabled: null });
      return this.state.pair[index].id === a.id;
    });
  };

  async componentDidMount() {
    const books = this.props.navigation.getParam('books');

    if (books.length > 1) {
      const result = await merge(_.shuffle(books), this.compare);
      this.setState({ result, pair: null });
    } else {
      this.setState({ result: books });
    }
  }

  render() {
    const mode = this.context;
    const { result, pair, pollEnabled } = this.state;
    const s = ds[this.context];

    if (!result) {
      return (
        <Screen>
          <ScreenHeader title='Сравните' />

          {pair && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <BookMatch book={pair[0]} onSelect={pollEnabled && this.matchA} mode={mode} />
              <BookMatch book={pair[1]} onSelect={pollEnabled && this.matchB} mode={mode} />
            </View>
          )}
        </Screen>
      );
    }

    if (result.length < 2) {
      return (
        <Screen>
          <ScreenHeader title='Сравните' />

          <View style={s.empty}>
            <Text style={s.emptyText}>Недостаточно данных для сравнения</Text>
          </View>
        </Screen>
      );
    }

    const short = result.length > 5 ? 3 : 2;
    const long = 6;
    const shortTop = result.length > 3 ? result.slice(1, short) : [];
    const longTop = result.length > 10 ? result.slice(short, long) : [];

    return (
      <Screen>
        <ScreenHeader title='' />

        <ScrollView contentContainerStyle={s.scroll}>
          <Text style={[s.topText, s.firstTop]}>Лучшая книга</Text>
          <BookItem book={result[0]} width={150} height={250} mode={mode} fontSize={18} openable />

          {shortTop.length > 0 && (
            <>
              <Text style={s.topText}>ТОП {short > 2 ? `2-${short}` : 2}</Text>
              <FlatList
                horizontal
                data={shortTop}
                keyExtractor={b => b.id}
                renderItem={({ item }) => (
                  <BookItem book={item} width={100} height={160} mode={mode} fontSize={16} openable />
                )}
              />
            </>
          )}

          {longTop.length > 0 && (
            <>
              <Text style={s.topText}>
                ТОП {short + 1}-{long}
              </Text>
              <FlatList
                horizontal
                data={longTop}
                keyExtractor={b => b.id}
                renderItem={({ item }) => (
                  <BookItem book={item} width={65} height={100} mode={mode} fontSize={14} openable />
                )}
              />
            </>
          )}

          <Text style={s.topText}>Все</Text>
          <FlatList
            style={s.all}
            contentContainerStyle={s.allScroll}
            horizontal
            data={result}
            keyExtractor={b => b.id}
            renderItem={({ item, index }) => (
              <BookItem book={item} width={65} height={100} mode={mode} fontSize={14} n={index + 1} openable />
            )}
          />
        </ScrollView>
      </Screen>
    );
  }

  matchA = () => this.match(0);
  matchB = () => this.match(1);
}

function BookMatch({ book, mode, onSelect }) {
  return (
    <TouchableOpacity onPress={onSelect}>
      <BookItem book={book} width={150} height={250} mode={mode} fontSize={16} />
    </TouchableOpacity>
  );
}

function BookItem({ book, width, height, mode, fontSize, n = null, openable = false }) {
  const s = ds[mode];
  const Cmp: any = openable ? TouchableOpacity : View;
  const onPress = openable ? () => navigation.push('Details', { bookId: book.id }) : null;

  return (
    <Cmp style={[s.book, { width }]} onPress={onPress}>
      {n !== null && <Text style={s.n}>#{n}</Text>}
      <Thumbnail style={s.thumbnail} width={width} height={height} title={book.title} url={book.thumbnail} cache />
      <Text style={[s.title, { fontSize }]} numberOfLines={1}>
        {book.title}
      </Text>
      <Text style={[s.author, { fontSize }]} numberOfLines={1}>
        {book.author}
      </Text>
    </Cmp>
  );
}

const ds = new DynamicStyleSheet({
  scroll: {
    alignItems: 'center',
    marginBottom: 20,
  } as ViewStyle,
  firstTop: {
    marginTop: 0,
  } as TextStyle,
  topText: {
    fontSize: 20,
    color: dynamicColor.PrimaryText,
    marginTop: 30,
    marginBottom: 10,
    ...boldText,
  } as TextStyle,
  thumbnail: {
    borderRadius: 10,
  } as ImageStyle,
  title: {
    fontSize: 20,
    color: dynamicColor.PrimaryText,
    marginTop: 5,
    overflow: 'hidden',
    textAlign: 'center',
    ...boldText,
  } as TextStyle,
  author: {
    fontSize: 20,
    color: dynamicColor.PrimaryText,
    marginTop: 5,
    overflow: 'hidden',
    textAlign: 'center',
    ...lightText,
  } as TextStyle,
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  emptyText: {
    fontSize: 16,
    color: dynamicColor.Empty,
  } as TextStyle,
  book: {
    overflow: 'hidden',
    marginHorizontal: 3,
  } as ViewStyle,
  n: {
    fontSize: 14,
    color: dynamicColor.PrimaryText,
    textAlign: 'center',
  } as TextStyle,
  all: {
    alignSelf: 'stretch',
    ...Platform.select({
      android: {
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    }),
  } as ViewStyle,
  allScroll: {
    ...Platform.select({
      web: {
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    }),
    paddingHorizontal: 10,
  } as ViewStyle,
});
