import React from 'react';
import cn from 'react-native-classnames';
import { Platform, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { color } from 'enums/colors';
import { TextL } from 'components/text';

interface Props {
  title?: string;
  padding?: boolean;
  margin?: boolean;
  style?: ViewStyle;
}

export class Card extends React.Component<Props> {
  render() {
    const { title, padding, margin, style } = this.props;

    return (
      <View style={[style, cn(s, ['container', { padding, margin }])]}>
        {title && <TextL style={s.titleStyle}>{title}</TextL>}
        {this.props.children}
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: color.Black,
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 1,
        shadowRadius: 1,
      },
      android: {
        elevation: 4,
      },
    }),
  } as ViewStyle,
  padding: {
    padding: 10,
  } as ViewStyle,
  margin: {
    margin: 10,
  } as ViewStyle,
  titleStyle: {
    textAlign: 'center',
    color: color.Black,
  } as TextStyle,
});
