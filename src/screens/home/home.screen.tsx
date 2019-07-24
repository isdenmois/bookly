import React from 'react';
import { StyleSheet, ScrollView, RefreshControl, ViewStyle } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { observer } from 'mobx-react';
import { Database } from '@nozbe/watermelondb';
import { color } from 'types/colors';
import { SyncService, Session, inject, provider } from 'services';
import { Hr } from 'components/hr';
import { HomeService } from './home.service';
import { HomeHeader } from './components/header';
import { CurrentBook } from './components/current-book';
import { BookChallenge } from './components/book-challenge';
import { NavigationLinks } from './components/navigation-links';

interface State {
  refreshing: boolean;
}

@provider(HomeService)
@observer
export class HomeScreen extends React.Component<NavigationScreenProps, State> {
  state: State = { refreshing: false };

  database = inject(Database);
  syncService = inject(SyncService);
  session = inject(Session);

  render() {
    return (
      <ScrollView testID='homeScreen' contentContainerStyle={s.container} refreshControl={this.renderRefresh()}>
        <HomeHeader />

        <CurrentBook database={this.database} />

        <Hr margin={20} />

        <BookChallenge database={this.database} totalBooks={this.session.totalBooks} />

        <Hr />

        <NavigationLinks database={this.database} />
      </ScrollView>
    );
  }

  renderRefresh() {
    return <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refresh} />;
  }

  refresh = async () => {
    this.setState({ refreshing: true });

    await this.syncService.sync();

    this.setState({ refreshing: false });
  };
}

const s = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 24,
    backgroundColor: color.Background,
    flex: 1,
  } as ViewStyle,
});
