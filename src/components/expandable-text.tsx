import React from 'react';
import { Text, TouchableOpacity, StyleSheet, TextStyle } from 'react-native';
import { color } from 'types/colors';

interface Props {
  numberOfLines?: number;
  children: React.ReactNode;
}

export function ExpandableText(props: Props) {
  const [expanded, setExpanded] = React.useState(false);
  const toggleExpanded = React.useCallback(() => setExpanded(!expanded), [expanded]);
  const lines = expanded ? null : props.numberOfLines;
  const onTextPress = expanded ? null : toggleExpanded;

  return (
    <>
      <Text style={s.body} numberOfLines={lines} onPress={onTextPress}>
        {props.children}
      </Text>

      <TouchableOpacity onPress={toggleExpanded}>
        <Text style={s.toggleText}>{expanded ? 'Свернуть' : 'Читать далее'}</Text>
      </TouchableOpacity>
    </>
  );
}

ExpandableText.defaultProps = {
  numberOfLines: 3,
};

const s = StyleSheet.create({
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
