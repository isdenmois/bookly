import React from 'react';
import _ from 'lodash';
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

export class StatScreen extends React.Component {
  state = {
    type: TYPES.MONTH,
    year: getCurrentYear(),
    isLoading: true,
    isCalculating: true,
    books: [],
    rows: [],
    minYear: 0,
  };

  async componentDidMount() {
    const db = inject(Database);
    const session = inject(Session);
    const min = new Date(session.minYear, 0, 1, 0, 0, 0).getTime();
    const books = await db.collections
      .get('books')
      .query(Q.where('status', BOOK_STATUSES.READ), Q.where('date', Q.gte(min)))
      .fetch();

    let minYear = new Date().getFullYear();

    books.forEach(b => {
      const year = b.date.getFullYear();

      if (year < minYear) {
        minYear = year;
      }
    });

    this.setState({ isLoading: false, books, minYear }, () => {
      this.setState({ rows: this.getRows(), isCalculating: false });
    });
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

  getRows() {
    const { books, year } = this.state;

    return STAT_GROUPS[this.state.type].factory({ books, year });
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

const MONTHS = [
  { id: 0, name: 'Январь', d: 31 },
  { id: 1, name: 'Февраль', d: 28 },
  { id: 2, name: 'Март', d: 31 },
  { id: 3, name: 'Апрель', d: 30 },
  { id: 4, name: 'Май', d: 31 },
  { id: 5, name: 'Июнь', d: 30 },
  { id: 6, name: 'Июль', d: 31 },
  { id: 7, name: 'Август', d: 31 },
  { id: 8, name: 'Сентябрь', d: 30 },
  { id: 9, name: 'Октябрь', d: 31 },
  { id: 10, name: 'Ноябрь', d: 30 },
  { id: 11, name: 'Декабрь', d: 31 },
];

function ByMonthFactory({ books, year }) {
  const result = MONTHS.map(m => ({ ...m, count: 0, days: 0, rating: 0 }));
  const years = new Set();

  if (year) {
    books = books.filter(byYear(year));
    years.add(year);
  }

  let totalCount = 0;
  let totalRating = 0;

  books.forEach(book => {
    const month = book.date.getMonth();

    totalCount++;
    totalRating += book.rating;
    result[month].count++;
    result[month].rating += book.rating;
    years.add(book.date.getFullYear());
  });

  let total = years.size * 365;
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const hasCurrentYear = years.has(currentYear);

  if (hasCurrentYear) {
    total = total - 365 + dayOfYear();
  }

  result.push({
    id: 'total',
    name: 'Итого',
    count: totalCount * years.size,
    days: 0,
    rating: totalRating * years.size,
    d: total,
  });

  result.forEach((m, i) => {
    const size = hasCurrentYear && i > currentMonth && i < 12 ? years.size - 1 : years.size;

    m.days = m.count ? round((m.d / m.count) * size) : 0;
    m.rating = m.count ? round(m.rating / m.count) : 0;
    m.count = m.count ? round(m.count / size) : 0;
  });

  return result;
}

function ByRatingFactory({ books, year }) {
  const result = _.times(10, i => ({ id: 10 - i, rating: 10 - i, count: 0 }));

  if (year) {
    books = books.filter(byYear(year));
  }

  let totalCount = 0;

  books.forEach(book => {
    result[10 - book.rating].count++;
    totalCount++;
  });

  result.push({
    id: 'total',
    rating: 'Итого',
    count: totalCount,
  });

  return result;
}

function ByYearFactory({ books }) {
  const current = new Date().getFullYear();
  const result = [{ id: current, count: 0, rating: 0, days: 0, d: dayOfYear() }];
  let totalCount = 0;
  let totalRating = 0;
  let totalD = result[0].d;

  books.forEach(book => {
    const year = book.date.getFullYear();
    const i = current - year;

    if (!result[i]) {
      result[i] = { id: year, count: 0, rating: 0, days: 0, d: 365 };
      totalD += 365;
    }

    totalCount++;
    totalRating += book.rating;
    result[i].count++;
    result[i].rating += book.rating;
  });

  books = books.filter(_.identity);

  result.push({
    id: 'Итого',
    rating: totalRating,
    count: totalCount,
    d: totalD,
  });

  result.forEach(y => {
    y.days = y.count ? round(y.d / y.count) : 0;
    y.rating = y.count ? round(y.rating / y.count) : 0;
  });

  return result;
}

function byYear(year) {
  const start = new Date(year, 0, 1, 0, 0, 0);
  const end = new Date(year, 11, 31, 23, 59, 59);

  return book => book.date >= start && book.date <= end;
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

function dayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0).getTime();
  const diff = now.getTime() - start;
  const oneDay = 1000 * 60 * 60 * 24;

  return Math.floor(diff / oneDay);
}

const s = StyleSheet.create({
  spinner: {
    marginTop: 40,
  } as ViewStyle,
  body: {
    paddingHorizontal: 15,
  } as ViewStyle,
});
