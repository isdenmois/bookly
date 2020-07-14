import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import withObservables from '@nozbe/with-observables';
import { observer } from 'mobx-react';
import { color } from 'types/colors';
import { session, navigation, t } from 'services';
import { ListItem } from 'components';
import { readBooksQuery, wishBooksQuery } from '../home.queries';

interface Props {
  readCount?: number;
  wishCount?: number;
}

const withCounts: Function = withObservables(null, () => ({
  readCount: readBooksQuery().observeCount(),
  wishCount: wishBooksQuery().observeCount(),
}));

@withCounts
@observer
export class NavigationLinks extends React.Component<Props> {
  render() {
    return (
      <View style={s.container}>
        <ListItem
          onPress={this.openReadBooks}
          icon={<Icon name='flag' size={20} color={color.BlueIcon} />}
          value={t('nav.read')}
          counter={this.props.readCount}
          testID='ReadCount'
        />
        <ListItem
          onPress={this.openWishBooks}
          icon={<Icon name='plus' size={20} color={color.BlueIcon} />}
          value={t('nav.wish')}
          counter={this.props.wishCount}
          testID='WishCount'
        />
        <ListItem
          onPress={this.openBookSelect}
          icon={<Icon name='random' size={20} color={color.BlueIcon} />}
          value={t('nav.pick')}
        />
        <ListItem
          onPress={this.openStat}
          icon={<Icon name='chart-bar' size={20} color={color.BlueIcon} />}
          value={t('nav.stat')}
        />
        <ListItem
          onPress={this.openProfile}
          icon={<Icon name='user' size={20} color={color.BlueIcon} />}
          value={t('nav.profile')}
          counter={session.userId}
          testID='ProfileName'
          last
        />
      </View>
    );
  }

  openReadBooks = () => navigation.push('ReadList');
  openWishBooks = () => navigation.push('WishList');
  openBookSelect = () => navigation.push('BookSelect');
  openStat = () => navigation.push('Stat');
  openProfile = () => navigation.push('Profile');
}

const s = StyleSheet.create({
  container: {
    marginTop: 10,
  } as ViewStyle,
});
