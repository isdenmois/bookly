import React, { createRef, forwardRef, ReactElement, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleProp, useWindowDimensions, ViewStyle } from 'react-native';
import { BaseScrollView, DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview';

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
  { data, itemHeight, itemWidth, ListEmptyComponent, ListFooterComponent, ...props }: Props<T>,
  ref,
) {
  const provider = useDataProvider(data);
  const layoutProvider = useLayoutProvider(itemHeight, itemWidth);

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

function useLayoutProvider(itemHeight: number, itemWidth?: number) {
  const { width } = useWindowDimensions();

  return useMemo(
    () =>
      new LayoutProvider(
        () => 0,
        (_, dim) => {
          dim.width = itemWidth || width;
          dim.height = itemHeight;
        },
      ),
    [width, itemHeight, itemWidth],
  );
}

export const RecyclerList = forwardRef(RecyclerListComponent);
