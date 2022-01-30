import React from 'react';
import _ from 'lodash';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';

import { t } from 'services';
import { Form, SubmitButton, FormDialog } from 'utils/form';
import { ModalRoutes, ModalScreenProps } from 'navigation/routes';

import { FormBookListSort } from './components/book-list-sort';
import { BookFilters as IBookFilters } from 'types/book-filters';
import { BookYearFilter } from './components/book-year-filter';
import { BookAuthorFilter } from './components/book-author-filter';
import { BookTypeFilter } from './components/book-type-filter';
import { BookDateFilter } from './components/book-date-filter';
import { BookRatingFilter } from './components/book-rating-filter';
import { BookTitleFilter } from './components/book-title-fitler';
import { BookIsLiveLibFilter } from './components/book-is-livelib-filter';
import { BookPaperFilter } from './components/book-paper-filter';
import { BookInListFilter } from './components/book-in-list-filter';
import { BookReadAsAudioFilter } from './components/book-read-as-audio-filter';

const FILTER_COMPONENTS_MAP = {
  title: BookTitleFilter,
  year: BookYearFilter,
  author: BookAuthorFilter,
  type: BookTypeFilter,
  date: BookDateFilter,
  rating: BookRatingFilter,
  paper: BookPaperFilter,
  isLiveLib: BookIsLiveLibFilter,
  list: BookInListFilter,
  audio: BookReadAsAudioFilter,
};

type Props = ModalScreenProps<ModalRoutes.BookFilters>;

export class BookFiltersModal extends React.Component<Props> {
  initial = Object.assign({}, this.props.route.params.filters, { sort: this.props.route.params.sort });

  render() {
    const { filterFields, sortFields } = this.props.route.params;

    return (
      <Form defaultValues={this.initial} onSubmit={this.save}>
        <FormDialog style={s.modalStyle} title='modal.filters'>
          <ScrollView style={s.scroll} contentContainerStyle={s.filters}>
            {!!sortFields && <FormBookListSort fields={sortFields} />}

            {_.map(filterFields, this.renderFilter)}
          </ScrollView>

          <SubmitButton style={s.buttonRow} label={t('button.apply')} />
        </FormDialog>
      </Form>
    );
  }

  renderFilter = (field: keyof IBookFilters) => {
    const Component = FILTER_COMPONENTS_MAP[field];

    return <Component key={field} status={this.props.route.params.filters.status} onApply={this.save} />;
  };

  close = () => this.props.navigation.goBack();
  save = form => {
    const fields = this.props.route.params.filterFields;

    this.props.route.params.setFilters(getFilters(form, fields), form.sort);

    this.close();
  };
}

function getFilters(form, fields: Array<keyof IBookFilters>): Partial<IBookFilters> {
  const filters: Partial<IBookFilters> = _.pick(form, fields.concat('status'));

  if (filters.title) {
    filters.title = filters.title.trim();
  }

  return _.omitBy(filters, isEmpty);
}
function isEmpty(value) {
  return value === null || value === '';
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
  buttonRow: {
    alignItems: 'center',
    paddingBottom: 5,
  } as ViewStyle,
});
