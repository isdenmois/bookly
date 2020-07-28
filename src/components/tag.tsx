import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { DynamicStyleSheet } from 'react-native-dynamic';
import { dynamicColor, useSColor } from 'types/colors';
import { t } from 'services';

interface Props {
  title: string;
  selected?: boolean;
  outline?: boolean;
  icon?: string;
  onPress?: () => void;
}

function TagComponent({ title, selected, outline, icon, onPress }: Props) {
  const Wrapper: any = onPress && !selected ? TouchableOpacity : View;
  const { s, color } = useSColor(ds);
  const wraperStyle = [s.wrapper, outline ? s.outline : null, selected ? s.selected : null];

  return (
    <Wrapper style={wraperStyle} onPress={onPress}>
      <Text style={s.text}>{t(title)}</Text>
      {!!icon && <Icon style={s.icon} name={icon} size={14} color={color.Review} />}
    </Wrapper>
  );
}

export const Tag = React.memo(TagComponent);

const ds = new DynamicStyleSheet({
  wrapper: {
    backgroundColor: dynamicColor.LightBackground,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  outline: {
    backgroundColor: null,
    borderColor: dynamicColor.LightBackground,
    borderWidth: 1,
  } as ViewStyle,
  selected: {
    backgroundColor: dynamicColor.LightBackground,
  } as ViewStyle,
  text: {
    color: dynamicColor.Review,
    fontSize: 14,
    lineHeight: 16,
  } as TextStyle,
  icon: {
    marginLeft: 5,
  },
});
