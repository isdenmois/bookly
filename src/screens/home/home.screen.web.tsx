import React from 'react';
import { History } from 'history';
import { inject, InjectorContext, provider } from 'react-ioc';
import { Database } from '@nozbe/watermelondb';
import { observer } from 'mobx-react';
import { Session, SyncService } from 'services';
import { HomeService } from './home.service';
import { HomeHeader } from './components/header';
import { CurrentBook } from './components/current-book';

interface Props {
  history: History;
}

@provider(HomeService)
@observer
export class HomePage extends React.Component<Props> {
  static contextType = InjectorContext;

  session = inject(this, Session);
  database = inject(this, Database);
  syncService = inject(this, SyncService);

  render() {
    return (
      <div style={{ padding: '10px 24px' }}>
        <HomeHeader />
        <CurrentBook database={this.database} />

        <button onClick={this.logout}>Выйти</button>
      </div>
    );
  }

  logout = () => {
    this.session.stopSession();
    this.props.history.replace('/login');
    this.database.unsafeResetDatabase();
  };
}
