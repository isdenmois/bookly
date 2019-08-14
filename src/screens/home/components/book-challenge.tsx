import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { Database } from '@nozbe/watermelondb';
import { Counter } from 'components';
import { readBooksThisYearQuery, booksReadForecast } from '../home.service';

interface Props {
  database: Database;
  totalBooks: number;
  readCount?: number;
}

interface State {
  totalBooks: number;
  readCount: number;
  forecast: number;
}

@withObservables(null, ({ database }) => ({
  readCount: readBooksThisYearQuery(database).observeCount(),
}))
export class BookChallenge extends React.Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    if (!state || props.readCount !== state.readCount || props.totalBooks !== state.totalBooks) {
      return {
        totalBooks: props.totalBooks,
        readCount: props.readCount,
        forecast: booksReadForecast(props.readCount, props.totalBooks),
      };
    }

    return null;
  }

  state: State = {
    totalBooks: this.props.totalBooks,
    readCount: this.props.readCount,
    forecast: booksReadForecast(this.props.readCount, this.props.totalBooks),
  };

  render() {
    return (
      <View style={s.row}>
        <Counter label='Прочитано' value={this.props.readCount} />
        <Counter label='Запланировано' value={this.props.totalBooks} />
        <Counter label='Опережение' value={this.state.forecast} />
      </View>
    );
  }
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 20,
  } as ViewStyle,
});
