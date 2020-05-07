import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextStyle, Insets } from 'react-native';
import { color } from 'types/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface Props {
  numberOfLines?: number;
  children: React.ReactNode;
  onShrink?: () => void;
}

const hitSlop: Insets = { top: 20, right: 20, bottom: 20, left: 20 };

export function ExpandableText(props: Props) {
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
          <Text style={s.toggleText}>{expanded ? 'Свернуть' : 'Читать далее'}</Text>
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

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  up: {
    width: 20,
    marginLeft: 10,
    backgroundColor: color.LightBackground,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 7,
  },
  body: {
    color: color.Review,
    marginTop: 10,
  } as TextStyle,
  toggleText: {
    paddingVertical: 5,
    textAlign: 'right',
    color: color.ReadMore,
  } as TextStyle,
});
