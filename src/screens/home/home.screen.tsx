import React from 'react';
import { StyleSheet, ScrollView, RefreshControl, ViewStyle } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { syncService } from 'services';
import { Screen } from 'components/screen';
import { HomeHeader } from './components/header';
import { CurrentBook } from './components/current-book';
import { BookChallenge } from './components/book-challenge';
import { NavigationLinks } from './components/navigation-links';

interface Props {
  navigation: NavigationScreenProp<any>;
}

interface State {
  refreshing: boolean;
}

export class HomeScreen extends React.Component<Props, State> {
  state: State = { refreshing: false };

  render() {
    return (
      <Screen>
        <ScrollView testID='homeScreen' contentContainerStyle={s.container} refreshControl={this.renderRefresh()}>
          <HomeHeader />

          <CurrentBook />

          <BookChallenge />

          <NavigationLinks />
        </ScrollView>
      </Screen>
    );
  }

  renderRefresh() {
    return <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh} />;
  }

  refresh = async () => {
    this.setState({ refreshing: true });

    await syncService.sync();

    this.setState({ refreshing: false });
  };
}

const s = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 24,
    flex: 1,
  } as ViewStyle,
});
