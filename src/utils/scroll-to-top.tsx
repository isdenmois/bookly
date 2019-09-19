import React from 'react';
import _ from 'lodash';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { FlatList } from 'react-native';

type ScrollToTop = {
  scroll(): void;
  setScroll(fn: FlatList<any>): void;
};

export const ScrollToTopContext = React.createContext<ScrollToTop>({ scroll: _.noop, setScroll: _.noop });

export function withScroll(Component) {
  class Provider extends React.Component {
    setScroll = (list: FlatList<any>) =>
      this.setState({ scroll: () => list && list.scrollToOffset({ animated: true, offset: 0 }) });

    state = { scroll: _.noop, setScroll: this.setScroll };

    render() {
      return (
        <ScrollToTopContext.Provider value={this.state}>
          <Component {...this.props} />
        </ScrollToTopContext.Provider>
      );
    }
  }

  return hoistNonReactStatics(Provider, Component);
}
