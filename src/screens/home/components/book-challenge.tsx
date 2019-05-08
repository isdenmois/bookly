import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import withObservables from '@nozbe/with-observables';
import { Database } from '@nozbe/watermelondb';
import { Counter } from 'components/counter';
import { readBooksThisYearQuery, booksReadForecast } from '../home.service';

const TOTAL_COUNT = 80;

interface Props {
  database: Database;
  readCount?: number;
}

interface State {
  readCount: number;
  forecast: number;
}

@withObservables([], ({ database }) => ({
  readCount: readBooksThisYearQuery(database).observeCount(),
}))
export class BookChallenge extends React.Component<Props, State> {
  static getDerivedStateFromProps(props, state) {
    if (!state || props.readCount !== state.readCount) {
      return {
        readCount: props.readCount,
        forecast: booksReadForecast(props.readCount, TOTAL_COUNT),
      };
    }

    return null;
  }

  state: State = {
    readCount: this.props.readCount,
    forecast: booksReadForecast(this.props.readCount, TOTAL_COUNT),
  };

  render() {
    return (
      <View style={s.row}>
        <Counter label='Прочитано' value={this.props.readCount} />
        <Counter label='Запланировано' value={TOTAL_COUNT} />
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
  } as ViewStyle,
});
