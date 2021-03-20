import React from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import withObservables from '@nozbe/with-observables';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDarkModeContext, DynamicStyleSheet } from 'react-native-dynamic';
import { getColor, dynamicColor } from 'types/colors';
import { openModal, t } from 'services';
import { Button, TextM } from 'components';
import { wishBooksQuery } from '../home.queries';
import { ModalRoutes } from 'navigation/routes';

interface Props {
  wishBooksCount?: number;
}

const withWishBooksCount: Function = withObservables(null, () => ({
  wishBooksCount: wishBooksQuery().observeCount(),
}));

export const EmptyBook = withWishBooksCount(({ wishBooksCount }: Props) => {
  const openBookSelect = () => openModal(ModalRoutes.BookSelect);
  const mode = useDarkModeContext();
  const s = ds[mode];

  return (
    <View style={s.container}>
      <Icon name='bookmark' size={36} color={getColor(mode).Empty} />
      {!wishBooksCount && <TextM style={s.text}>{t('home.empty.no-books')}</TextM>}
      {!!wishBooksCount && <TextM style={s.text}>{t('home.empty.choose')}</TextM>}
      {!!wishBooksCount && (
        <Button testID='bookSelectButton' onPress={openBookSelect} style={s.button} label={t('modal.select-book')} />
      )}
    </View>
  );
});

const ds = new DynamicStyleSheet({
  container: {
    alignItems: 'center',
    marginTop: 35,
  } as ViewStyle,
  text: {
    color: dynamicColor.Empty,
    marginTop: 25,
    textAlign: 'center',
  } as TextStyle,
  button: {
    marginTop: 25,
  } as ViewStyle,
});
