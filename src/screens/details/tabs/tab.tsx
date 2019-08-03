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
    screenHeight = Dimensions.get('screen').height;
    y = 0;
    scroll: ScrollView;

    onScrollEnd = event => {
      const y = event.nativeEvent.contentOffset.y;

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
                minHeight: this.screenHeight + headerHeight - 200 + 2 * tabsPadding,
                paddingTop: headerHeight + tabsPadding + 15,
              },
            ]}
            ref={this.setRef}
          >
            <WrappedComponent {...wrappedProps} />
          </Animated.ScrollView>
          {WrappedComponent.Fixed && <WrappedComponent.Fixed {...wrappedProps} />}
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
