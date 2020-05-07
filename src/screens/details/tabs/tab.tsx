import React, { createContext } from 'react';
import _ from 'lodash';
import { Dimensions, Animated, View, ScrollView, StyleSheet, ViewStyle, findNodeHandle } from 'react-native';

interface Props {
  scrollY: Animated.Value;
  headerHeight: number;
  tabsPadding: number;
  y?: number;
  onScrollEnd: (y: number) => void;
}
export const HEADER_HEIGHT = 110;

type TabScroll = {
  rootId: number;
  scrollTo(y: number, animated?: boolean);
};

export const TabScrollContext = createContext<TabScroll>(null);

export function withScroll(WrappedComponent, withContext?: boolean): any {
  return class Tab extends React.Component<Props> {
    screenHeight = Dimensions.get('window').height;
    y = 0;
    scroll: ScrollView;
    tabScroll: TabScroll = withContext ? ({} as any) : null;

    onScrollEnd = event => {
      const y = Math.round(event.nativeEvent.contentOffset.y);

      this.y = y;

      this.props.onScrollEnd(y);
    };

    scrollTo(y: number, animated = false) {
      this.y = y;

      if (this.scroll) {
        this.scroll.scrollTo({ y, animated });
      }
    }

    render() {
      const { scrollY, headerHeight } = this.props;
      const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true });
      const wrappedProps = _.omit(this.props, ['y', 'scrollY', 'headerHeight', 'onScrollEnd']);
      const paddingTop = headerHeight + 15;
      const minHeight = this.screenHeight + paddingTop - HEADER_HEIGHT - 38;

      return (
        <View style={s.relative}>
          <Animated.ScrollView
            onScroll={onScroll}
            style={s.scroll}
            onScrollEndDrag={this.onScrollEnd}
            onMomentumScrollEnd={this.onScrollEnd}
            contentContainerStyle={[
              s.scrollContent,
              {
                minHeight,
                paddingTop,
              },
            ]}
            ref={this.setRef}
          >
            {withContext && (
              <TabScrollContext.Provider value={this.tabScroll}>
                <WrappedComponent {...wrappedProps} />
              </TabScrollContext.Provider>
            )}

            {!withContext && <WrappedComponent {...wrappedProps} />}
          </Animated.ScrollView>
          {WrappedComponent.Fixed && <WrappedComponent.Fixed {...wrappedProps} scrollY={scrollY} />}
        </View>
      );
    }

    onSubviewLoad = () => this.scrollTo(this.props.y);

    setRef = view => {
      this.scroll = view?.getNode();

      if (withContext) {
        this.tabScroll.rootId = findNodeHandle(view);
        this.tabScroll.scrollTo = this.scrollTo.bind(this);
      }

      requestAnimationFrame(() => this.scrollTo(this.props.y));
    };
  };
}

const s = StyleSheet.create({
  scroll: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    padding: 15,
  } as ViewStyle,
  relative: {
    flex: 1,
    position: 'relative',
  },
});
