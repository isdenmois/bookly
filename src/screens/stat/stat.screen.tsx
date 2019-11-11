import React from 'react';
import { map } from 'rxjs/operators';
import withObservables from '@nozbe/with-observables';
import { Text, View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { HeaderRow } from './components/header-row';
import { ScreenHeader } from 'components';
import { Row } from './components/row';
import { inject, Session } from 'services';
import { Database, Q } from '@nozbe/watermelondb';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { StatGroups } from './components/stat-groups';
import { YearSelection } from './components/year-selection';
import { getCurrentYear } from 'utils/date';
import { ByMonthFactory } from './tabs/by-month.factory';
import { ByRatingFactory } from './tabs/by-rating.factory';
import { ByYearFactory } from './tabs/by-year.factory';
import { mapBooks, BookItems, StatBook, IRow } from './tabs/shared';

const TYPES = {
  MONTH: 'MONTH',
  AUTHOR: 'AUTHOR',
  RATING: 'RATING',
  YEAR: 'YEAR',
};

const STAT_GROUPS = {
  [TYPES.MONTH]: {
    header: ['Месяц', 'Книг', 'Дней', 'Оценка'],
    columns: ['name', 'count', 'days', 'rating'],
    flexes: [2, 1, 1, 1],
    factory: ByMonthFactory,
  },
  [TYPES.RATING]: {
    header: ['Оценка', 'Книг'],
    columns: ['rating', 'count'],
    factory: ByRatingFactory,
    flexes: [1, 2],
  },
  [TYPES.YEAR]: {
    header: ['Год', 'Книг', 'Дней', 'Оценка'],
    columns: ['id', 'count', 'days', 'rating'],
    flexes: [2, 1, 1, 1],
    factory: ByYearFactory,
  },
};

const CURRENT_YEAR = getCurrentYear();

const withBooks: Function = withObservables(null, () => {
  const db = inject(Database);
  const session = inject(Session);
  const min = new Date(session.minYear, 0, 1, 0, 0, 0).getTime();
  const books = db.collections
    .get('books')
    .query(Q.where('status', BOOK_STATUSES.READ), Q.where('date', Q.gte(min)))
    .observeWithColumns(['date', 'rating'])
    .pipe(map(mapBooks) as any);

  return { books };
});

interface Props {
  books: BookItems;
}

interface State {
  type: string;
  year: number;
  isLoading: boolean;
  isCalculating: boolean;
  books: StatBook[];
  rows: IRow[];
  minYear: number;
}

@withBooks
export class StatScreen extends React.Component<Props, State> {
  state: State = {
    type: TYPES.MONTH,
    year: CURRENT_YEAR,
    isLoading: !this.props.books,
    isCalculating: !this.props.books,
    books: (this.props.books && this.props.books.items) || [],
    rows: this.props.books ? this.getRows(this.props.books.items || [], CURRENT_YEAR) : [],
    minYear: (this.props.books && this.props.books.minYear) || 0,
  };

  componentDidUpdate(prevProps) {
    if (this.props.books && prevProps.books !== this.props.books) {
      const { minYear, items } = this.props.books;

      this.setState({ isLoading: false, isCalculating: false, books: items, minYear, rows: this.getRows(items) });
    }
  }

  render() {
    const { isLoading, isCalculating, type, year, minYear } = this.state;
    const group = STAT_GROUPS[type];

    return (
      <View>
        <ScreenHeader title='Статистика' />
        {isLoading && this.renderSpinner()}
        {!isLoading && (
          <>
            <StatGroups type={type} onChange={this.setGroup} />
            <View style={s.body}>
              {type !== 'YEAR' && <YearSelection year={year} minYear={minYear} onChange={this.setYear} />}
              <HeaderRow columns={group.header} flexes={group.flexes} />

              {isCalculating && this.renderSpinner()}
              {!isCalculating && this.renderRows()}
            </View>
          </>
        )}
      </View>
    );
  }

  renderSpinner() {
    return <ActivityIndicator style={s.spinner} size='large' />;
  }

  renderRows() {
    if (!this.state.rows || !this.state.rows.length) {
      return <Text>Ничего не найдено</Text>;
    }
    const { type, year } = this.state;
    const group = STAT_GROUPS[type];

    return this.state.rows.map(row => (
      <Row key={row.id} row={row} columns={group.columns} flexes={group.flexes} type={type} year={year} />
    ));
  }

  getRows(books = this.state.books, year = this.state.year) {
    const type = (this.state && this.state.type) || TYPES.MONTH;

    return STAT_GROUPS[type].factory({ books, year });
  }

  setGroup = type => {
    this.setState({ type, rows: [], isCalculating: true }, () => {
      this.setState({ rows: this.getRows(), isCalculating: false });
    });
  };

  setYear = year => {
    this.setState({ year, rows: [], isCalculating: true }, () => {
      this.setState({ rows: this.getRows(), isCalculating: false });
    });
  };
}

const s = StyleSheet.create({
  spinner: {
    marginTop: 40,
  } as ViewStyle,
  body: {
    paddingHorizontal: 15,
  } as ViewStyle,
});
