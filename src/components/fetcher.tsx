import React, { ReactNode } from 'react';
import _ from 'lodash';
import { ActivityIndicator } from 'react-native';

const OMIT_FIELDS = ['children', 'observe', 'error', 'api', 'empty'];

interface Parameters {
  [prop: string]: any;
}

type Props = Parameters & {
  api: (props: any) => Promise<any>;
  empty: any;
  observe?: string[];
  children: (data: any, errors: any) => ReactNode;
};

export class Fetcher extends React.PureComponent<Props> {
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
      return <ActivityIndicator size='large' />;
    }

    if (!this.state.error && _.isEmpty(this.state.data)) {
      const Empty = this.props.empty;

      return <Empty />;
    }

    return this.props.children(this.state.data, this.state.error);
  }

  fetchData() {
    this.setState({ isLoading: true, data: null, error: null });

    this.props
      .api(this.props)
      .then(data => this.setState({ isLoading: false, data }))
      .catch(error => {
        console.error(error);
        this.setState({ isLoading: false, error });
      });
  }
}
