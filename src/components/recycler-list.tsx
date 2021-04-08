import React, { createRef, forwardRef, ReactElement, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleProp, StyleSheet, useWindowDimensions, ViewStyle } from 'react-native';
import {
  BaseScrollView,
  DataProvider,
  Dimension,
  LayoutManager,
  LayoutProvider,
  RecyclerListView,
  WrapGridLayoutManager,
} from 'recyclerlistview';

interface Props<T> {
  data: T[];
  rowRenderer: (type: string | number, data: any, index: number, extendedState?: object) => ReactElement;
  itemHeight: number;
  itemWidth?: number;
  style?: any;
  contentContainerStyle?: StyleProp<ViewStyle>;
  ListEmptyComponent?: any;
  ListHeaderComponent?: any;
  ListFooterComponent?: any;
  isHorizontal?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  paddingHorizontal?: number;
}

class ExtendedScrollView extends BaseScrollView {
  scrollTo(...args) {
    this.scrollRef.current?.scrollTo(...args);
  }

  private scrollRef = createRef<ScrollView>();

  render() {
    const { children, ListHeaderComponent, ...props } = this.props as any;

    return (
      <ScrollView {...props} ref={this.scrollRef}>
        {ListHeaderComponent}
        {children}
      </ScrollView>
    );
  }
}

function RecyclerListComponent<T>(
  { data, itemHeight, itemWidth, paddingHorizontal, ListEmptyComponent, ListFooterComponent, ...props }: Props<T>,
  ref,
) {
  const provider = useDataProvider(data);
  const layoutProvider = useLayoutProvider(itemHeight, itemWidth, paddingHorizontal);

  if (!data?.length) {
    return ListEmptyComponent || null;
  }

  return (
    <RecyclerListView
      ref={ref}
      dataProvider={provider}
      layoutProvider={layoutProvider}
      renderAheadOffset={RecyclerListView.defaultProps.renderAheadOffset + itemHeight}
      externalScrollView={ExtendedScrollView}
      renderFooter={ListFooterComponent ? () => ListFooterComponent : null}
      styleOverrides={{ overflow: 'visible' }}
      {...props}
    />
  );
}

const createProvider = () => new DataProvider((r1, r2) => r1.id !== r2.id);
function useDataProvider<T>(data: T[]) {
  const [provider, setProvider] = useState(createProvider);

  useEffect(() => {
    setProvider(provider.cloneWithRows(data || []));
  }, [data]);

  return provider;
}

function useLayoutProvider(itemHeight: number, itemWidth?: number, paddingHorizontal?: number = 0) {
  const { width } = useWindowDimensions();

  return useMemo(
    () =>
      new VisibleLayoutProvider(
        () => 0,
        (_, dim) => {
          dim.width = itemWidth || width - paddingHorizontal * 2;
          dim.height = itemHeight;
        },
      ),
    [width, itemHeight, itemWidth],
  );
}

class VisibleLayoutProvider extends LayoutProvider {
  newLayoutManager(renderWindowSize: Dimension, isHorizontal?: boolean, cachedLayouts?: Layout[]) {
    const lm = ((this as any)._lastLayoutManager = new VisibleLayoutManager(
      this,
      renderWindowSize,
      isHorizontal,
      cachedLayouts,
    ));

    return lm;
  }
}

class VisibleLayoutManager extends WrapGridLayoutManager {
  getStyleOverridesForIndex() {
    return style;
  }
}

const style = { overflow: 'visible' };

export const RecyclerList = forwardRef(RecyclerListComponent);
