import React, { Component } from 'react';
import _ from 'lodash';
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { Thumbnail, ScreenHeader } from 'components';
import { color } from 'types/colors';

interface Props {}

const SHORT_TOP = 3;
const LONG_TOP = 5;

export class TopRateScreen extends Component<Props> {
  books = _.shuffle(this.props.navigation.getParam('books'));
  state = {
    // longTop: this.books,
    // shortTop: this.books.slice(0, 3),
    // best: this.books[0],
    pair: getPair(this.books),
  };

  render() {
    if (!this.state.best) {
      return (
        <View>
          <ScreenHeader title='Сравните' />

          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <BookMatch book={this.state.pair[0]} onSelect={this.matchA} />
            <BookMatch book={this.state.pair[1]} onSelect={this.matchB} />
          </View>
        </View>
      );
    }

    const { best, shortTop, longTop } = this.state;

    return (
      <ScrollView contentContainerStyle={s.top}>
        <ScreenHeader title='' />

        <Text style={s.topText}>Лучшая книга</Text>
        <BookItem book={best} width={150} height={250} />

        {shortTop?.length >= SHORT_TOP && (
          <>
            <Text style={s.topText}>ТОП-{SHORT_TOP}</Text>
            <FlatList
              horizontal
              data={shortTop}
              keyExtractor={b => b.id}
              renderItem={({ item }) => <BookItem book={item} width={100} height={160} />}
            />
          </>
        )}

        {longTop?.length >= LONG_TOP && (
          <>
            <Text style={s.topText}>ТОП-{LONG_TOP}</Text>
            <FlatList
              horizontal
              data={longTop}
              keyExtractor={b => b.id}
              renderItem={({ item }) => <BookItem book={item} width={65} height={100} />}
            />
          </>
        )}
      </ScrollView>
    );
  }

  matchA = () => this.match(0);
  matchB = () => this.match(1);

  match(winnerIndex: number) {
    const looser = this.state.pair[1 - winnerIndex];

    this.books = this.books.filter(b => b.id !== looser.id);

    if (this.books.length === 1) {
      this.setState({ pair: [], best: this.state.pair[winnerIndex] });
    } else {
      this.setState({
        pair: getPair(this.books),
        // longTop: this.books.length === LONG_TOP ? this.books : this.state.longTop,
        // shortTop: this.books.length === SHORT_TOP ? this.books : this.state.shortTop,
      });
    }
  }
}

function BookMatch({ book, onSelect }) {
  return (
    <TouchableOpacity onPress={onSelect}>
      <BookItem book={book} width={150} height={250} />
    </TouchableOpacity>
  );
}

function BookItem({ book, width, height }) {
  return (
    <View style={{ overflow: 'hidden', width }}>
      <Thumbnail style={s.thumbnail} width={width} height={height} title={book.title} url={book.thumbnail} cache />
      <Text style={s.title} numberOfLines={1}>
        {book.title}
      </Text>
      <Text style={s.author} numberOfLines={1}>
        {book.author}
      </Text>
    </View>
  );
}

function getPair(array): any[] {
  if (array.length <= 2) return array;

  const index = Math.floor(Math.random() * (array.length - 2));

  return [array[index], array[index + 1]];
}

const s = StyleSheet.create({
  top: {
    alignItems: 'center',
  } as ViewStyle,
  topText: {
    fontSize: 20,
    color: color.PrimaryText,
    fontFamily: 'sans-serif-medium',
  } as TextStyle,
  thumbnail: {
    borderRadius: 10,
  } as ImageStyle,
  title: {
    fontSize: 20,
    color: color.PrimaryText,
    fontFamily: 'sans-serif-medium',
    marginTop: 20,
    overflow: 'hidden',
  } as TextStyle,
  author: {
    fontSize: 20,
    color: color.PrimaryText,
    fontFamily: 'sans-serif-light',
    marginTop: 10,
    overflow: 'hidden',
  } as TextStyle,
});
