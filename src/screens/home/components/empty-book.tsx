import React from 'react';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import withObservables from '@nozbe/with-observables';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { color } from 'types/colors';
import { navigation, t } from 'services';
import { Button, TextM } from 'components';
import { wishBooksQuery } from '../home.queries';

interface Props {
  wishBooksCount?: number;
}

const withWishBooksCount: Function = withObservables(null, () => ({
  wishBooksCount: wishBooksQuery().observeCount(),
}));

export const EmptyBook = withWishBooksCount(({ wishBooksCount }: Props) => {
  const openBookSelect = () => navigation.navigate('/modal/book-select');

  return (
    <View style={s.container}>
      <Icon name='bookmark' size={36} color={color.Empty} />
      {!wishBooksCount && <TextM style={s.text}>{t('home.empty.no-books')}</TextM>}
      {!!wishBooksCount && <TextM style={s.text}>{t('home.empty.choose')}</TextM>}
      {!!wishBooksCount && (
        <Button testID='BookSelectButton' onPress={openBookSelect} style={s.button} label={t('modal.select-book')} />
      )}
    </View>
  );
});

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 35,
  } as ViewStyle,
  text: {
    color: color.Empty,
    marginTop: 25,
    textAlign: 'center',
  } as TextStyle,
  button: {
    marginTop: 25,
  } as ViewStyle,
});
