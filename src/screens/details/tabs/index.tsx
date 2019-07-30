import React from 'react';
import * as _ from 'lodash';
import { NavigationScreenProps, ScrollView } from 'react-navigation';
import { Animated, StyleSheet, Dimensions, View, ViewStyle, TextStyle } from 'react-native';
import { TabView, TabBar, Route } from 'react-native-tab-view';
import { Scene } from 'react-native-tab-view/src/types';
import Book from 'store/book';
import { BookExtended } from 'types/book-extended';
import { DetailsTab } from './details-tab';
import { ReviewsTab } from './reviews-tab';
import { color } from 'types/colors';

interface Props extends NavigationScreenProps {
  book: BookExtended;
  renderHeader: (scrollY?: Animated.Value, height?: number) => React.ReactNode;
  record?: Book;
}

interface State {
  index: number;
  routes: Route[];
  headerHeight: number;
}

export class BookDetailsTabs extends React.Component<Props, State> {
  state: State = {
    index: 0,
    routes: [{ key: 'details', title: 'Детали' }, { key: 'reviews', title: 'Отзывы' }],
    headerHeight: 300,
  };
  initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
  };
  tabCtrls: any = {};
  y: number;

  scrollY = new Animated.Value(0);

  render() {
    return (
      <TabView
        lazy
        navigationState={this.state}
        renderTabBar={this.renderTabBar}
        renderScene={this.renderScene}
        onIndexChange={this.setIndex}
        initialLayout={this.initialLayout}
      />
    );
  }

  setIndex = index => this.setState({ index });

  onScrollEnd = (y: number) => {
    const topScroll = this.state.headerHeight - 85;
    this.y = y = Math.min(y, topScroll);

    _.forEach(this.tabCtrls, ctrl => {
      if (y >= topScroll && ctrl.y < y) {
        ctrl.scrollTo(y);
      }

      if (y < topScroll && ctrl.y !== y) {
        ctrl.scrollTo(y);
      }
    });
  };

  renderTabBar = props => (
    <View style={{ position: 'relative' }}>
      <Animated.View
        style={[
          s.header,
          {
            translateY: this.scrollY.interpolate({
              inputRange: [0, this.state.headerHeight - 150],
              outputRange: [0, 150 - this.state.headerHeight],
              extrapolate: 'clamp',
            }),
          },
        ]}
        onLayout={this.setHeaderHeight}
      >
        {this.props.renderHeader(this.scrollY, this.state.headerHeight)}
      </Animated.View>

      <Animated.View
        style={{
          zIndex: 1,
          translateY: this.scrollY.interpolate({
            inputRange: [0, this.state.headerHeight - 100 + 15],
            outputRange: [this.state.headerHeight + 15, 100],
            extrapolate: 'clamp',
          }),
        }}
      >
        <TabBar
          {...props}
          scrollEnabled
          getLabelText={getLabelText}
          activeColor={color.PrimaryText}
          inactiveColor={color.PrimaryText}
          indicatorStyle={s.indicator}
          labelStyle={s.label}
          tabStyle={s.tabBar}
          style={[s.tab]}
        />
      </Animated.View>
    </View>
  );

  renderScene = ({ route }: Scene<Route>) => {
    switch (route.key) {
      case 'details':
        return (
          <DetailsTab
            y={this.y}
            scrollY={this.scrollY}
            headerHeight={this.state.headerHeight}
            book={this.props.book}
            record={this.props.record}
            navigation={this.props.navigation}
            onScrollEnd={this.onScrollEnd}
            ref={ctrl => (this.tabCtrls['details'] = ctrl)}
          />
        );
      case 'reviews':
        return (
          <ReviewsTab
            y={this.y}
            scrollY={this.scrollY}
            headerHeight={this.state.headerHeight}
            book={this.props.record}
            navigation={this.props.navigation}
            onScrollEnd={this.onScrollEnd}
            ref={ctrl => (this.tabCtrls['review'] = ctrl)}
          />
        );
    }
  };

  setHeaderHeight = ev => {
    const headerHeight = Math.round(ev.nativeEvent.layout.height);

    if (headerHeight !== this.state.headerHeight) {
      this.setState({ headerHeight });
    }
  };
}

function getLabelText(scene: Scene<Route>) {
  return scene.route.title;
}

const s = StyleSheet.create({
  indicator: {
    backgroundColor: color.Primary,
  } as ViewStyle,
  label: {
    fontSize: 18,
  } as TextStyle,
  tabBar: {
    paddingVertical: 5,
    minHeight: 10,
    width: 'auto',
  } as ViewStyle,
  tab: {
    backgroundColor: color.Background,
    zIndex: 1,
  } as ViewStyle,
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  } as ViewStyle,
});
