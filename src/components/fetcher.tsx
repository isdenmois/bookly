import React, { ReactNode } from 'react';
import _ from 'lodash';
import { ActivityIndicator, Text, View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { color } from 'types/colors';
import { TextXL } from './text';
import { Button } from './button';

const OMIT_FIELDS = ['children', 'observe', 'error', 'api', 'empty', 'emptyText'];

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

  render() {
    if (this.state.isLoading && !this.state.data) {
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
    this.setState({ isLoading: true, data: append ? this.state.data : null, error: null });

    this.props
      .api({ ...this.props, page: this.page })
      .then(data => this.setState({ isLoading: false, data: append ? this.append(data) : data }))
      .catch(error => this.setState({ isLoading: false, error }))
      .then(() => this.props.onLoad && setTimeout(this.props.onLoad));
  }

  renderEmpty() {
    const Component = this.props.empty;

    return <Component text={this.props.emptyText} />;
  }

  renderError() {
    const error = this.state.error;

    return <Text>{JSON.stringify(error)}</Text>;
  }

  renderList(list: any[]) {
    return _.map(list, (item, index) => this.props.children(item, index));
  }

  renderPagination() {
    if (_.isEmpty(this.state.data.items)) {
      return this.renderEmpty();
    }
    const list = this.renderList(this.state.data.items);

    if (list.length >= this.state.data.total) {
      return list;
    }

    return (
      <>
        {list}
        <View style={s.loadMore}>
          {this.state.isLoading && <ActivityIndicator size='large' />}
          {!this.state.isLoading && <Button label='Загрузить еще' onPress={this.loadMore} />}
        </View>
      </>
    );
  }

  append(data) {
    const items = this.state.data.items.concat(data.items);

    return { items, total: data.total };
  }

  loadMore = () => {
    this.page++;
    this.fetchData(true);
  };
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
  },
});
