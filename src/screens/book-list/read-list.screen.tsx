import React from 'react';
import { inject, InjectorContext } from 'react-ioc';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { NavigationScreenProps } from 'react-navigation';
import { Database } from '@nozbe/watermelondb';
import { color } from 'types/colors';
import { BOOK_STATUSES } from 'types/book-statuses.enum';
import { ScreenHeader } from 'components/screen-header';
import { BookList } from './components/book-list';
import { createQueryState } from './book-list.service';
import { Button } from 'components/button';

const defaultFilters = {
  status: BOOK_STATUSES.READ,
  year: 2019,
};

const READ_LIST_FILTERS = ['year', 'author', 'type', 'date', 'rating'];

const READ_LIST_SORTS = ['date', 'title', 'rating', 'author', 'id'];

interface State {
  query: any[];
  sort: any;
  filters: any;
}

export class ReadListScreen extends React.Component<NavigationScreenProps, State> {
  static contextType = InjectorContext;

  state: State = createQueryState(defaultFilters, { field: 'date', desc: true });

  database = inject(this, Database);

  filters = READ_LIST_FILTERS;
  sorts = READ_LIST_SORTS;
  title = 'Прочитано';

  render() {
    const { navigation } = this.props;
    const { query, sort } = this.state;

    return (
      <View style={s.container}>
        <ScreenHeader title={this.title} navigation={this.props.navigation} />
        <BookList database={this.database} query={query} sort={sort} navigation={navigation} />
        <View style={s.buttonContainer}>
          <Button
            label='ФИЛЬТРЫ'
            onPress={this.openFiltersModal}
            icon={<Icon name='sliders-h' size={18} color={color.PrimaryText} />}
            style={s.button}
            textStyle={s.buttonText}
          />
        </View>
      </View>
    );
  }

  setFilters = (filters, sort) => this.setState(createQueryState(filters, sort));

  openFiltersModal = () =>
    this.props.navigation.navigate('/modal/book-filters', {
      setFilters: this.setFilters,
      filterFields: this.filters,
      sortFields: this.sorts,

      filters: this.state.filters,
      sort: this.state.sort,
    });
}

const s = StyleSheet.create({
  container: {
    backgroundColor: color.Background,
    flex: 1,
  } as ViewStyle,
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  } as ViewStyle,
  button: {
    backgroundColor: color.Background,
    elevation: 3,
  } as ViewStyle,
  buttonText: {
    color: color.PrimaryText,
  } as TextStyle,
});
