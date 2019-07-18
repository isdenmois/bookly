import React from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { StyleSheet, Dimensions, ViewStyle, TextStyle } from 'react-native';
import { TabView, TabBar, Route } from 'react-native-tab-view';
import { Scene } from 'react-native-tab-view/src/types';
import Book from 'store/book';
import { BookExtended } from 'types/book-extended';
import { DetailsTab } from './details-tab';
import { ReviewsTab } from './reviews-tab';
import { color } from 'types/colors';

interface Props extends NavigationScreenProps {
  book: BookExtended;
  record?: Book;
}

interface State {
  index: number;
  routes: Route[];
}

export class BookDetailsTabs extends React.Component<Props, State> {
  state: State = {
    index: 0,
    routes: [{ key: 'details', title: 'Детали' }, { key: 'reviews', title: 'Отзывы' }],
  };
  initialLayout = {
    height: 0,
    width: Dimensions.get('window').width,
  };

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

  renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      getLabelText={getLabelText}
      activeColor={color.PrimaryText}
      inactiveColor={color.PrimaryText}
      indicatorStyle={s.indicator}
      labelStyle={s.label}
      tabStyle={s.tab}
      style={s.tabBar}
    />
  );

  renderScene = ({ route }: Scene<Route>) => {
    switch (route.key) {
      case 'details':
        return <DetailsTab book={this.props.book} record={this.props.record} navigation={this.props.navigation} />;
      case 'reviews':
        return <ReviewsTab bookId={this.props.book.id} />;
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
  } as ViewStyle,
});
