import React from 'react';
import _ from 'lodash';
import { Dimensions, Animated, View, ScrollView, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  scrollY: Animated.Value;
  headerHeight: number;
  tabsPadding: number;
  y?: number;
  onScrollEnd: (y: number) => void;
}

export function withScroll(WrappedComponent): any {
  return class Tab extends React.Component<Props> {
    screenHeight = Dimensions.get('window').height;
    y = 0;
    scroll: ScrollView;

    onScrollEnd = event => {
      const y = Math.round(event.nativeEvent.contentOffset.y);

      this.y = y;

      this.props.onScrollEnd(y);
    };

    scrollTo(y: number) {
      this.y = y;

      if (this.scroll) {
        this.scroll.scrollTo({ y, animated: false });
      }
    }

    render() {
      const { scrollY, headerHeight, tabsPadding } = this.props;
      const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true });
      const wrappedProps = _.omit(this.props, ['y', 'scrollY', 'headerHeight', 'onScrollEnd']);
      const paddingTop = headerHeight + tabsPadding + 15;
      const minHeight = this.screenHeight + paddingTop - 130;

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
            <WrappedComponent {...wrappedProps} />
          </Animated.ScrollView>
          {WrappedComponent.Fixed && <WrappedComponent.Fixed {...wrappedProps} scrollY={scrollY} />}
        </View>
      );
    }

    onSubviewLoad = () => this.scrollTo(this.props.y);

    setRef = view => {
      this.scroll = view && view._component;

      setTimeout(() => this.scrollTo(this.props.y));
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
