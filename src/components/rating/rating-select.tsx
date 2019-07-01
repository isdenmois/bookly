import React from 'react';
import { times } from 'rambdax';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { color } from 'types/colors';
import { TextM } from 'components/text';

const SIZE = 10;

interface Props {
  value: number;
  size?: number;
  style?: ViewStyle;
  onChange?: (value: number) => void;
}

export class RatingSelect extends React.PureComponent<Props> {
  static defaultProps: Partial<Props> = { size: SIZE };

  renderStars = times(index => (
    <Icon
      key={index}
      style={s.star}
      name='star'
      size={20}
      solid={index < this.props.value}
      onPress={() => this.props.onChange(index + 1)}
    />
  ));

  render() {
    const { value, size, style } = this.props;

    return (
      <View style={[s.container, style]}>
        {this.renderStars(size)}
        <TextM style={s.text}>{value}</TextM>
      </View>
    );
  }
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  star: {
    color: color.DeepOrange,
  } as TextStyle,
  text: {
    marginLeft: 10,
  } as TextStyle,
});
