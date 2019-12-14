import React from 'react';
import { map } from 'rxjs/operators';
import withObservables from '@nozbe/with-observables';
import { Text, View, ActivityIndicator, StyleSheet, ViewStyle, ScrollView } from 'react-native';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
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
import { ByAuthorFactory } from './tabs/by-author.factory';
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
  [TYPES.AUTHOR]: {
    header: ['Автор', 'Книг', 'Оценка'],
    columns: ['id', 'count', 'rating'],
    flexes: [2, 1, 1],
    factory: ByAuthorFactory,
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
@observer
export class StatScreen extends React.Component<Props> {
  @observable type: string = TYPES.MONTH;
  @observable year: number = CURRENT_YEAR;
  @observable isLoading: boolean = !this.props.books;
  @observable minYear: number = (this.props.books && this.props.books.minYear) || 0;
  @observable.ref books: StatBook[] = (this.props.books && this.props.books.items) || [];

  @computed get rows(): IRow[] {
    const type = this.type || TYPES.MONTH;
    const { books, year } = this;

    return STAT_GROUPS[type].factory({ books, year });
  }

  componentDidUpdate(prevProps) {
    if (this.props.books && prevProps.books !== this.props.books) {
      const { minYear, items } = this.props.books;

      this.setBooks(items, minYear);
    }
  }

  render() {
    const { isLoading, type, year, minYear } = this;
    const group = STAT_GROUPS[type];

    return (
      <View style={s.container}>
        <ScreenHeader title='Статистика' />
        {isLoading && this.renderSpinner()}
        {!isLoading && (
          <>
            <View>
              <StatGroups type={type} onChange={this.setGroup} />
              {type !== 'YEAR' && <YearSelection year={year} minYear={minYear} onChange={this.setYear} />}
              <HeaderRow columns={group.header} flexes={group.flexes} />
            </View>

            <ScrollView style={s.body} contentContainerStyle={s.bodyContainer}>
              {this.renderRows()}
            </ScrollView>
          </>
        )}
      </View>
    );
  }

  renderSpinner() {
    return <ActivityIndicator style={s.spinner} size='large' />;
  }

  renderRows() {
    if (!this.rows?.length) {
      return <Text>Ничего не найдено</Text>;
    }

    const { type, year } = this;
    const group = STAT_GROUPS[type];

    return this.rows.map(row => (
      <Row key={row.id} row={row} columns={group.columns} flexes={group.flexes} type={type} year={year} />
    ));
  }

  @action setBooks(books: StatBook[], minYear: number) {
    this.isLoading = false;
    this.books = books;
    this.minYear = minYear;
  }

  @action setGroup = type => {
    this.type = type;
  };

  @action setYear = year => {
    this.year = year;
  };
}

const s = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
  spinner: {
    marginTop: 40,
  } as ViewStyle,
  body: {
    marginTop: 15,
  } as ViewStyle,
  bodyContainer: {
    paddingHorizontal: 15,
  } as ViewStyle,
});
