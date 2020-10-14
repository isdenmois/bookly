import React from 'react';
import { map } from 'rxjs/internal/operators/map';
import withObservables from '@nozbe/with-observables';
import { Text, View, ActivityIndicator, StyleSheet, ViewStyle, ScrollView } from 'react-native';
import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { HeaderRow } from './components/header-row';
import { ScreenHeader, Screen } from 'components';
import { Row } from './components/row';
import { session, t } from 'services';
import { Q } from '@nozbe/watermelondb';
import { database } from 'store';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { StatGroups } from './components/stat-groups';
import { YearSelection } from './components/year-selection';
import { ByMonth } from './tabs/by-month.factory';
import { ByRating } from './tabs/by-rating.factory';
import { ByYear } from './tabs/by-year.factory';
import { ByAuthor } from './tabs/by-author.factory';
import { ByType } from './tabs/by-type.factory';
import { CURRENT_YEAR, mapBooks, BookItems, StatBook, IRow, StatTab, TABS, byYear } from './tabs/shared';

const STAT_GROUPS: Record<string, StatTab> = {
  MONTH: ByMonth,
  AUTHOR: ByAuthor,
  RATING: ByRating,
  YEAR: ByYear,
  TYPE: ByType,
};

const withBooks: Function = withObservables(null, () => {
  const min = new Date(session.minYear, 0, 1, 0, 0, 0).getTime();
  const books = database.collections
    .get('books')
    .query(Q.where('status', BOOK_STATUSES.READ), Q.where('date', Q.gte(min)))
    .observeWithColumns(['date', 'rating', 'paper', 'audio', 'withoutTranslation', 'leave'])
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
  @observable type: string = TABS.MONTH;
  @observable year: number = CURRENT_YEAR;
  @observable isLoading: boolean = !this.props.books;
  @observable minYear: number = (this.props.books && this.props.books.minYear) || 0;
  @observable.ref books: StatBook[] = (this.props.books && this.props.books.items) || [];

  @computed get rows(): IRow[] {
    const type = this.type || TABS.MONTH;
    const group = STAT_GROUPS[type];
    let { books, year } = this;

    if (!group.allYears && year) {
      books = books.filter(byYear(year));
    }

    return group.factory(books, year);
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
      <Screen>
        <ScreenHeader title='nav.stat' />
        {isLoading && this.renderSpinner()}
        {!isLoading && (
          <>
            <View>
              <StatGroups type={type} onChange={this.setGroup} />
              {!group.allYears && <YearSelection year={year} minYear={minYear} onChange={this.setYear} />}
              <HeaderRow columns={group.header} flexes={group.flexes} />
            </View>

            <ScrollView style={s.body} contentContainerStyle={s.bodyContainer}>
              {this.renderRows()}
            </ScrollView>
          </>
        )}
      </Screen>
    );
  }

  renderSpinner() {
    return <ActivityIndicator style={s.spinner} size='large' />;
  }

  renderRows() {
    if (!this.rows?.length) {
      return <Text>{t('empty')}</Text>;
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
