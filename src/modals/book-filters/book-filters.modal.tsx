import React from 'react';
import _ from 'lodash';
import { inject, InjectorContext } from 'react-ioc';
import { ScrollView, StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { Database } from '@nozbe/watermelondb';
import { Button } from 'components/button';
import { Dialog } from 'components/dialog';
import { TouchIcon } from 'components/touch-icon';
import { BookListSort } from './components/book-list-sort';
import { BookYearFilter } from './components/book-year-filter';
import { BookAuthorFilter } from './components/book-author-filter';
import { BookTypeFilter } from './components/book-type-filter';
const { withMappedNavigationParams } = require('react-navigation-props-mapper');

const FILTER_COMPONENTS_MAP = {
  year: BookYearFilter,
  author: BookAuthorFilter,
  type: BookTypeFilter,
};

interface Props extends NavigationScreenProps {
  filterFields: string[];
  sortFields: string[];
  filters: any;
  sort: any;
  setFilters: (filters: any, sort: any) => void;
}

interface State {
  sort: any;
  status: string;
  changed: boolean;
}

@withMappedNavigationParams()
export class BookFiltersModal extends React.Component<Props, State> {
  static contextType = InjectorContext;

  database = inject(this, Database);

  state: State = this.createDefaultState();

  render() {
    const { filterFields, sortFields } = this.props;

    return (
      <Dialog style={s.modalStyle} navigation={this.props.navigation}>
        <View style={s.header}>
          <TouchIcon name='arrow-left' size={24} color='#000' padding={20} onPress={this.close} />
          <Text style={s.title}>Фильтры</Text>
          {this.state.changed && <TouchIcon name='check' size={24} color='#000' padding={20} onPress={this.save} />}
        </View>

        <ScrollView style={s.scroll} contentContainerStyle={s.filters}>
          <BookListSort value={this.state.sort} onChange={this.setSort} fields={sortFields} />

          {_.map(filterFields, this.renderFilter)}
        </ScrollView>

        {this.state.changed && (
          <View style={s.buttonRow}>
            <Button label='Применить' onPress={this.save} />
          </View>
        )}
      </Dialog>
    );
  }

  renderFilter = field => {
    const Component = FILTER_COMPONENTS_MAP[field];

    return (
      <Component
        key={field}
        value={this.state[field]}
        database={this.database}
        status={this.state.status}
        onChange={this.changeFilter}
        onApply={this.save}
      />
    );
  };

  setSort = sort => this.setState({ sort, changed: true });
  changeFilter = (filter, value) => this.setState({ [filter]: value, changed: true } as any);

  createDefaultState() {
    const { filters, sort } = this.props;

    return { ...filters, sort };
  }

  setFilters = this.props.setFilters;

  close = () => this.props.navigation.pop();
  save = () => {
    const filters = _.omit(this.state, ['sort', 'changed']);

    this.setFilters(filters, this.state.sort);

    this.close();
  };
}

const s = StyleSheet.create({
  modalStyle: {
    paddingBottom: 10,
  } as ViewStyle,
  scroll: {
    flexGrow: 0,
    marginBottom: 15,
  } as ViewStyle,
  filters: {
    paddingHorizontal: 20,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  title: {
    color: 'black',
    fontSize: 24,
    flex: 1,
    textAlign: 'center',
  } as TextStyle,
  buttonRow: {
    alignItems: 'center',
    paddingBottom: 5,
  } as ViewStyle,
});
