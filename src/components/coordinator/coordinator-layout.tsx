import React, { PureComponent } from 'react';
import { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { Value, event } from 'react-native-reanimated';
import { PortalProvider, PortalHost } from '@gorhom/portal';
import { CoordinatorContext } from './coordinator-context';

export class CoordinatorLayout extends PureComponent {
  scrollY = new Value(0);
  listRefArr = [];
  tableKey = null;
  listFixedHeight = 0;

  state = { headerHeight: 0 };

  onScroll = event([{ nativeEvent: { contentOffset: { y: this.scrollY } } }], { useNativeDriver: true });

  onHeaderLayout = (e: LayoutChangeEvent) => {
    this.setState({ headerHeight: e.nativeEvent.layout.height });
  };

  render() {
    return (
      <CoordinatorContext.Provider
        value={{
          headerHeight: this.state.headerHeight,
          onHeaderLayout: this.onHeaderLayout,
          onScroll: this.onScroll,
          onScrollEnd: this.onScrollEnd,
          ref: this.setController,
          onTabChange: this.onTabChange,
          scrollY: this.scrollY,
          scrollTo: this.scrollTo,
          getRoot: this.getCurrentScrollView,
        }}
      >
        <PortalProvider>
          <PortalHost name='pinned' />
          {this.props.children}
          <PortalHost name='fixed' />
        </PortalProvider>
      </CoordinatorContext.Provider>
    );
  }

  onTabChange = tab => {
    this.tableKey = tab;
  };

  onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    if (y >= this.state.headerHeight) {
      this.listFixedHeight = this.state.headerHeight + 1;
    } else if (y < 0) {
      this.listFixedHeight = 0;
    } else {
      this.listFixedHeight = y;
    }

    this.listRefArr.forEach(item => {
      if (item.key === this.tableKey) {
        item.y = this.listFixedHeight;
        return;
      }

      if (item.value && item.y !== this.listFixedHeight) {
        item.value.scrollTo({ y: this.listFixedHeight, animated: false });
        item.y = this.listFixedHeight;
      }
    });
  };

  setController = (value, key) => {
    if (value) {
      this.listRefArr.push({
        key,
        value,
      });
      setTimeout(() => {
        value.scrollTo({ y: this.listFixedHeight, animated: false });
      });
    }
  };

  getCurrentScrollView = () => {
    return this.listRefArr.find(item => item.key === this.tableKey)?.value;
  };

  scrollTo = (y: number, animated?: boolean) => {
    this.getCurrentScrollView().scrollTo({ y, animated });
  };
}
