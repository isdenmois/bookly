import React from 'react';
import _ from 'lodash';
import { Text, View, ActivityIndicator } from 'react-native';
import { HeaderRow } from './components/header-row';
import { ScreenHeader } from 'components';
import { Row } from './components/row';
import { inject } from 'services';
import { Database, Q } from '@nozbe/watermelondb';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { StatGroups } from './components/stat-groups';
import { YearSelection } from './components/year-selection';

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
    year: 0,
    isLoading: true,
    isCalculating: true,
    books: [],
    rows: [],
    minYear: 0,
  };

  async componentDidMount() {
    const db = inject(Database);
    const books = await db.collections
      .get('books')
      .query(Q.where('status', BOOK_STATUSES.READ))
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
            <View style={{ paddingHorizontal: 15, marginTop: 30 }}>
              <YearSelection year={year} minYear={minYear} onChange={this.setYear} />
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
    return <ActivityIndicator style={{ marginTop: 40 }} size='large' />;
  }

  renderRows() {
    if (!this.state.rows || !this.state.rows.length) {
      return <Text>Ничего не найдено</Text>;
    }
    const group = STAT_GROUPS[this.state.type];

    return this.state.rows.map(row => <Row key={row.id} row={row} columns={group.columns} flexes={group.flexes} />);
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
  { id: 'jan', name: 'Январь', d: 31 },
  { id: 'feb', name: 'Февраль', d: 28 },
  { id: 'mar', name: 'Март', d: 31 },
  { id: 'apr', name: 'Апрель', d: 30 },
  { id: 'may', name: 'Май', d: 31 },
  { id: 'jun', name: 'Июнь', d: 30 },
  { id: 'jul', name: 'Июль', d: 31 },
  { id: 'aug', name: 'Август', d: 31 },
  { id: 'sep', name: 'Сентябрь', d: 30 },
  { id: 'oct', name: 'Октябрь', d: 31 },
  { id: 'nov', name: 'Ноябрь', d: 30 },
  { id: 'dec', name: 'Декабрь', d: 31 },
];

function ByMonthFactory({ books, year }) {
  const result = MONTHS.map(m => ({ ...m, count: 0, days: 0, rating: 0 }));

  if (year) {
    books = books.filter(byYear(year));
  }

  let totalCount = 0;
  let totalRating = 0;

  books.forEach(book => {
    const month = book.date.getMonth();

    totalCount++;
    totalRating += book.rating;
    result[month].count++;
    result[month].rating += book.rating;
  });

  result.push({
    id: 'total',
    name: 'Итого',
    count: totalCount,
    days: 0,
    rating: totalRating,
    d: year && year === new Date().getFullYear() ? dayOfYear() : 365,
  });

  result.forEach(m => {
    m.days = m.count ? round(m.d / m.count) : 0;
    m.rating = m.count ? round(m.rating / m.count) : 0;
  });

  return result;
}

function ByRatingFactory({ books, year }) {
  const result = _.times(10, i => ({ id: i, rating: 10 - i, count: 0 }));

  if (year) {
    books = books.filter(byYear(year));
  }
  let totalCount = 0;

  books.forEach(book => {
    result[10 - book.rating + 1].count++;
    totalCount++;
  });

  result.push({
    id: 100,
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
  let totalD = 0;

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