import React from 'react';
import { StyleSheet, ScrollView, RefreshControl, ViewStyle } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { provider, inject, InjectorContext } from 'react-ioc';
import { observer } from 'mobx-react';
import { Database } from '@nozbe/watermelondb';
import { SyncService, Session } from 'services';
import { HomeService } from './home.service';
import { Hr } from 'components/hr';
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
  static contextType = InjectorContext;

  state: State = { refreshing: false };

  database = inject(this, Database);
  syncService = inject(this, SyncService);
  session = inject(this, Session);

  render() {
    return (
      <ScrollView contentContainerStyle={s.container} refreshControl={this.renderRefresh()}>
        <HomeHeader />

        <CurrentBook database={this.database} />

        <Hr margin={20} />

        <BookChallenge database={this.database} totalBooks={this.session.totalBooks} />

        <Hr />

        <NavigationLinks database={this.database} navigation={this.props.navigation} />
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
    backgroundColor: 'white',
    flex: 1,
  } as ViewStyle,
});
