import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useColor } from 'types/colors';
import { settings, navigation, t } from 'services';
import { ListItem } from 'components';
import { readBooksQuery, wishBooksQuery } from '../home.queries';
import { useSetting } from 'services/settings';
import { useObservable } from 'utils/use-observable';

const getReadCount = () => readBooksQuery().observeCount();
const getWishBooks = () => wishBooksQuery().observeCount();

export function NavigationLinks() {
  const color = useColor().BlueIcon;
  const withAuthors = useSetting('authors');
  const readCount = useObservable(getReadCount, 0, []);
  const wishCount = useObservable(getWishBooks, 0, []);

  const openReadBooks = () => navigation.push('ReadList');
  const openWishBooks = () => navigation.push('WishList');
  const openBookSelect = () => navigation.push('BookSelect');
  const openStat = () => navigation.push('Stat');
  const openAuthors = () => navigation.push('Authors');
  const openProfile = () => navigation.push('Profile');

  return (
    <View style={s.container}>
      <ListItem
        onPress={openReadBooks}
        icon={<Icon name='flag' size={20} color={color} />}
        value={t('nav.read')}
        counter={readCount}
        testID='readCount'
      />
      <ListItem
        onPress={openWishBooks}
        icon={<Icon name='plus' size={20} color={color} />}
        value={t('nav.wish')}
        counter={wishCount}
        testID='wishCount'
      />
      <ListItem onPress={openBookSelect} icon={<Icon name='random' size={20} color={color} />} value={t('nav.pick')} />
      <ListItem onPress={openStat} icon={<Icon name='chart-bar' size={20} color={color} />} value={t('nav.stat')} />
      {withAuthors && (
        <ListItem
          onPress={openAuthors}
          icon={<Icon name='address-book' size={20} color={color} />}
          value={t('nav.authors')}
        />
      )}
      <ListItem
        onPress={openProfile}
        icon={<Icon name='user' size={20} color={color} />}
        value={t('nav.profile')}
        counter={settings.userId}
        testID='profileName'
        last
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginTop: 10,
  } as ViewStyle,
});
