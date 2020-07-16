import React from 'react';
import _ from 'lodash';
import { NavigationStackProp } from 'react-navigation-stack';
import { Animated, Dimensions, ViewStyle, TextStyle } from 'react-native';
import { TabView, TabBar, Route } from 'react-native-tab-view';
import { Scene } from 'react-native-tab-view/src/types';
import Book from 'store/book';
import { BookExtended } from 'types/book-extended';
import { BOOK_TYPES } from 'types/book-types';
import { withBook } from 'components/book-item';
import { dynamicColor } from 'types/colors';
import { BookMainInfo } from './book-main-info';
import { DynamicStyleSheet, ColorSchemeContext } from 'react-native-dynamic';

interface Props {
  book: Book & BookExtended;
  isExist: boolean;
  navigation: NavigationStackProp;
  tabs: any[];
  fantlabId?: string;
}

interface State {
  index: number;
  routes: Route[];
  headerHeight: number;
}

const SHOW_SIMILARS_ON = [BOOK_TYPES.novel, BOOK_TYPES.story, BOOK_TYPES.shortstory];

const HEADER_HEIGHT = 110;

@withBook
export class BookDetailsTabs extends React.Component<Props, State> {
  static contextType = ColorSchemeContext;

  state: State = {
    index: 0,
    routes: this.props.tabs,
    headerHeight: 0,
  };
  initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
  };
  tabCtrls: any = {};
  y: number;

  scrollY = new Animated.Value(0);

  get childrenBooksVisible() {
    return _.size(this.props.book.children) > 0;
  }

  get similarBooksVisible() {
    return SHOW_SIMILARS_ON.includes(this.props.book.type);
  }

  render() {
    return (
      <TabView
        lazy
        navigationState={this.state}
        renderTabBar={this.renderTabBar}
        renderScene={this.renderScene as any}
        onIndexChange={this.setIndex}
        initialLayout={this.initialLayout}
      />
    );
  }

  setIndex = index => this.setState({ index });

  onScrollEnd = (y: number) => {
    const topScroll = this.state.headerHeight - HEADER_HEIGHT;
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

  renderTabBar = props => {
    const s = ds[this.context];
    const color = dynamicColor.PrimaryText[this.context];

    return (
      <BookMainInfo
        book={this.props.book as any}
        scrollY={this.scrollY}
        headerHeight={this.state.headerHeight}
        scrollHeight={HEADER_HEIGHT}
        navigation={this.props.navigation}
        onLayout={this.setHeaderHeight}
        status={this.props.book.status}
        mode={this.context}
      >
        <TabBar
          {...props}
          scrollEnabled
          getLabelText={getLabelText}
          activeColor={color}
          inactiveColor={color}
          indicatorStyle={s.indicator}
          labelStyle={s.label}
          tabStyle={s.tabBar}
          style={s.tab}
        />
      </BookMainInfo>
    );
  };

  renderScene = ({ route }: Scene<Route & { component: any }>) => {
    const Component = route.component;

    return (
      <Component
        tab={route.key}
        book={this.props.book}
        navigation={this.props.navigation}
        y={this.y}
        scrollY={this.scrollY}
        headerHeight={this.state.headerHeight}
        onScrollEnd={this.onScrollEnd}
        isExist={this.props.isExist}
        fantlabId={this.props.fantlabId}
        lid={this.props.book.lid}
        mode={this.context}
        ref={ctrl => (this.tabCtrls[route.key] = ctrl)}
      />
    );
  };

  setHeaderHeight = ev => {
    const headerHeight = Math.round(ev.nativeEvent.layout.height) || 0;

    if (headerHeight !== this.state.headerHeight) {
      this.setState({ headerHeight });
    }
  };
}

function getLabelText(scene: Scene<Route>) {
  return scene.route.title;
}

const ds = new DynamicStyleSheet({
  indicator: {
    backgroundColor: dynamicColor.Primary,
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
    backgroundColor: dynamicColor.Background,
    zIndex: 1,
  } as ViewStyle,
});
