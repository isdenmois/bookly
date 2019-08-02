import React, { ReactNode } from 'react';
import _ from 'lodash';
import { ActivityIndicator, Text } from 'react-native';
import { color } from 'types/colors';

const OMIT_FIELDS = ['children', 'observe', 'error', 'api', 'empty'];

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
  onLoad?: () => void;
};

export class Fetcher extends React.PureComponent<Props> {
  static defaultProps: Partial<Props> = {
    empty: EmptyResult,
  };

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
    if (this.state.isLoading) {
      return <ActivityIndicator style={{ flex: 1, alignSelf: 'center' }} size='large' />;
    }

    if (this.state.error) {
      return this.renderError();
    }

    if (_.isEmpty(this.state.data)) {
      const Empty = this.props.empty;

      return <Empty />;
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

  fetchData() {
    this.setState({ isLoading: true, data: null, error: null });

    this.props
      .api(this.props)
      .then(data => this.setState({ isLoading: false, data }))
      .catch(error => this.setState({ isLoading: false, error }))
      .then(() => this.props.onLoad && setTimeout(this.props.onLoad));
  }

  renderEmpty() {
    const Component = this.props.empty;

    return <Component />;
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

    return this.renderList(this.state.data.items);
  }
}

function EmptyResult() {
  return <Text style={{ color: color.Empty }}>No data</Text>;
}
