import React, { FC } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Box, Text, TouchableBox } from 'components/theme';

type Props = {
  title: string;
  onPress?: () => void;
  onLongPress?: () => void;
};

export const Tile: FC<Props> = ({ title, onPress, onLongPress, children }) => {
  const Wrapper = onPress ? TouchableBox : Box;

  return (
    <Wrapper backgroundColor='tile' mx={1} mt={2} p={2} style={s.box} onPress={onPress} onLongPress={onLongPress}>
      <Text variant='tile' style={s.title}>
        {title}
      </Text>
      {children}
    </Wrapper>
  );
};

const s = StyleSheet.create({
  box: {
    ...Platform.select({
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '1px 2px 2px rgba(0, 0, 0, 0.25)',
      },
    }),
    borderRadius: 10,
    flex: 1,
  },
  title: {
    justifyContent: 'center',
    textAlign: 'center',
  },
});
