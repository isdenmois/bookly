import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import withObservables from '@nozbe/with-observables';
import { Database } from '@nozbe/watermelondb';
import { color } from 'types/colors';
import { inject, Session, Navigation } from 'services';
import { notImplemented } from 'utils/not-implemented-yet';
import { ListItem } from 'components';
import { readBooksQuery, wishBooksQuery } from '../home.queries';

interface Props {
  database: Database;
  readCount?: number;
  wishCount?: number;
}

const withCounts: Function = withObservables(null, ({ database }: Props) => ({
  readCount: readBooksQuery(database).observeCount(),
  wishCount: wishBooksQuery(database).observeCount(),
}));

@withCounts
export class NavigationLinks extends React.Component<Props> {
  session = inject(Session);
  navigation = inject(Navigation);

  render() {
    return (
      <View style={s.container}>
        <ListItem
          onPress={this.openReadBooks}
          icon={<Icon name='flag' size={20} color={color.BlueIcon} />}
          value='Прочитанные'
          counter={this.props.readCount}
        />
        <ListItem
          onPress={this.openWishBooks}
          icon={<Icon name='plus' size={20} color={color.BlueIcon} />}
          value='Хочу прочитать'
          counter={this.props.wishCount}
        />
        <ListItem
          onPress={notImplemented}
          icon={<Icon name='sync' size={20} color={color.BlueIcon} />}
          value='Синхронизация'
        />
        <ListItem
          onPress={this.openBookSelect}
          icon={<Icon name='random' size={20} color={color.BlueIcon} />}
          value='Выбрать книгу'
        />
        <ListItem
          onPress={this.openProfile}
          icon={<Icon name='user' size={20} color={color.BlueIcon} />}
          value='Профиль'
          counter={this.session.userId}
          last
        />
      </View>
    );
  }

  openReadBooks = () => this.navigation.push('ReadList');
  openWishBooks = () => this.navigation.push('WishList');
  openBookSelect = () => this.navigation.push('BookSelect');
  openProfile = () => this.navigation.push('Profile');
}

const s = StyleSheet.create({
  container: {
    marginTop: 10,
  } as ViewStyle,
});
