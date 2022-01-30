import React, { createRef } from 'react';
import _ from 'lodash';
import { Platform, View, ViewStyle, TextStyle } from 'react-native';
import { Where } from '@nozbe/watermelondb/QueryDescription';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getColor, dynamicColor } from 'types/colors';
import { BookSort, BookFilters } from 'types/book-filters';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { withScroll } from 'utils/scroll-to-top';
import { Button, ScreenHeader, Screen } from 'components';
import { BookList } from './components/book-list';
import { createQueryState } from './book-list.service';
import { openModal, settings, t } from 'services';
import Book from 'store/book';
import { ColorSchemeContext, DynamicStyleSheet } from 'react-native-dynamic';
import { MainRoutes, MainScreenProps, ModalRoutes } from 'navigation/routes';

const READ_LIST_FILTERS = ['title', 'year', 'author', 'type', 'date', 'rating', 'paper', 'isLiveLib', 'audio'];

const READ_LIST_SORTS = ['date', 'title', 'rating', 'author', 'id'];

type Props = MainScreenProps<MainRoutes.ReadList>;

interface State {
  query: Where[];
  sort: BookSort;
  filters: Partial<BookFilters>;
}

export class ReadList extends React.Component<Props, State> {
  static contextType = ColorSchemeContext;

  state: State = createQueryState(
    {
      status: BOOK_STATUSES.READ,
      ...(this.props.route.params?.filters || {}),
    },
    this.props.route.params?.sort || { field: 'date', desc: true },
  );

  readonly = this.props.route.params?.readonly;
  bookListRef = createRef<any>();

  showTopRate = true;
  showListBookSelect = false;
  filters = READ_LIST_FILTERS;
  sorts = READ_LIST_SORTS;
  title = 'nav.read';

  render() {
    const { query, sort, filters } = this.state;
    const readonly = this.readonly;
    const s = ds[this.context];
    const color = getColor(this.context);
    const listId = this.props.route.params?.listId;

    return (
      <Screen>
        <ScreenHeader title={this.title} query={this.state.filters.title} onSearch={!readonly && this.setSearch} />
        <BookList
          query={query}
          sort={sort}
          filters={filters}
          onChange={this.setFilters}
          readonly={readonly}
          mode={this.context}
          ref={this.bookListRef}
        />
        <View style={s.buttonContainer}>
          <Button
            label={t('modal.filters').toUpperCase()}
            onPress={this.openFiltersModal}
            icon={<Icon name='sliders-h' size={18} color={color.PrimaryText} />}
            style={s.button}
            textStyle={s.buttonText}
          />
          {this.showTopRate && settings.topRate && (
            <Button
              label={t('common.top').toUpperCase()}
              onPress={this.openTopRated}
              icon={<Icon name='vials' size={18} color={color.PrimaryText} />}
              style={s.button}
              textStyle={s.buttonText}
            />
          )}
          {this.showListBookSelect && listId && (
            <Button
              label={t('modal.list').toUpperCase()}
              onPress={this.openListBookSelect}
              icon={<Icon name='plus' size={18} color={color.PrimaryText} />}
              style={s.button}
              textStyle={s.buttonText}
            />
          )}
        </View>
      </Screen>
    );
  }

  setFilters = (filters, sort = this.state.sort) => this.setState(createQueryState(filters, sort));
  setSearch = title => this.setState(createQueryState(this.createTitleFilter(title && title.trim()), this.state.sort));

  createTitleFilter(title: string) {
    return _.assign({}, this.state.filters, { title });
  }

  openFiltersModal = () =>
    openModal(ModalRoutes.BookFilters, {
      setFilters: this.setFilters,
      filterFields: this.filters,
      sortFields: this.sorts,

      filters: this.state.filters,
      sort: this.state.sort,
    });

  openTopRated = () => {
    const data: Book[] = this.bookListRef.current?.state.values?.books || [];
    if (data.length === 0) return;
    const books = data.map(b => ({
      ..._.pick(b, ['id', 'author', 'thumbnail', 'rating', 'title']),
      date: b.date.getTime(),
    }));

    this.props.navigation.push(MainRoutes.TopRate, { books });
  };

  openListBookSelect = () => {
    const listId = this.props.route.params.listId;

    openModal(ModalRoutes.ListBookSelect, { listId });
  };
}

export const ReadListScreen = withScroll(ReadList);

const ds = new DynamicStyleSheet({
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
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
