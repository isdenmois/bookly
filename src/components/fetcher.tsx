import React, { ReactNode } from 'react';
import { Subscription } from 'rxjs';
import _ from 'lodash';
import { ActivityIndicator, Text, View, StyleSheet, TextStyle, ViewStyle, FlatList } from 'react-native';
import { Database, Q } from '@nozbe/watermelondb';
import { color } from 'types/colors';
import { TextXL } from './text';
import { Button } from './button';
import { inject } from 'services';

const OMIT_FIELDS = [
  'children',
  'observe',
  'error',
  'api',
  'empty',
  'emptyText',
  'useFlatlist',
  'contentContainerStyle',
];

interface Parameters {
  [prop: string]: any;
}

type ListItemRender = (item: any, index?: number) => ReactNode;
type DataRender = (item: any) => ReactNode;

type Props = Parameters & {
  api: (props: any) => Promise<any>;
  key?: string;
  empty?: any;
  observe?: string[];
  children?: ListItemRender | DataRender;
  renderResult?: DataRender;
  emptyText?: string;
  useFlatlist?: boolean;
  contentContainerStyle?: any;
  onLoad?: () => void;
};

export class Fetcher extends React.PureComponent<Props> {
  static defaultProps: Partial<Props> = {
    empty: EmptyResult,
    emptyText: 'Ничего не найдено',
  };

  page = 1;

  state = {
    data: null,
    isLoading: true,
    error: null,
  };

  subscription: Subscription;
  appending: boolean = false;

  renderItem: any;

  isPropsChanged(prevProps) {
    let current, prev;

    if (this.props.observe) {
      current = _.pick(this.props, this.props.observe);
      prev = _.pick(prevProps, this.props.observe);
    } else {
      current = _.omit(this.props, OMIT_FIELDS);
      prev = _.omit(prevProps, OMIT_FIELDS);
    }

    return !_.isEqual(current, prev);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.isPropsChanged(prevProps)) {
      this.fetchData();
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.state.isLoading && !this.appending) {
      return <ActivityIndicator style={s.loading} size='large' />;
    }

    if (this.state.error) {
      return this.renderError();
    }

    if (_.isEmpty(this.state.data)) {
      return this.renderEmpty();
    }

    if (this.props.renderResult) {
      return this.props.renderResult(this.state.data);
    }

    if (Array.isArray(this.state.data)) {
      return this.renderList(this.state.data);
    }

    if (this.state.data.items) {
      return this.renderPagination();
    }

    return this.props.children(this.state.data);
  }

  fetchData(append?: boolean) {
    this.unsubscribe();
    this.setState({ isLoading: true, data: append ? this.state.data : null, error: null });
    this.appending = append;

    this.props
      .api({ ...this.props, page: this.page })
      .then(data => new Promise(resolve => this.setState({ data: append ? this.append(data) : data }, resolve)))
      .then(() => this.mapDatabase())
      .catch(error => this.setState({ isLoading: false, error }))
      .then(() => this.props.onLoad && setTimeout(this.props.onLoad));
  }

  renderEmpty() {
    const Component = this.props.empty;

    return <Component text={this.props.emptyText} />;
  }

  renderError() {
    const error = this.state.error;

    return <Text>{error instanceof Error ? error.toString() : JSON.stringify(error)}</Text>;
  }

  renderList(list: any[], footer?) {
    if (!this.props.useFlatlist) {
      const res = _.map(list, (item, index) => this.props.children(item, index));

      return footer ? res.concat(footer) : res;
    }

    const renderItem = (this.renderItem = this.renderItem || (row => this.props.children(row.item, row.index)));

    return (
      <FlatList
        contentContainerStyle={this.props.contentContainerStyle}
        data={list}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListFooterComponent={footer}
      />
    );
  }

  renderPagination() {
    if (_.isEmpty(this.state.data.items)) {
      return this.renderEmpty();
    }
    let footer = null;

    if (this.state.data.total && this.state.data.items.length < this.state.data.total) {
      footer = (
        <View key='load-more' style={s.loadMore}>
          {this.state.isLoading && <ActivityIndicator size='large' />}
          {!this.state.isLoading && <Button label='Загрузить еще' onPress={this.loadMore} />}
        </View>
      );
    }

    return this.renderList(this.state.data.items, footer);
  }

  append(data) {
    const items = this.state.data.items.concat(data.items);

    return { items, total: data.total };
  }

  loadMore = () => {
    this.page++;
    this.fetchData(true);
  };

  mapModelsToData = models => {
    const data = mapData(this.state.data, i => findModel(i, models) || i._orig || i);

    this.setState({ isLoading: false, data });
  };

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  mapDatabase() {
    if (this.state.data && (this.props.api as any).schema.collection) {
      this.subscribe();
    } else {
      this.setState({ isLoading: false });
    }
  }

  subscribe() {
    const { schema } = this.props.api as any;

    const query = inject(Database)
      .collections.get(schema.collection)
      .query(Q.where('id', Q.oneOf(getIds(this.state.data))))
      .observe();

    this.subscription = query.subscribe(this.mapModelsToData);
  }
}

function getIds(data) {
  if (_.isArray(data)) {
    return data.map(row => row.id);
  }

  if (_.isArray(data.items)) {
    return data.items.map(row => row.id);
  }

  return [data.id];
}

function mapData(data, it) {
  if (_.isArray(data)) {
    return data.map(it);
  }

  if (_.isArray(data.items)) {
    return { ...data, items: data.items.map(it) };
  }

  return it(data);
}

function findModel(item, models) {
  const record = _.find(models, { id: item.id });

  if (record) {
    _.defaults(record, _.omit(item, ['_orig']));
    record._orig = item;
    item._orig = null;
  }

  return record;
}

function keyExtractor(row) {
  return row.id.toString();
}

export function EmptyResult({ text }) {
  return (
    <View style={s.container}>
      <TextXL style={s.notFoundText}>{text}</TextXL>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginBottom: 38,
  } as ViewStyle,
  loading: {
    flex: 1,
    alignSelf: 'center',
  } as ViewStyle,
  notFoundText: {
    color: color.Empty,
  } as TextStyle,
  loadMore: {
    alignItems: 'center',
    paddingTop: 15,
  },
});
