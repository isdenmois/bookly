import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextStyle, Insets, ViewStyle } from 'react-native';
import { dynamicColor } from 'types/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { DynamicStyleSheet, useDynamicStyleSheet } from 'react-native-dynamic';
import { t } from 'services';

interface Props {
  numberOfLines?: number;
  children: React.ReactNode;
  onShrink?: () => void;
}

const hitSlop: Insets = { top: 20, right: 20, bottom: 20, left: 20 };

export function ExpandableText(props: Props) {
  const s = useDynamicStyleSheet(ds);

  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = useCallback(() => {
    if (expanded && props.onShrink) {
      props.onShrink();
    }
    setExpanded(!expanded);
  }, [expanded]);
  const lines = expanded ? null : props.numberOfLines;
  const onTextPress = expanded ? null : toggleExpanded;

  return (
    <View style={s.container}>
      <View style={{ flex: 1 }}>
        <Text style={s.body} numberOfLines={lines} onPress={onTextPress}>
          {props.children}
        </Text>

        <TouchableOpacity onPress={toggleExpanded} hitSlop={hitSlop}>
          <Text style={s.toggleText}>{t(expanded ? 'common.collapse' : 'common.read-more')}</Text>
        </TouchableOpacity>
      </View>

      {expanded && (
        <TouchableOpacity onPress={toggleExpanded} style={s.up}>
          <Icon name='chevron-up' />
        </TouchableOpacity>
      )}
    </View>
  );
}

ExpandableText.defaultProps = {
  numberOfLines: 3,
};

const ds = new DynamicStyleSheet({
  container: {
    flexDirection: 'row',
  } as ViewStyle,
  up: {
    width: 20,
    marginLeft: 10,
    backgroundColor: dynamicColor.LightBackground,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 7,
  } as ViewStyle,
  body: {
    color: dynamicColor.Review,
    marginTop: 10,
  } as TextStyle,
  toggleText: {
    paddingVertical: 5,
    textAlign: 'right',
    color: dynamicColor.ReadMore,
  } as TextStyle,
});
