import React, { memo, useMemo } from 'react';
import { Linking, StyleSheet, View, TextStyle, ViewStyle } from 'react-native';

import { color } from 'types/colors';
import { getNavigation } from 'services';
import { TouchIcon } from 'components';

type Props = {
  bookId: string;
};

export const BookDetailsHeader = memo<Props>(({ bookId, children }) => {
  const url = useMemo(
    () =>
      bookId && bookId.startsWith('l_')
        ? `https://livelib.ru/book/${bookId.replace('l_', '')}`
        : `https://fantlab.ru/work${bookId}`,
    [bookId],
  );

  const openWeb = () => Linking.openURL(url);
  const goBack = () => getNavigation().goBack();
  const goToHome = () => getNavigation().popToTop();

  return (
    <View style={s.container}>
      <TouchIcon
        style={s.icon}
        paddingHorizontal={15}
        name='arrow-left'
        size={24}
        color='white'
        onPress={goBack}
        onLongPress={goToHome}
        testID='goBackButton'
      />
      {children}
      <TouchIcon style={s.icon} paddingHorizontal={15} name='globe' size={24} color='white' onPress={openWeb} />
    </View>
  );
});

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingVertical: 10,
  } as ViewStyle,
  icon: {
    zIndex: 2,
  } as ViewStyle,
  title: {
    color: color.PrimaryText,
    fontSize: 24,
    textAlign: 'center',
    flex: 1,
  } as TextStyle,
  iconPlaceholder: {
    width: 45,
  },
});
