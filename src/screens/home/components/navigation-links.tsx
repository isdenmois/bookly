import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { NavigationScreenProps } from 'react-navigation';
import { InjectorContext, inject } from 'react-ioc';
import Icon from 'react-native-vector-icons/FontAwesome5';
import withObservables from '@nozbe/with-observables';
import { Database } from '@nozbe/watermelondb';
import { notImplemented } from 'utils/not-implemented-yet';
import { readBooksQuery, wishBooksQuery } from '../home.service';
import { ListItem } from 'components/list-item';
import { Session } from 'services';

interface Props extends NavigationScreenProps {
  database: Database;
  readCount?: number;
  wishCount?: number;
}

@withObservables([], ({ database }) => ({
  readCount: readBooksQuery(database).observeCount(),
  wishCount: wishBooksQuery(database).observeCount(),
}))
export class NavigationLinks extends React.Component<Props> {
  static contextType = InjectorContext;
  session = inject(this, Session);

  render() {
    return (
      <View style={s.container}>
        <ListItem
          onPress={this.openReadBooks}
          icon={<Icon name='flag' size={20} color='#0D47A1' />}
          value='Прочитанные'
          counter={this.props.readCount}
        />
        <ListItem
          onPress={this.openWishBooks}
          icon={<Icon name='plus' size={20} color='#0D47A1' />}
          value='Хочу прочитать'
          counter={this.props.wishCount}
        />
        <ListItem
          onPress={notImplemented}
          icon={<Icon name='sync' size={20} color='#0D47A1' />}
          value='Синхронизация'
        />
        <ListItem
          onPress={this.openProfile}
          icon={<Icon name='user' size={20} color='#0D47A1' />}
          value='Профиль'
          counter={this.session.userId}
          last
        />
      </View>
    );
  }

  openReadBooks = () => this.props.navigation.push('ReadList');
  openWishBooks = () => this.props.navigation.push('WishList');
  openProfile = () => this.props.navigation.push('Profile');
}

const s = StyleSheet.create({
  container: {
    marginTop: 10,
  } as ViewStyle,
});
